const
    ko = require('../../../lib/knockout-latest'),
    _ = require('lodash');

module.exports = function MessageModel(services, attributes) {
    const vm = {
        text: ko.observable(null),
        type: ko.observable(null),
        dismiss: function() {
            vm.text(null);
            vm.type(null);
        }
    };
    vm.show = ko.computed(() => {
        return !_.isNull(vm.text());
    });

    services.messageService.subscriptions.displayResponse((data, env) => {
        vm.text(data.text);
        vm.type(data.type);
    });

    return vm; 
};