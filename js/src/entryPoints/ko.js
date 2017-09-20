var models = require('../ko/viewmodels')

(function App($, elSelector) {
    ko.components.register('cart', {
        template:  $('#tmpl-cart').html(),
        viewModel: models.CartModel
    });
    ko.components.register('product', {
        template:  $('#tmpl-product').html(),
        viewModel: models.ProductModel
    });
    ko.components.register('products', {
        template:  $('#tmpl-products').html(),
        viewModel: models.ProductsModel
    });
    ko.components.register('productsnavigation', {
        template:  $('#tmpl-products-navigation').html(),
        viewModel: models.ProductsModelNavigation
    });
    ko.components.register('bagitem', {
        template:  $('#tmpl-bag-item').html(),
        viewModel: models.BagItemModel
    });
    ko.components.register('bag', {
        template:  $('#tmpl-bag').html(),
        viewModel: models.BagModel
    });
    ko.components.register('freeshipping', {
        template:  $('#tmpl-freeshipping').html(),
        viewModel: models.FreeShippingModel
    });
    ko.components.register('itemsincart', {
        template:  $('#tmpl-items-in-cart').html(),
        viewModel: models.ItemsInCartModel
    });
    ko.components.register('message', {
        template:  $('#tmpl-message').html(),
        viewModel: models.MessageModel
    });
    ko.components.register('certificationsfilter', {
        template:  $('#tmpl-certifications-filter').html(),
        viewModel: models.CertificationFilterModel
    });
    
    ko.applyBindings({}, $(elSelector)[0]);
})(jQuery, '#app');