function MainReportController() {
    AbstractReportController.call(this);
    this.view = 'view.mainReport';
    this.reportUrl = '/api/v1.0/document/report/main';

    this.MainReportController = function () {
        this.events.push({'selector': '.submit', 'action': 'click', 'event': this.refreshReport.bind(this)});
        this.AbstractReportController();
    };

    this.refreshReport = function () {
        this.getData();
    };

    this.MainReportController();
}