const 
postal = require('postal'),
_ = require('lodash');
module.exports = _.memoize(() => {
    var channel;
    const messageTypes = {alert: '!', info: 'i'};
    channel = postal.channel('message');
    channel.subscribe('display.request', (message, env) => {
        // check to see if there's any subscription
        if(postal.getSubscribersFor({channel: 'message', topic:'display.response'}).length === 0) throw new Info("Please Add A Message ViewModel To The App");
        channel.publish('display.response', message);
    });
    return {
        // queue would be be good here
        display: function(type, text) {
            channel.publish('display.request', {type, text});
        },
        subscriptions: {
            displayResponse: function MessageService_displayResponse(todo) {
                channel.subscribe('display.response', todo);
            }
        },
        constants: {messageTypes}

    }
});