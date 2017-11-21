function ServiceCardController() {
    AbstractCardController.call(this);
    this.viewName = 'view.serviceCard';
    this.backUrl = '/dictionary/services.html';
    this.model = new ServiceCardModel(this);

    this.ServiceCardController = function () {
        this.AbstractCardController();
    };

    this.init = function (params) {
        this.model.requestData = {};
        if (params === undefined || params[0] === undefined || params[0] == 'new') {
            this.onRefreshComplete({});
            this.model.setId(0);

            return;
        }

        this.model.setId(params[0]);

        this.model.refresh();
    };

    this.fillModel = function () {
        var data = {
            name: $('[name="name"]')[0].value,
            type: $('[name="type"]')[0].value,
            subtype: $('[name="subtype"]')[0].value,
            periodType: $('[name="periodType"]')[0].value
        };

        if (this.model.isValidData(data)) {
            this.model.appendDataToRequest(data);

            return true;
        } else {
            alert(this.model.getErrors())
        }

        return false;
    };

    this.ServiceCardController();
}