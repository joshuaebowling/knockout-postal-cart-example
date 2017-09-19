const ko = require('ko');

module.exports = function ItemsInCartModel() {
    var vm;

    vm = {
        itemsInCart: ko.observable(0)
    };

    cartService.subscriptions.anyResponse((data, env) => {
        vm.itemsInCart(data.cart.totals.itemsInCart);
    });

    return vm;
};