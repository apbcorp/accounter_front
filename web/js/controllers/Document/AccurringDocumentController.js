function AccurringDocumentController() {
    AbstractDocumentController.call(this);
    this.model = new AccurringDocumentModel(this);
    this.viewName = 'view.accurringDocument';
    this.backUrl = '/document/accurring.html';

    this.AccurringDocumentController = function () {
        this.onAutoFillEvent = this.onAutoFill.bind(this);
        this.events.push({'selector': '.autoset_button', 'action': 'click', 'event': this.onAutoFillEvent});
        
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

    this.afterOnBlur = function (event) {
        if (event.target.childNodes[0].dataset.type == 'kontragent') {
            return;
        }

        var serviceId = event.target.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0].dataset.id;
        var period = event.target.parentNode.parentNode.childNodes[2].childNodes[0].value;
        var kontragentId = $('[data-type=kontragent]')[0].dataset.id;
        var base = event.target.parentNode.parentNode.childNodes[3].childNodes[0].value;
        var price = event.target.parentNode.parentNode.childNodes[3].childNodes[0].value;

        if (serviceId && kontragentId && !base) {
            return;
        }

        if (serviceId && period && kontragentId && !price) {
            return;
        }
    };

    this.onAutoFill = function () {
        var kontragent = $('[data-type=kontragent]')[0];

        if (!kontragent.dataset.id) {
            alert('ФИО потребителя не указано');

            return;
        }

        var container = kernel.getServiceContainer().get('container.collection');
        container.getDataBySupply('serviceAutofill', kontragent.dataset.id, this.onAutoFillComplete.bind(this));
    };

    this.onAutoFillComplete = function () {
        var container = kernel.getServiceContainer().get('container.collection');
        var record = container.getDataById('serviceAutofill', $('[data-type=kontragent]')[0].kontragent.dataset.id);

        
    };

    this.AccurringDocumentController();
}