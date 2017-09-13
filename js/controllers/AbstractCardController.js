function AbstractCardController() {
    MainControllerAbstract.call(this);
    this.viewName = undefined;
    this.submodels = {};
    this.backUrl = '/index.html';

    this.AbstractCardController = function () {
        this.onSaveEvent = this.onSave.bind(this);
        this.onCancelEvent = this.onCancel.bind(this);

        this.events.push({'selector': '.save_button', 'action': 'click', 'event': this.onSaveEvent});
        this.events.push({'selector': '.cancel_button', 'action': 'click', 'event': this.onCancelEvent});

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

        if (this.model.recordId != 0) {
            for (var key in this.submodels) {
                this.submodels[key].refresh();
            }
        }
    };

    this.onSave = function () {
        this.fillModel();
        this.model.save();
    };

    this.onCancel = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo(this.backUrl);
    };

    this.fillModel = function () {

    };

}