// this will be a contstructor, but in the index it will be a singleton
const CartService = function ctor_CartService() {
    var adjustQuantity, cart, channel, totals, updateTotals;
    channel = postal.channel('cart');
    cart = {
        store: [],
        totals: {
            subTotal: 0,
            get tax() {
                return _.round(cart.totals.subTotal * .05, 2);
            },
            get total() {
                return _.round(cart.totals.subTotal + cart.totals.tax, 2);
            },
            get itemsInCart() {
                var result;

                result = 0;
                _.each(cart.store, (item) => { result +=  item.quantity; });
                return result;
            }
        }
    };
};

module.exports = CartService;