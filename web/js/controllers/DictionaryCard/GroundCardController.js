function GroundCardController() {
    AbstractCardController.call(this);
    this.viewName = 'view.groundCard';
    this.backUrl = '/dictionary/grounds.html';
    this.model = new GroundCardModel(this);

    this.GroundCardController = function () {
        this.onAreaChangedEvent = this.onAreaChanged.bind(this);

        this.events.push({'selector': '[name="area"]', 'action': 'blur', 'event': this.onAreaChangedEvent});
        this.events.push({'selector': '[name="commonArea"]', 'action': 'blur', 'event': this.onAreaChangedEvent});
        this.events.push({'selector': '[name="freeArea"]', 'action': 'blur', 'event': this.onAreaChangedEvent});

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
            accNumber: $('[name="accNumber"]')[0].value,
            number: $('[name="number"]')[0].value,
            line: $('[name="line"]')[0].value,
            groundNumber: $('[name="groundNumber"]')[0].value,
            area: $('[name="area"]')[0].value,
            freeArea: $('[name="freeArea"]')[0].value,
            commonArea: $('[name="commonArea"]')[0].value,
            allArea: $('[name="allArea"]')[0].value,
            kontragentId: $('[name="owner"]')[0].dataset.id
        };

        if (this.model.isValidData(data)) {
            this.model.appendDataToRequest(data);
            
            return true;
        } else {
            alert(this.model.getErrors())
        }
        
        return false;
    };

    this.onAreaChanged = function () {
        var area = $('[name="area"]')[0].value.replace(',', '.');
        var freeArea = $('[name="freeArea"]')[0].value.replace(',', '.');
        var commonArea = $('[name="commonArea"]')[0].value.replace(',', '.');

        var sum = parseFloat(area) + parseFloat(freeArea) + parseFloat(commonArea);
        $('[name="allArea"]')[0].value = !sum ? 0 : sum;
    };

    this.GroundCardController();
}