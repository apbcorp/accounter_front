function MetersReportController() {
    AbstractReportController.call(this);
    this.viewName = 'view.metersReportView';
    this.reportUrl = '/api/v1.0/document/report/meters';

    this.MetersReportController = function () {
        this.AbstractReportController();
    };

    this.MetersReportController();
}