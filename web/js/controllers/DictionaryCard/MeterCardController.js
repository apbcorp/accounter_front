function MeterCardController() {
    AbstractCardController.call(this);
    this.model = new MeterCardModel(this);
    this.viewName = 'view.meterCard';
    this.backUrl = '/dictionary/meters.html';

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
            ground: $('[name="ground"]')[0].attribute('id')
        };

        this.model.appendDataToRequest(data);
    };

    this.MeterCardController();
}