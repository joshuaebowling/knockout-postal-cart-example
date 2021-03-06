var 
productData, 
// services
cartService, certificationService, productService, messageService,
//view models
BagItemModel, BagModel, CartModel, CertificationFilterModel, FreeShippingModel, ItemsInCartModel, MessageModel,
    ProductModel, ProductsModel, ProductsModelNavigation;

productData =[{title:'Coffee',price:14.95,available:27,discountAfter:6,certifications:['USDA Organic','GMO Free','Fair Trade'],tags:['Origin:Costa Rica','Descriptor:Light Roast','Flavor: Mild & Nutty'],rating:10},{title:'fruit leather',price:0.5,available:50,discountAfter:6,certifications:['USDA Organic','GMO Free'],tags:['Origin:Costa Rica','Descriptor:Light Roast','Flavor: Mild & Nutty'],rating:9},{title:'mid-level fancy wine',price:89.12,available:13,discountAfter:6,certifications:['GMO Free'],tags:['Origin:Italy','Grape:Chianti','Flavor: Floral + Smooth Finish'],rating:6},{title:'moon round trip ticket',price:22450,available:4,discountAfter:6,certifications:['GMO Free'],tags:['Departs:Tomorrow','Returns:LOL, BC','Seating:Business Class'],rating:null},{title:'champagne',price:45,available:7,discountAfter:6,certifications:['GMO Free'],tags:['Origin:France','Grape:Buena Pregunta','Flavor: Bubbly'],rating:6},{title:'Pea Protein Powder',price:14.95,available:23,discountAfter:6,certifications:['USDA Organic','GMO Free'],tags:['Buzz: Branched-Chain Amino Acids','Flavor:Meh','Recommender: Dr Feelgo Ood'],rating:8},{title:'Egg',price:0.5,available:500,discountAfter:12,certifications:['USDA Organic','GMO Free','Free Range'],tags:['Origin:Local','Flavor: Chickeny'],rating:9},{title:'Ribeye',price:50.12,available:13,discountAfter:null,certifications:['UDSA Organic','USDA Prime'],tags:['Origin:Texas','Average Weight: 1 lb','Feed:Grass'],rating:9},{title:'Total Recall',price:27450,available:2,discountAfter:null,certifications:['APA'],tags:['Name:Quaid','Muscles:Big','Seating:Mostly Running'],rating:4},{title:'Men\'s Multivitamin',price:45,available:18,discountAfter:6,certifications:['GMO Free','USDA Organic','Whole Food'],tags:['Raw','Vegan','44 Superfoods'],rating:6},{title:'Rye Berries',price:14.95,available:27,discountAfter:6,certifications:['USDA Organic','GMO Free','Fair Trade'],tags:['Amount:1lb','Awesome Use:Mycology'],rating:10},{title:'Ketchup',price:5,available:24,discountAfter:6,certifications:['USDA Organic','GMO Free'],tags:['Roma Tomatoes','Amount:8 oz','Color:Green'],rating:9},{title:'Cheddar Hoop',price:87.12,available:13,discountAfter:null,certifications:['GMO Free','USDA Organic'],tags:['Color:White','Origin:Wisconsin','Flavor:Sharp'],rating:3},{title:'Journey to Center of Earth in Time Machine',price:22450,available:3,discountAfter:6,certifications:null,tags:['Departs:Yesterday','Returns:Do you have to ask?','NO AC'],rating:null},{title:'Pine Nuts',price:17,available:14,discountAfter:6,certifications:['GMO Free','USDA Organic'],tags:['Origin:Washington State','Awesome Use: Hummus'],rating:7}];

cartService = (() => {
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

    adjustQuantity = function CartService_adjustQuantity(item, quantity) {
        var existentItem = _.find(cart.store, (cartitem) => { return item.id === cartitem.id });
        if(existentItem) {
            existentItem.quantity += quantity;
            if(existentItem.quantity === 0) _.remove(cart.store, existentItem);
        } else {
            item.quantity = quantity;
            cart.store.push(item);
            // now the item is existent
            existentItem = item;
        }
        updateTotals();
        return existentItem;
    };

    updateTotals = function() {
        var result = 0;
        _.each(cart.store, (item) => result += (item.price * item.quantity));
        cart.totals.subTotal = result;
    };

    // pickup any request for cart items
    channel.subscribe('get.request', (crit, env) => {
        channel.publish('get.response', { cart });
    });

    channel.subscribe('change.request', (request, env) => {
        var changed;
        
        changed = adjustQuantity(request.item, request.quantity);
        channel.publish('change.response', { cart, changed, quantity: request.quantity });
    });
    
    return {
        get: function(crit = {}) {
            postal.channel('cart').publish('get.request', crit);
        },
        change: function(item, quantity) {
            postal.channel('cart').publish('change.request', { item, quantity });
        },
        // not sure about this pattern
        subscriptions: {
            // lets see about currying this 
            onChange: function(todo) { channel.subscribe('change.response', todo) },
            anyResponse: function(todo) { channel.subscribe('*.response', todo) }
        }
    };
})();

productService = (() => {
    
    const channel = postal.channel('product');
    var adjustAvailable, currentPage, criteria, criteriate, defaultCriteria, page, resetPage, store;

    criteria = {};
    store =  _.map(_.sortBy(productData, p => p.title),
    (item, i) => { 
        item.id = i;    
        return item;
    });

    adjustAvailable = function ProductService_adjustAvailable(product, quantity) {
        var found;
        
         found = _.find(store, (aproduct) => aproduct.id === product.id);
         /// TODO: if the found isnt found then publish to the MessageService
         found.available = found.available + quantity;
         return found; 
    };

    criteriate = function ProductService_criteriate(crit) {
        return (crit.certifications && !_.isEmpty(crit.certifications)) ?
        _.filter(store, (item) => _.intersection(item.certifications, crit.certifications).length > 0)
        : store;
    };

    resetPage = function ProductService_isCriteriaChanged(crit, page) {
        var bothNil, fullyIntersected;
        // compare filter-related properties of new criteria (crit) to saved (criteria)
        bothNil = (_.isNil(crit['certifications']) && _.isNil(criteria['certfications']));
        // if they are both arrays do the have the same members
        fullyIntersected = _.intersection(_.sortBy(crit.certifications, c => c), _.sortBy(criteria.certifications, c => c)).length === _.at(crit, 'certifications.length')[0];
        // they are both not true then there's no reason to resetPage
        return (bothNil || fullyIntersected) ? page : 1;
    };
    // pass in array when implement sorting or filtering
    page = function _page(set, limit, skip = 0) {
        // since the demo will only have item counts that are multiples of 5 & 5 is the page size
        // this naive impl will do fine
        var result;
        result = {
            skip: skip + limit,
            total: set.length
        };
        result.page =  _.slice(set, skip === store.length ? 0 : skip, limit + skip);
        return result;
    };

    // the default values the crit argument passed with get.request
    defaultCriteria = {
        limit: 5,
        skip: 0
    };
    // pickup any request for cart items
    channel.subscribe('get.request', (crit, env) => {
        var data;
        crit = _.defaults(crit, _.defaults(criteria, defaultCriteria));
        crit.skip = resetPage(crit, crit.skip);
        // store the criteria so paging doesn't interfere with filters
        criteria = _.defaults(crit, defaultCriteria); 
        currentPage = page(criteriate(crit), crit.limit, crit.skip);
        channel.publish('get.response', { result: currentPage, criteria });
    });


    // demonstrate custom topic in request.replyTopic
    cartService.subscriptions.onChange((data, env) => {
        var found, quantity;
        // an increase in cart is a decrease in product and vice-versa, so flip the value
        adjustAvailable(data.changed, -(data.quantity));
        if(data.changed.available === 0) messageService.display(messageService.constants.messageTypes.alert, "You bought us out!!!");
        // if the updated item is in the currentPage, publish the change
        if(_.find(currentPage.page, {id: data.changed.id})) { 
            channel.publish('get.response', {result: currentPage, criteria});
        }
    });

    return {
        get: (crit = {}) =>
            // allows all viewmodels processing in current stack to complete
            _.defer( () => channel.publish('get.request', crit)),
        subscriptions: {
            onGet: (todo) =>
                channel.subscribe('get.response', todo)
        }
    };

})();

messageService = (() => {
    var channel;
    const messageTypes = {alert: '!', info: 'i'};
    channel = postal.channel('message');
    channel.subscribe('display.request', (message, env) => {
        // check to see if there's any subscription
        if(postal.getSubscribersFor({channel: 'message', topic:'display.response'}).length === 0) throw new Info("Please Add A Message ViewModel To The App");
        channel.publish('display.response', message);
    });
    return {
        // queue would be be good here
        display: function(type, text) {
            channel.publish('display.request', {type, text});
        },
        subscriptions: {
            displayResponse: function MessageService_displayResponse(todo) {
                channel.subscribe('display.response', todo);
            }
        },
        constants: {messageTypes}

    }
})();

certificationService = (() => {
    var channel;
    channel = postal.channel('certification');
    channel.subscribe('get.request', (message, env) => {
        var result;
        result = _.chain(productData).map(p => p.certifications).flatten().uniq().without(null).value();
        channel.publish('get.response', result);
    });
    return {
        // queue would be be good here
        get: () => 
            channel.publish('get.request'),
        subscriptions: {
            onGet: (todo) =>
                channel.subscribe('get.response', todo)
        }

    }
})();


CartModel = function(attributes) {
    var vm;

    vm = {
        attributes: attributes,
        title: 'Welcome to the Postal Smart Cart',
        subtotal: ko.observable(0),
        tax: ko.observable(0),
        total: ko.observable(0)
    };
    vm.show = ko.computed(() => { 
        return vm.subtotal() > 0; 
    });
    
    // subscriptions for controller
    cartService.subscriptions.anyResponse((data, env) => {
        // same thing here, replace each value
        vm.subtotal(data.cart.totals.subTotal);
        vm.tax(data.cart.totals.tax);
        vm.total(data.cart.totals.total);
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
    cartService.subscriptions.anyResponse((data, env) => {
        // clear it
        vm.bag.removeAll();
        // repopulate without changing the reference -- rivets won't pickup on it changes like vm.bag = x, you have to repopulate the original array
        _.each(data.cart.store, (item) => vm.bag.push(item));
    });

    return vm;      
};

BagItemModel = function(context) {
    var vm;

    vm = {
        model: context.model,
        addItem: () =>
          cartService.change(vm.model, 1),
        removeItem: () =>
          cartService.change(vm.model, -1)
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

    cartService.subscriptions.anyResponse((data, env) => {
        vm.subTotal(data.cart.totals.subTotal);
    });

    return vm;      
};

ItemsInCartModel = function() {
    var vm;

    vm = {
        itemsInCart: ko.observable(0)
    };

    cartService.subscriptions.anyResponse((data, env) => {
        vm.itemsInCart(data.cart.totals.itemsInCart);
    });

    return vm;        
};

MessageModel = function _MessageModel() {
    var vm;
    
        vm = {
            text: ko.observable(null),
            type: ko.observable(null),
            dismiss: function() {
                vm.text(null);
                vm.type(null);
            }
        };
        vm.show = ko.computed(() => {
            return !_.isNull(vm.text());
        });

        messageService.subscriptions.displayResponse((data, env) => {
            vm.text(data.text);
            vm.type(data.type);
        });
    
        return vm; 
};

ProductsModel = function(attributes) {
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

ProductsModelNavigation = function() {
    var vm;
    
    vm = {
        currentPage: ko.observable(1),
        pageSize: 5, // will observe this
        hasMorePages: ko.observable(true),
        hasLessPages: ko.observable(true),
        totalPages: ko.observable(1)
    };

    vm.skip = ko.computed(() => vm.currentPage() * vm.pageSize);
    vm.nextPage = () =>
        productService.get({ limit: vm.pageSize, skip: vm.skip() });
    vm.prevPage = () =>
        productService.get({ limit: vm.pageSize, skip: vm.skip() - ( vm.pageSize * 2 ) });


    productService.subscriptions.onGet((payload, env) => {
        vm.currentPage(_.floor(payload.result.skip / vm.pageSize))  ;
        vm.hasMorePages(_.floor(payload.result.skip < payload.result.total));
        vm.hasLessPages(_.floor(payload.result.skip / vm.pageSize) > 1);
        vm.totalPages(_.floor(payload.result.total / vm.pageSize) + ((payload.result.total % vm.pageSize > 0) ? 1 : 0) );
    });

    return vm;        
};

ProductModel = function(context) {
    var vm;

    vm = {
        model: context.model,        
        addToBag: () =>
            cartService.change(context.model, 1)
    };
    return vm;        
};

CertificationFilterModel = function(attributes) {
    var vm;

    vm = {
        attributes: attributes,
        certifications: ko.observableArray([]),
        selectedCertifications: ko.observableArray([])
    };

    vm.selectedCertifications.subscribe((newVal, oldVal) => {
        productService.get({ certifications: newVal });
    });
    // listen for when the product service returns a list of products, will also work for paging 
    certificationService.subscriptions.onGet((certifications, env) => {
        vm.certifications.removeAll();
        _.each(certifications, (certification) => vm.certifications.push(certification));
    });

    certificationService.get({});
    return vm;
        
};

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

ko.applyBindings({}, $('#app')[0]);

