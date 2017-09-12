function AbstractCardController() {
    MainControllerAbstract.call(this);
    this.viewName = undefined;

    this.AbstractCardController = function () {
        this.MainControllerAbstract();
    };

    this.init = function (params) {
        this.model.setId(params[0]);

        this.model.refresh();
    };

    this.onRefreshComplete = function (data) {
        var view = kernel.getServiceContainer().get(this.viewName);
        view.render(data);

        var eventContainer = kernel.getServiceContainer().get('container.event');
        eventContainer.setEvents(this.events);
    };
}