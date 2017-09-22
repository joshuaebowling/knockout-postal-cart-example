const ko = require('../../../lib/knockout-latest');

module.exports = function FreeShippingModel(services, attributes) {
    const vm = {
        subTotal: ko.observable(0),
        threshold: 400
    };
    
    vm.qualified = ko.computed(() => {
        return vm.threshold <= vm.subTotal();
    });

    services.cartService.subscriptions.anyResponse((data, env) => {
        vm.subTotal(data.cart.totals.subTotal);
    });

    return vm;
};