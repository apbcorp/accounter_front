function MetersDocumentController() {
    AbstractDocumentController.call(this);
    this.model = new MetersDocumentModel(this);
    this.viewName = 'view.meterDocument';
    this.backUrl = '/document/meters.html';

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
            rows: rows
        };

        this.model.appendDataToRequest(data);
    };

    this.afterOnBlur = function (event) {
        var container = kernel.getServiceContainer().get('container.collection');
        var record = container.getDataById(event.target.childNodes[0].dataset.type, event.target.childNodes[0].dataset.id);

        event.target.parentNode.parentNode.childNodes[2].childNodes[0].value = record.value;
    };
}