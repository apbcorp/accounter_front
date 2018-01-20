function MeterInvoiceReportController() {
    AbstractReportController.call(this);
    this.view = 'view.meterInvoiceReportView';
    this.reportUrl = '/api/v1.0/document/meter_service/';

    this.MeterInvoiceReportController = function () {
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
        var selector = $('[name="id"]');

        if (selector.length) {
            return this.reportUrl + selector[0].value;
        }

        var data = kernel.getServiceContainer().get('helper.url').getUrlParamsObject(document.location.href);

        return data['id'] === undefined ? this.reportUrl + '1' : this.reportUrl + data['id'];
    };

    this.MeterInvoiceReportController();
}