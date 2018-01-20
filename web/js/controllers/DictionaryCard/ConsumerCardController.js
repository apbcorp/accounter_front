function ConsumerCardController() {
    AbstractCardController.call(this);
    this.viewName = 'view.consumerCard';
    this.backUrl = '/dictionary/consumers.html';
    this.model = new ConsumerCardModel(this);

    this.ConsumerCardController = function () {
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
            surname: $('[name="surname"]')[0].value,
            name2: $('[name="name2"]')[0].value,
            phone: !$('[name="phone"]')[0].value ? '' : $('[name="phone"]')[0].value,
            adress: !$('[name="adress"]')[0].value ? '' : $('[name="adress"]')[0].value
        };

        if (this.model.isValidData(data)) {
            this.model.appendDataToRequest(data);

            return true;
        } else {
            alert(this.model.getErrors())
        }

        return false;
    };

    this.ConsumerCardController();
}