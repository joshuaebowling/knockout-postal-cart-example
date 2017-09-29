const
    ko = require('../../../lib/knockout-latest'),
    _ = require('lodash');

module.exports = function ProductsModel(services, attributes) {
    const vm = {
        attributes: attributes,
        products: ko.observableArray([])
    };

    // listen for when the product service returns a list of products, will also work for paging 
    services.productService.subscriptions.onGet((payload, env) => {
        var products;
        
        vm.products.removeAll();
        _.each(payload.result.page, (product) => vm.products.push(product));
    });

    return vm;
};