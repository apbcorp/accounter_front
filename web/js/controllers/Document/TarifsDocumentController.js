function TarifsDocumentController() {
    AbstractDocumentController.call(this);
    this.model = new TarifsDocumentModel(this);
    this.viewName = 'view.tarifDocument';
    this.backUrl = '/document/tarifs.html';

    this.TarifsDocumentController = function () {
        this.AbstractDocumentController();
    };

    this.fillModel = function () {
        var rows = [];
        var elements = $('.table_row');

        for (var i = 0; i < elements.length; i++) {
            rows.push({
                id: elements[i].dataset.id,
                serviceId: elements[i].childNodes[1].childNodes[0].childNodes[0].dataset.id,
                price: elements[i].childNodes[2].childNodes[0].value
            })
        }

        var data = {
            dateStart: $('[name="dateStart"]')[0].value,
            rows: rows
        };

        this.model.appendDataToRequest(data);
    };
}