const
    ko = require('ko'),
    _ = require('lodash');

module.exports = function ProductsNavigationModel() {
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