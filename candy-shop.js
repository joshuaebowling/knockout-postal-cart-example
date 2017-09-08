var 
// services
cartService, productService,
//view models
BagItemModel, BagModel, CartModel, FreeShippingModel, ItemsInCartModel, ProductModel, ProductsModel;

cartService = (() => {
    var cartChannel, cart, totals, updateTotals;
    cart = {
        store: [],
        totals: {
            subTotal: 0,
            get tax() {
                return cart.totals.subTotal * .05;
            },
            get total() {
                return cart.totals.subTotal + cart.totals.tax;
            },
            get itemsInCart() {
                var result;

                result = 0;
                _.each(cart.store, (item) => { result +=  item.quantity; });
                return result;
            }
        }
    };
    cartChannel = postal.channel('cart');
    // pickup any request for cart items
    cartChannel.subscribe('get.request', (crit, env) => {
        cartChannel.publish('get.response', store);
    });
    cartChannel.subscribe('add.request', (item, env) => {
        var existentItem = _.find(cart.store, (cartitem) => { return item.id === cartitem.id });
        if(existentItem) {
            existentItem.quantity++;
        } else {
            item.quantity = 1;
            cart.store.push(item);
        }
        updateTotals();
        cartChannel.publish('add.response', cart);
    });
    cartChannel.subscribe('remove.request', (item, env) => {
        var existentItem = _.find(cart.store, item);
        if(existentItem && existentItem.quantity > 1) {
            existentItem.quantity--;
        } else {
            _.remove(cart.store, item);
        }
        updateTotals();
        cartChannel.publish('remove.response', cart);
    });

    updateTotals = function() {
        var result = 0;
        _.each(cart.store, (item) => result += (item.price * item.quantity));
        cart.totals.subTotal = result;
    };
    return {
        get: function(crit = {}) {
            postal.channel('cart').publish('get.request', crit);
        },
        add: function(item) {
            postal.channel('cart').publish('add.request', item);
        },
        remove: function(item) {
            postal.channel('cart').publish('remove.request', item);
        }
    };
})();

productService = (() => {
    var store =  _.map([
            {
                title: 'Coffee',
                price: 14.95,
                available: 27,
                discountAfter: 6,
                certifications: ['USDA Organic', 'GMO Free', 'Fair Trade'],
                tags: ['Origin:Costa Rica', 'Descriptor:Light Roast', 'Flavor: Mild & Nutty'],
                rating: 10
            },
            {
                title: 'fruit leather',
                price: 0.5,
                available: 50,
                discountAfter: 6,
                certifications: ['USDA Organic', 'GMO Free'],
                tags: ['Origin:Costa Rica', 'Descriptor:Light Roast', 'Flavor: Mild & Nutty'],
                rating: 9
            },
            {
                title: 'mid-level fancy wine',
                price: 89.12546,
                available: 13,
                discountAfter: 6,
                certifications: ['GMO Free'],
                tags: ['Origin:Italy', 'Grape:Chianti', 'Flavor: Floral + Smooth Finish'],
                rating: 6
            },
            {
                title: 'moon round trip ticket',
                price: 22450,
                available: 4,
                discountAfter: 6,
                certifications: ['GMO Free'],
                tags: ['Departs:Tomorrow', 'Returns:LOL, BC', 'Seating:Business Class'],
                rating: null
            },
            {
                title: 'champagne',
                price: 45,
                available: 7,
                discountAfter: 6,
                certifications: ['GMO Free'],
                tags: ['Origin:France', 'Grape:Buena Pregunta', 'Flavor: Bubbly'],
                rating: 6
                
            },
            {
                title: 'Pea Protein Powder',
                price: 14.95,
                available: 23,
                discountAfter: 6,
                certifications: ['USDA Organic', 'GMO Free'],
                tags: ['Buzz: Branched-Chain Amino Acids', 'Flavor:Meh', 'Recommender: Dr Feelgo Ood'],
                rating: 8
            },
            {
                title: 'Egg',
                price: 0.5,
                available: 500,
                discountAfter: 12,
                certifications: ['USDA Organic', 'GMO Free', 'Free Range'],
                tags: ['Origin:Local', 'Flavor: Chickeny'],
                rating: 9
            },
            {
                title: 'Ribeye',
                price: 50.12546,
                available: 13,
                discountAfter: null,
                certifications: ['UDSA Organic', 'USDA Prime'],
                tags: ['Origin:Texas', 'Average Weight: 1 lb', 'Feed:Grass'],
                rating: 9
            },
            {
                title: 'Total Recall',
                price: 27450,
                available: NaN,
                discountAfter: null,
                certifications: ['APA'],
                tags: ['Name:Quaid', 'Muscles:Big', 'Seating:Mostly Running'],
                rating: 4
            },
            {
                title: 'Men\'s Multivitamin',
                price: 45,
                available: 18,
                discountAfter: 6,
                certifications: ['GMO Free', 'USDA Organic', 'Whole Food'],
                tags: ['Raw', 'Vegan', '44 Superfoods'],
                rating: 6
                
            },
            {
                title: 'Rye Berries',
                price: 14.95,
                available: 27,
                discountAfter: 6,
                certifications: ['USDA Organic', 'GMO Free', 'Fair Trade'],
                tags: ['Amount:1lb', 'Awesome Use:Mycology'],
                rating: 10
            },
            {
                title: 'Ketchup',
                price: 5,
                available: 24,
                discountAfter: 6,
                certifications: ['USDA Organic', 'GMO Free'],
                tags: ['Roma Tomatoes', 'Amount:8 oz', 'Color:Green'],
                rating: 9
            },
            {
                title: 'Cheddar Hoop',
                price: 87.12546,
                available: 13,
                discountAfter: null,
                certifications: ['GMO Free', 'USDA Organic'],
                tags: ['Color:White', 'Origin:Wisconsin', 'Flavor:Sharp'],
                rating: 3
            },
            {
                title: 'Journey to Center of Earth in Time Machine',
                price: 22450,
                available: 3,
                discountAfter: 6,
                certifications: null,
                tags: ['Departs:Yesterday', 'Returns:Do you have to ask?', 'NO AC'],
                rating: null
            },
            {
                title: 'Pine Nuts',
                price: 17,
                available: 14,
                discountAfter: 6,
                certifications: ['GMO Free', 'USDA Organic'],
                tags: ['Origin:Washington State', 'Awesome Use: Hummus'],
                rating: 7
                
            }
            
        ].slice(0, 5), // keep it at 5 until paging is complete
    (item, i) => { 
        item.id = i; 
        return item;
    });
    // pickup any request for cart items
    postal.channel('product').subscribe('get.request', (crit, env) => {
        postal.channel('product').publish('get.response', store);
    });

    return {
        get: function(crit = {}) {
            postal.channel('product').publish('get.request', crit);
        }
    };
})();

CartModel = function(attributes) {
    var vm;

    vm = {
        attributes: attributes,
        title: 'Welcome to the Postal Smart Cart',
        subtotal: ko.observable(0),
        tax: ko.observable(0),
        total: ko.observable(0),
    };
    vm.show = ko.computed(() => { 
        return vm.subtotal() > 0; 
    });
    
    // subscriptions for controller
    postal.channel('cart').subscribe('*.response', (cart, env) => {
        // same thing here, replace each value
        vm.subtotal(cart.totals.subTotal);
        vm.tax(cart.totals.tax);
        vm.total(cart.totals.total);
    });

    return vm;
        
};

BagModel = function(attributes) {
    var vm;

    vm = {
        attributes: attributes,
        bag: ko.observableArray([])
    };


    // subscriptions for controller
    postal.channel('cart').subscribe('*.response', (cart, env) => {
        // clear it
        vm.bag.removeAll();
        // repopulate without changing the reference -- rivets won't pickup on it changes like vm.bag = x, you have to repopulate the original array
        _.each(cart.store, (item) => vm.bag.push(item));
    });

    return vm;      
};

BagItemModel = function(context) {
    var vm;

    vm = {
        model: context.model,
        addItem: function() {
          cartService.add(vm.model);
        },
        removeItem: function() {
            cartService.remove(vm.model);
        } 
    };

    return vm;      
};

FreeShippingModel = function() {
    var vm;

    vm = {
        subTotal: ko.observable(0),
        threshold: 400
    };
    
    vm.qualified = ko.computed(() => {
        return vm.threshold <= vm.subTotal();
    });

    postal.channel('cart').subscribe('*.response', (cart, env) => {
        vm.subTotal(cart.totals.subTotal);
    });

    return vm;      
};

ItemsInCartModel = function() {
    var vm;

    vm = {
        itemsInCart: ko.observable(0)
    };

    postal.channel('cart').subscribe('*.response', (cart, env) => {
        vm.itemsInCart(cart.totals.itemsInCart);
    });

    return vm;        
};

ProductsModel = function(attributes) {
    var vm;

    vm = {
        attributes: attributes,
        products: ko.observableArray([]),
    };
    // listen for when the product service returns a list of products, will also work for paging 
    postal.channel('product').subscribe('get.response', (d, env) => {
        _.each(_.uniq(d, vm.products()), (p, pi) => {
            vm.products.push(p);
        });
    });

    productService.get({});        
    return vm;
        
};

ProductModel = function(context) {
    var vm;

    vm = {
        model: context.model,        
        addToBag: function() {
            cartService.add(context.model);
        }
    };
    return vm;        
};






// rivets.formatters.price = function(val) {
  
//   var spl = String(val).split('.'),
//     dollarsArray = spl[0].split(''),
//     lastDollar = dollarsArray.length - 1,
//     pow,
//     i;
  
//   if(dollarsArray.length > 3) {
    
//     dollarsArray.reverse();
    
//     for(i = lastDollar; i > -1; i--) {
      
//       if(i % 3 === 0 && i !== 0) {
        
//         dollarsArray.splice(i, 0, ',');
//       }
//     }
    
//     spl[0] = dollarsArray.reverse().join('');
//   }
  
//   if(spl.length > 1) {
    
//     spl[1] = spl[1].substr(0, 2);
    
//     if(spl[1].length < 2) {
      
//       spl[1] += '0';
//     }
//   }else {
    
//     spl[1] = '00';
//   }
  
//   return '<abbr title="USD">$</abbr>' + spl.join('.');
// };

// rivets.formatters.length = function(val) {
  
//   return val.length;
// }


// register components
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



ko.applyBindings({}, $('#app')[0]);

