function MetersReportController() {
    AbstractReportController.call(this);
    this.view = 'view.metersReport';
    this.reportUrl = '/api/v1.0/document/report/meters';

    this.MetersReportController = function () {
        this.events.push({'selector': '.submit', 'action': 'click', 'event': this.refreshReport.bind(this)});
        this.AbstractReportController();
    };

    this.refreshReport = function () {
        this.getData();
    };

    this.MetersReportController();
}