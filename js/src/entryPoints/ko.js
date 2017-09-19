(function App($, elSelector) {
    ko.components.register('cart', {
        template:  $('#tmpl-cart').html(),
        viewModel: CartModel
    });
    ko.components.register('product', {
        template:  $('#tmpl-product').html(),
        viewModel: ProductModel
    });
    ko.components.register('products', {
        template:  $('#tmpl-products').html(),
        viewModel: ProductsModel
    });
    ko.components.register('productsnavigation', {
        template:  $('#tmpl-products-navigation').html(),
        viewModel: ProductsModelNavigation
    });
    ko.components.register('bagitem', {
        template:  $('#tmpl-bag-item').html(),
        viewModel: BagItemModel
    });
    ko.components.register('bag', {
        template:  $('#tmpl-bag').html(),
        viewModel: BagModel
    });
    ko.components.register('freeshipping', {
        template:  $('#tmpl-freeshipping').html(),
        viewModel: FreeShippingModel
    });
    ko.components.register('itemsincart', {
        template:  $('#tmpl-items-in-cart').html(),
        viewModel: ItemsInCartModel
    });
    ko.components.register('message', {
        template:  $('#tmpl-message').html(),
        viewModel: MessageModel
    });
    ko.components.register('certificationsfilter', {
        template:  $('#tmpl-certifications-filter').html(),
        viewModel: CertificationFilterModel
    });
    
    ko.applyBindings({}, $(elSelector)[0]);
})(jQuery, '#app');