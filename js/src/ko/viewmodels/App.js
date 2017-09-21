const ko = require('ko');

module.exports = function AppModel(services, attributes) {
    const vm = {
        attributes: attributes,
        title: 'Welcome to the Postal Smart Cart',
        subtotal: ko.observable(0),
        tax: ko.observable(0),
        total: ko.observable(0)
    };

    vm.show = ko.computed(() => { 
        return vm.subtotal() > 0; 
    });
    
    // subscriptions for controller
    cartService.subscriptions.anyResponse((data, env) => {
        // same thing here, replace each value
        vm.subtotal(data.cart.totals.subTotal);
        vm.tax(data.cart.totals.tax);
        vm.total(data.cart.totals.total);
    });

    return vm;
};