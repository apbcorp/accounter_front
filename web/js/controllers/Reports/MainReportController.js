function MainReportController() {
    AbstractReportController.call(this);
    this.viewName = 'view.mainReportView';
    this.reportUrl = '/api/v1.0/report/main';

    this.MainReportController = function () {
        this.AbstractReportController();
    };

    this.MainReportController();
}