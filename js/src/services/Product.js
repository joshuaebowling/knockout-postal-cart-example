const 
    postal = require('postal'),
    _ = require('lodash'),
    cartService = require('./Cart')(),
    messageService = require('./Message')(),
    productRepository = require('../repositories/').products
;

module.exports = _.memoize(function ctor_ProductService() {
    const channel = postal.channel('product');
    var adjustAvailable, criteria, criteriate, currentPage, defaultCriteria, page, resetPage, store;

    criteria = {};
    productRepository().then((data) => {
        store =  _.map(_.sortBy(data, p => p.title),
            (item, i) => { 
                item.id = i;    
                return item;
            }
        );
    });

    adjustAvailable = function ProductService_adjustAvailable(product, quantity) {
        var found;
        
         found = _.find(store, (aproduct) => aproduct.id === product.id);
         /// TODO: if the found isnt found then publish to the MessageService
         found.available = found.available + quantity;
         return found; 
    };

    criteriate = function ProductService_criteriate(crit) {
        return (crit.certifications && !_.isEmpty(crit.certifications)) ?
        _.filter(store, (item) => _.intersection(item.certifications, crit.certifications).length > 0)
        : store;
    };

    resetPage = function ProductService_isCriteriaChanged(crit, page) {
        var bothNil, fullyIntersected;
        // compare filter-related properties of new criteria (crit) to saved (criteria)
        bothNil = (_.isNil(crit['certifications']) && _.isNil(criteria['certfications']));
        // if they are both arrays do the have the same members
        fullyIntersected = _.intersection(_.sortBy(crit.certifications, c => c), _.sortBy(criteria.certifications, c => c)).length === _.at(crit, 'certifications.length')[0];
        // they are both not true then there's no reason to resetPage
        return (bothNil || fullyIntersected) ? page : 1;
    };
    // pass in array when implement sorting or filtering
    page = function _page(set, limit, skip = 0) {
        // since the demo will only have item counts that are multiples of 5 & 5 is the page size
        // this naive impl will do fine
        var result;
        result = {
            skip: skip + limit,
            total: set.length
        };
        result.page =  _.slice(set, skip === store.length ? 0 : skip, limit + skip);
        return result;
    };

    // the default values the crit argument passed with get.request
    defaultCriteria = {
        limit: 5,
        skip: 0
    };
    // pickup any request for cart items
    channel.subscribe('get.request', (crit, env) => {
        var data;
        crit = _.defaults(crit, _.defaults(criteria, defaultCriteria));
        crit.skip = resetPage(crit, crit.skip);
        // store the criteria so paging doesn't interfere with filters
        criteria = _.defaults(crit, defaultCriteria); 
        currentPage = page(criteriate(crit), crit.limit, crit.skip);
        channel.publish('get.response', { result: currentPage, criteria, all: store});
    });


    // demonstrate custom topic in request.replyTopic
    cartService.subscriptions.onChange((data, env) => {
        var found, quantity;
        // an increase in cart is a decrease in product and vice-versa, so flip the value
        adjustAvailable(data.changed, -(data.quantity));
        if(data.changed.available === 0) messageService.display(messageService.constants.messageTypes.alert, "You bought us out!!!");
        // if the updated item is in the currentPage, publish the change
        if(_.find(currentPage.page, {id: data.changed.id})) { 
            channel.publish('get.response', {result: currentPage, criteria, all: store});
        }
    });

    return {
        get: (crit = {}) =>
            // allows all viewmodels processing in current stack to complete
            _.defer(() => channel.publish('get.request', crit)),
        subscriptions: {
            onGet: (todo) =>
                channel.subscribe('get.response', todo)
        }
    };

});