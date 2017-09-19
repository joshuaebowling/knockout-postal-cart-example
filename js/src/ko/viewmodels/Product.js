const ko = require('ko');

module.exports = function ProductModel(context) {
    var vm;

    vm = {
        model: context.model,
        addToBag: () =>
            cartService.change(context.model, 1)
    };

    return vm;
};