function PayDocumentController() {
    AbstractDocumentController.call(this);
    this.viewName = 'view.payDocument';
    this.backUrl = '/document/pays.html';
    this.model = new PayDocumentModel(this);

    this.PayDocumentController = function () {
        this.AbstractDocumentController();
    };

    this.fillModel = function () {
        var rows = [];
        var elements = $('.table_row');

        for (var i = 0; i < elements.length; i++) {
            rows.push({
                id: elements[i].dataset.id,
                groundId: elements[i].childNodes[1].childNodes[0].dataset.id,
                serviceId: elements[i].childNodes[2].childNodes[0].dataset.id,
                sum: elements[i].childNodes[4].childNodes[0].value ? elements[i].childNodes[4].childNodes[0].value : 0
            })
        }

        var data = {
            date: $('[name="date"]')[0].value,
            kontragentId: $('[name="kontragent"]')[0].dataset.id,
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
        if (event.target.firstElementChild.name == 'kontragent') {
            this.model.fillDocument(event.target.firstElementChild.dataset.id, $('[name=date]')[0].value);
        }
    };

    this.fillDocument = function (data) {
        var elements = $('[name=checker]');

        if (elements.length) {
            for (var i = 0; i < elements.length; i++) {
                elements[i].checked = true;
            }

            this.onDeleteRow();
        }

        var row = undefined;

        for (var i = 0; i < data.length; i++) {
            this.onAddRow();

            elements = $('.table_row');
            row = elements[elements.length - 1];

            row.childNodes[1].childNodes[0].value = data[i].ground;
            row.childNodes[1].childNodes[0].dataset.id = data[i].groundId;
            row.childNodes[2].childNodes[0].dataset.id = data[i].serviceId;
            row.childNodes[2].childNodes[0].value = data[i].service;
            row.childNodes[3].childNodes[0].value = data[i].dolg;
        }
    };

    this.PayDocumentController();
}