const ko = require('ko');

module.exports = function CartItemModel(services, context) {
    var cartService, vm;

    cartService = services.cartService;
    vm = {
        model: context.model,
        addItem: () =>
          cartService.change(vm.model, 1),
        removeItem: () =>
          cartService.change(vm.model, -1)
    };

    return vm;
};