const 
postal = require('postal'),
_ = require('lodash');
module.exports = _.memoize(() => {
    var channel;
    channel = postal.channel('certification');
    channel.subscribe('get.request', (message, env) => {
        var result;
        result = _.chain(productData).map(p => p.certifications).flatten().uniq().without(null).value();
        channel.publish('get.response', result);
    });
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