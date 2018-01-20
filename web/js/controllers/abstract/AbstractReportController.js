function AbstractReportController() {
    MainControllerAbstract.call(this);
    this.viewName = '';
    this.reportUrl = '';
    this.currentId = 1;

    this.AbstractReportController = function () {
        this.MainControllerAbstract();
    };

    this.init = function () {
        this.getData();
    };

    this.getRequestData = function () {
        var dataHelper = kernel.getServiceContainer().get('helper.date');
        var selector = $('[name="dateStart"]');
        var startDate = selector.length ? selector[0].value : dataHelper.getFirstDayOfMonth(new Date());
        selector = $('[name="dateEnd"]');
        var endDate = selector.length ? selector[0].value : dataHelper.getLastDayOfMonth(new Date());

        return {dateStart: startDate, dateEnd: endDate};
    };

    this.getRequestUrl = function () {
        return this.reportUrl;
    };

    this.getData = function () {
        var requester = kernel.getServiceContainer().get('requester.ajax');
        requester.setUrl(this.getRequestUrl());
        requester.setData(this.getRequestData());
        requester.setMethod(HTTP_METHOD_GET);
        requester.setSuccess(this.onRender.bind(this));
        requester.request();
    };

    this.onRender = function (data) {
        var view = kernel.getServiceContainer().get(this.view);
        data.currentId = this.currentId;
        view.render(data);

        var eventContainer = kernel.getServiceContainer().get('container.event');
        eventContainer.setEvents(this.events);
    };
}