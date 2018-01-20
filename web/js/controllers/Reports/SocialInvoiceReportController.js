function SocialInvoiceReportController() {
    AbstractReportController.call(this);
    this.view = 'view.socialInvoiceReportView';
    this.reportUrl = '/api/v1.0/document/service_document/';

    this.SocialInvoiceReportController = function () {
        this.events.push({'selector': '.submit', 'action': 'click', 'event': this.refreshReport.bind(this)});
        this.AbstractReportController();
    };

    this.refreshReport = function () {
        this.getData();
    };

    this.getRequestData = function () {
        return {};
    };

    this.getRequestUrl = function () {
        var selector = $('.social-invoice[name="id"]');

        if (selector.length) {
            this.currentId = selector[0].value;
            
            return this.reportUrl + selector[0].value;
        }

        var data = kernel.getServiceContainer().get('helper.url').getUrlParamsObject(document.location.href);

        if (!data['id'] !== undefined) {
            this.currentId = data['id'];
        }
        
        return this.reportUrl + this.currentId;
    };

    this.SocialInvoiceReportController();
}