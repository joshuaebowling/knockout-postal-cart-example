const ko = require('../../../lib/knockout-latest');

module.exports = function CartModel(services, attributes) {
    var vm;

    vm = {
        attributes: attributes,
        bag: ko.observableArray([]),
        subtotal: ko.observable(0),
        tax: ko.observable(0),
        total: ko.observable(0),
        show:ko.observable(false)
    };

    vm.show = ko.computed(() => { 
        return vm.subtotal() > 0; 
    });

    // subscriptions for controller
    services.cartService.subscriptions.anyResponse((data, env) => {
        // clear it
        vm.bag.removeAll();
        // repopulate without changing the reference -- rivets won't pickup on it changes like vm.bag = x, you have to repopulate the original array
        vm.subtotal(data.cart.totals.subTotal);
        vm.tax(data.cart.totals.tax);
        vm.total(data.cart.totals.total);
        _.each(data.cart.store, (item) => vm.bag.push(item));
    });

    return vm;
};