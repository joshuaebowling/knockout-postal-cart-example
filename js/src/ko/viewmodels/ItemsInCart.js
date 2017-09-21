const ko = require('ko');

module.exports = function ItemsInCartModel(services, attributes) {
    const vm = {
        itemsInCart: ko.observable(0)
    };

    services.cartService.subscriptions.anyResponse((data, env) => {
        vm.itemsInCart(data.cart.totals.itemsInCart);
    });

    return vm;
};