const services = require('../../services'),
partial = require('lodash').partial;

module.exports = {
    App: partial(require('./App'), services),
    Cart: partial(require('./Cart'), services),
    CartItem: partial(require('./CartItem'), services),
    CertificationFilter: partial(require('./Certifications'), services),
    FreeShipping: partial(require('./FreeShipping'), services),
    ItemsInCart: partial(require('./ItemsInCart'), services),
    Message: partial(require('./Message'), services),
    Product: partial(require('./Product'), services),
    Products: partial(require('./Products'), services),
    Product: partial(require('./Product'), services),
    ProductsNavigation: partial(require('./ProductsNavigation'), services)
};