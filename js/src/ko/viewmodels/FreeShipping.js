const ko = require('ko');

module.exports = function FreeShippingModel() {
    var vm;

    vm = {
        subTotal: ko.observable(0),
        threshold: 400
    };
    
    vm.qualified = ko.computed(() => {
        return vm.threshold <= vm.subTotal();
    });

    cartService.subscriptions.anyResponse((data, env) => {
        vm.subTotal(data.cart.totals.subTotal);
    });

    return vm;
};