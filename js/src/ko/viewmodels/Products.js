const
    ko = require('ko'),
    _ = require('lodash');

module.exports = function ProductsModel(attributes) {
    var vm;

    vm = {
        attributes: attributes,
        products: ko.observableArray([])
    };

    // listen for when the product service returns a list of products, will also work for paging 
    productService.subscriptions.onGet((payload, env) => {
        var products;
        vm.products.removeAll();
        _.each(payload.result.page, (product) => vm.products.push(product));
    });

    productService.get({});
    return vm;
};