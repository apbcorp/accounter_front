function BalanceReportController() {
    AbstractReportController.call(this);
    this.view = 'view.balanceReports';
    this.reportUrl = '/api/v1.0/document/report/balance';

    this.BalanceReportController = function () {
        this.events.push({'selector': '.submit', 'action': 'click', 'event': this.refreshReport.bind(this)});
        this.AbstractReportController();
    };

    this.refreshReport = function () {
        this.getData();
    };

    this.BalanceReportController();
}