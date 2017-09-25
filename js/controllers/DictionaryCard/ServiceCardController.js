function ServiceCardController() {
    AbstractCardController.call(this);
    this.model = new ServiceCardModel(this);
    this.viewName = 'view.serviceCard';
    this.backUrl = '/dictionary/services.html';

    this.ServiceCardController = function () {
        this.AbstractCardController();
    };

    this.init = function (params) {
        if (params === undefined || params[0] === undefined || params[0] == 'new') {
            this.onRefreshComplete({});

            return;
        }

        this.model.setId(params[0]);

        this.model.refresh();
    };

    this.fillModel = function () {
        var data = {
            name: $('[name="name"]')[0].value,
            type: $('[name="type"]')[0].value,
            subtype: $('[name="subtype"]')[0].value
        };

        this.model.appendDataToRequest(data);
    };

    this.ServiceCardController();
}