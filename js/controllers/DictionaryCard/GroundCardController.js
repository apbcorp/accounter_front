function GroundCardController() {
    AbstractCardController.call(this);
    this.model = new GroundCardModel(this);
    this.viewName = 'view.groundCard';
    this.backUrl = '/dictionary/grounds.html';

    this.GroundCardController = function () {
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
            accNumber: $('[name="accNumber"]')[0].value,
            line: $('[name="line"]')[0].value,
            groundNumber: $('[name="groundNumber"]')[0].value,
            area: $('[name="area"]')[0].value,
            freeArea: $('[name="freeArea"]')[0].value,
            commonArea: $('[name="commonArea"]')[0].value,
            allArea: $('[name="allArea"]')[0].value,
            owner: $('[name="owner"]')[0].attribute('id')
        };

        this.model.appendDataToRequest(data);
    };

    this.GroundCardController();
}