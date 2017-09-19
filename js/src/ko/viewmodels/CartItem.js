const ko = require('ko');

module.exports = function CartItemModel(context) {
    var vm;

    vm = {
        model: context.model,
        addItem: () =>
          cartService.change(vm.model, 1),
        removeItem: () =>
          cartService.change(vm.model, -1)
    };

    return vm;
};