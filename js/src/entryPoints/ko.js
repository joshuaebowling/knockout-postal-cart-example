const
    ko = require('../../lib/knockout-latest.js'),
    models = require('../ko/viewmodels'),
    services = require('../services');
window.mm = models;
function App($, elSelector) {
    ko.components.register('app', {
        template:  $('#tmpl-app').html(),
        viewModel: models.Cart
    });
    ko.components.register('cart', {
        template:  $('#tmpl-cart').html(),
        viewModel: models.Cart
    });
    ko.components.register('product', {
        template:  $('#tmpl-product').html(),
        viewModel: models.Product
    });
    ko.components.register('products', {
        template:  $('#tmpl-products').html(),
        viewModel: models.Products
    });
    ko.components.register('productsnavigation', {
        template:  $('#tmpl-products-navigation').html(),
        viewModel: models.ProductsNavigation
    });
    ko.components.register('cartitem', {
        template:  $('#tmpl-cart-item').html(),
        viewModel: models.CartItem
    });
    ko.components.register('freeshipping', {
        template:  $('#tmpl-freeshipping').html(),
        viewModel: models.FreeShipping
    });
    ko.components.register('itemsincart', {
        template:  $('#tmpl-items-in-cart').html(),
        viewModel: models.ItemsInCart
    });
    ko.components.register('message', {
        template:  $('#tmpl-message').html(),
        viewModel: models.Message
    });
    ko.components.register('certificationsfilter', {
        template:  $('#tmpl-certifications-filter').html(),
        viewModel: models.CertificationFilter
    });
    
    ko.applyBindings({}, $(elSelector)[0]);
};

App(jQuery, '#app');
//boot the products after its all loaded
_.defer(() => services.productService.get({}))