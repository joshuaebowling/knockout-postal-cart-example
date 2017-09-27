const ko = require('../../../lib/knockout-latest');

module.exports = function ProductModel(services, context) {
    var vm;

    vm = {
        model: context.model,
        addToBag: () =>
            services.cartService.change(context.model, 1)
    };

    return vm;
};