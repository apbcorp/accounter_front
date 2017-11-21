function AbstractReportController() {
    MainControllerAbstract.call(this);
    this.viewName = '';
    this.reportUrl = '';

    this.AbstractReportController = function () {
        this.MainControllerAbstract();
    };

    this.init = function () {
        this.getData();
    };

    this.getData = function () {
        var requester = kernel.getServiceContainer().get('requester.ajax');
        var dataHelper = kernel.getServiceContainer().get('helper.date');
        var selector = $('[name="dateStart"]');
        var startDate = selector.length ? selector[0].value : dataHelper.getFirstDayOfMonth(new Date());
        selector = $('[name="dateEnd"]');
        var endDate = selector.length ? selector[0].value : dataHelper.getLastDayOfMonth(new Date());
        requester.setUrl(this.reportUrl);
        requester.setData({dateStart: startDate, dateEnd: endDate});
        requester.setMethod(HTTP_METHOD_GET);
        requester.setSuccess(this.onRender.bind(this));
        requester.request();
    };

    this.onRender = function (data) {
        var view = kernel.getServiceContainer().get(this.view);
        view.render(data);
    };
}