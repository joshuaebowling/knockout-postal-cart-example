const 
postal = require('postal'),
_ = require('lodash');
module.exports = _.memoize(function ctor_CartService() {
    var adjustQuantity, cart, channel, totals, updateTotals;
    channel = postal.channel('cart');
    cart = {
        store: [],
        totals: {
            subTotal: 0,
            get tax() {
                return _.round(cart.totals.subTotal * .05, 2);
            },
            get total() {
                return _.round(cart.totals.subTotal + cart.totals.tax, 2);
            },
            get itemsInCart() {
                var result;

                result = 0;
                _.each(cart.store, (item) => { result +=  item.quantity; });
                return result;
            }
        }
    };

    adjustQuantity = function CartService_adjustQuantity(item, quantity) {
        var existentItem;

        existentItem = _.find(cart.store, (cartitem) => { return item.id === cartitem.id });
        if(existentItem) {
            existentItem.quantity += quantity;
            if(existentItem.quantity === 0) _.remove(cart.store, existentItem);
        } else {
            item.quantity = quantity;
            cart.store.push(item);
            // now the item is existent
            existentItem = item;
        }
        updateTotals();
        return existentItem;
    };

    updateTotals = function() {
        var result = 0;
        _.each(cart.store, (item) => result += (item.price * item.quantity));
        cart.totals.subTotal = result;
    };

    // pickup any request for cart items
    channel.subscribe('get.request', (crit, env) => {
        channel.publish('get.response', { cart });
    });

    channel.subscribe('change.request', (request, env) => {
        var changed;
        console.log(request);
        console.log(request.item.available - request.quantity <= 0);
        if(request.item.available - request.quantity < 0) return;
        changed = adjustQuantity(request.item, request.quantity);
        channel.publish('change.response', { cart, changed, quantity: request.quantity });
    });
    
    return {
        get: function(crit = {}) {
            postal.channel('cart').publish('get.request', crit);
        },
        change: function(item, quantity) {
            postal.channel('cart').publish('change.request', { item, quantity });
        },
        subscriptions: {
            // lets see about currying this 
            onChange: function(todo) { channel.subscribe('change.response', todo) },
            anyResponse: function(todo) { channel.subscribe('*.response', todo) }
        }
    };
});