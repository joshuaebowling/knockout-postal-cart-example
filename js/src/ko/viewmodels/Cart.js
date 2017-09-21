const ko = require('ko');

module.exports = function CartModel(services, attributes) {
    var vm;

    vm = {
        attributes: attributes,
        bag: ko.observableArray([])
    };

    // subscriptions for controller
    services.cartService.subscriptions.anyResponse((data, env) => {
        // clear it
        vm.bag.removeAll();
        // repopulate without changing the reference -- rivets won't pickup on it changes like vm.bag = x, you have to repopulate the original array
        _.each(data.cart.store, (item) => vm.bag.push(item));
    });

    return vm;
};