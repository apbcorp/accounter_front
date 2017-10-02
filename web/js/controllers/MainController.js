function MainController() {
    this.init = function () {
        var view = kernel.getServiceContainer().get('view.main');
        view.render();
        var eventContainer = kernel.getServiceContainer().get('container.event');
        eventContainer.setEvents(this.events);
    };

    MainControllerAbstract.call(this);

    this.MainControllerAbstract();
}