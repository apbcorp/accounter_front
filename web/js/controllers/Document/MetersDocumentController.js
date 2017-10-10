function MetersDocumentController() {
    AbstractDocumentController.call(this);
    this.viewName = 'view.meterDocument';
    this.backUrl = '/document/meters.html';
    this.model = new MetersDocumentModel(this);

    this.MetersDocumentController = function () {
        this.AbstractDocumentController();
    };

    this.fillModel = function () {
        var rows = [];
        var elements = $('.table_row');

        for (var i = 0; i < elements.length; i++) {
            rows.push({
                id: elements[i].dataset.id,
                meterId: elements[i].childNodes[1].childNodes[0].childNodes[0].dataset.id,
                startValue: elements[i].childNodes[2].childNodes[0].value,
                endValue: elements[i].childNodes[3].childNodes[0].value
            })
        }

        var data = {
            date: $('[name="date"]')[0].value,
            rows: rows
        };

        if (this.model.isValidData(data)) {
            this.model.appendDataToRequest(data);

            return true;
        } else {
            alert(this.model.getErrors())
        }

        return false;
    };

    this.afterOnBlur = function (event) {
        var container = kernel.getServiceContainer().get('container.collection');
        var record = container.getDataById(event.target.childNodes[0].dataset.type, event.target.childNodes[0].dataset.id);

        event.target.parentNode.parentNode.childNodes[2].childNodes[0].value = record.params.lastMeterValue;
    };

    this.getRequestData = function () {
        var date = $('[name=date]')[0].value;

        return {search: this.element.value, date: date};
    };
}