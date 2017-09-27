const 
postal = require('postal'),
_ = require('lodash'),
productService = require('./Product')();
module.exports = _.memoize(() => {
    var channel, data, init;
    channel = postal.channel('certification');

    channel.subscribe('get.request', (message, env) => {
        console.log('got request');
        var products, todo, result;
        todo = function(data) {
            products = data.all;
            result = _.chain(products).map(p => p.certifications).flatten().uniq().without(null).value();
            channel.publish('get.response', result);    
        };

        productService.subscriptions.onGet(todo);
    }).once();

    return {
        // queue would be be good here
        get: () => 
            channel.publish('get.request'),
        subscriptions: {
            onGet: (todo) =>
                channel.subscribe('get.response', todo)
        }

    }
});