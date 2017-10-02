function ConsumerCardController() {
    AbstractCardController.call(this);
    this.model = new ConsumerCardModel(this);
    this.viewName = 'view.consumerCard';
    this.backUrl = '/dictionary/consumers.html';

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

        this.showGroundTableEvent = this.showGroundTable.bind(this);

        this.model.setId(params[0]);

        this.model.refresh();
    };

    this.showGroundTable = function (data) {
        delete data.columns.owner;

        for (var key in data.data) {
            delete data.data[key].owner;
        }
        data.hideButtons = true;
        data.isSubview = true;

        var view = kernel.getServiceContainer().get('view.table');
        var html = view.buildTemplate(data);
        $('.table_ground')[0].innerHTML = html;
    };

    this.fillModel = function () {
        var data = {
            name: $('[name="name"]')[0].value,
            surname: $('[name="surname"]')[0].value,
            name2: $('[name="name2"]')[0].value,
            phone: $('[name="phone"]')[0].value,
            adress: $('[name="adress"]')[0].value
        };

        this.model.appendDataToRequest(data);
    };

    this.ConsumerCardController();
}