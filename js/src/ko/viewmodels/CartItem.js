const ko = require('../../../lib/knockout-latest');

module.exports = function CartItemModel(services, context) {
    const vm = {
        model: context.model,
        addItem: () =>
          services.cartService.change(vm.model, 1),
        removeItem: () =>
          services.cartService.change(vm.model, -1)
    };

    return vm;
};