function AccurringDocumentController() {
    AbstractDocumentController.call(this);
    this.viewName = 'view.accurringDocument';
    this.backUrl = '/document/accurring.html';
    this.model = new AccurringDocumentModel(this);
    this.indexData = [];

    this.AccurringDocumentController = function () {
        this.onIndexDataChangedEvent = this.onIndexDataChanged.bind(this);
        this.onAutoFillEvent = this.onAutoFill.bind(this);

        this.events.push({'selector': '.indexData', 'action': 'blur', 'event': this.onIndexDataChangedEvent});
        this.events.push({'selector': '.autoset_button', 'action': 'click', 'event': this.onAutoFillEvent});

        this.AbstractDocumentController();
    };

    this.fillModel = function () {
        var rows = [];
        var elements = $('.table_row');

        for (var i = 0; i < elements.length; i++) {
            rows.push({
                id: elements[i].dataset.id,
                serviceId: elements[0].childNodes[1].childNodes[0].childNodes[0].dataset.id,
                period: elements[i].childNodes[2].childNodes[0].value,
                base: elements[i].childNodes[3].childNodes[0].value,
                price: elements[i].childNodes[4].childNodes[0].value,
                sum: elements[i].childNodes[5].childNodes[0].value,
                komment: elements[i].childNodes[6].childNodes[0].value
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

    };

    this.onIndexDataChanged = function (event) {
        var serviceId = event.target.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0].dataset.id;
        var date = event.target.parentNode.parentNode.childNodes[2].childNodes[0].value;
        var kontragentId = $('[name=kontragent]')[0].dataset.id;

        if (!serviceId || !date || !kontragentId) {
            return;
        }

        dateObject = new Date(date);

        var recordId = this.getIndexDataId(kontragentId, serviceId, date);

        if (recordId == null) {
            this.indexData.push({kontragentId: kontragentId, serviceId: serviceId, date: date, event: event});

            var requester = kernel.getServiceContainer().get('requester.ajax');
            requester.setUrl('/api/v1.0/document/get_service/accurring');
            requester.setData({serviceId: serviceId, date: date, kontragentId: kontragentId});
            requester.setMethod(HTTP_METHOD_GET);
            requester.setSuccess(this.setBaseAndTarif.bind(this));
            requester.request();
        } else {
            event.target.parentNode.parentNode.childNodes[3].childNodes[0].value = this.indexData[recordId].base;
            event.target.parentNode.parentNode.childNodes[4].childNodes[0].value = this.indexData[recordId].price;
            event.target.parentNode.parentNode.childNodes[5].childNodes[0].value = this.indexData[recordId].price * this.indexData[recordId].base;
        }
    };

    this.getIndexDataId = function (kontragentId, serviceId, date) {
        for (var i = 0; i < this.indexData.length; i++) {
            if (this.indexData[i].serviceId == serviceId && this.indexData[i].date == date && this.indexData[i].kontragentId == kontragentId) {
                return i;
            }
        }

        return null;
    };

    this.setBaseAndTarif = function (data) {
        if (!data) {
            return;
        }
        var result = data.result;

        var recordId = this.getIndexDataId(result.kontragentId, result.serviceId, result.date);
        this.indexData[recordId].base = result.base;
        this.indexData[recordId].price = result.price;

        this.indexData[recordId].event.target.parentNode.parentNode.childNodes[3].childNodes[0].value = this.indexData[recordId].base;
        this.indexData[recordId].event.target.parentNode.parentNode.childNodes[4].childNodes[0].value = this.indexData[recordId].price;
        this.indexData[recordId].event.target.parentNode.parentNode.childNodes[5].childNodes[0].value = this.indexData[recordId].price * this.indexData[recordId].base;
    };

    this.onAutoFill = function () {
        var date = $('[name=date]')[0].value;
        var kontragentId = $('[name=kontragent]')[0].dataset.id;

        var requester = kernel.getServiceContainer().get('requester.ajax');
        requester.setUrl('api/v1.0/document/list/accurring/getAllServices');
        requester.setData({date: date, kontragentId: kontragentId});
        requester.setMethod(HTTP_METHOD_GET);
        requester.setSuccess(this.onAutoFillComplete.bind(this));
        requester.request();
    };

    this.onAutoFillComplete = function () {
        if (!data) {
            return;
        }

        for (var i = 0; i < data.length; i++) {
            this.indexData.push({kontragentId: data[i].kontragentId, serviceId: data[i].serviceId, date: data[i].date, base: data[i].base, price: data[i].price});
        }
    };

    this.getRequestData = function () {
        if (this.element.name == 'kontragent') {
            return this.element.value;
        } else if (this.element.name == 'service') {
            return this.element.value;
        }
    };
    
    this.AccurringDocumentController();
}