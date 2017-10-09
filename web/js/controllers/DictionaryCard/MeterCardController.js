function MeterCardController() {
    AbstractCardController.call(this);
    this.viewName = 'view.meterCard';
    this.backUrl = '/dictionary/meters.html';
    this.model = new MeterCardModel(this);

    this.MeterCardController = function () {
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
            number: $('[name="number"]')[0].value,
            type: $('[name="type"]')[0].value,
            groundId: $('[name="ground"]')[0].dataset.id
        };

        if (this.model.isValidData(data)) {
            this.model.appendDataToRequest(data);

            return true;
        } else {
            alert(this.model.getErrors())
        }

        return false;
    };

    this.MeterCardController();
}