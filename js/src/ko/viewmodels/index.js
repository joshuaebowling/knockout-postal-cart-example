const services = require('../../services'),
partial = require('lodash').partial;

module.exports = {
    App: partial(require('./App')),
    Cart: partial(require('./Cart')),
    CartItem: partial(require('./CartItem')),
    Certification: partial(require('./Certification')),
    FreeShipping: partial(require('./FreeShipping')),
    ItemsInCart: partial(require('./ItemsInCart')),
    Message: partial(require('./Message')),
    Product: partial(require('./Product')),
    Products: partial(require('./Products')),
    Product: partial(require('./Product')),
    ProductsNavigation: partial(require('./ProductsNavigation'))
    
};