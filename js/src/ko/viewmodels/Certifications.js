const
    ko = require('ko'),
    _ = require('lodash');

module.exports = function CertificationsModel(attributes) {
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