function ServiceDocumentController() {
    AbstractDocumentController.call(this);
    this.viewName = 'view.serviceDocument';
    this.backUrl = '/document/service.html';
    this.model = new ServiceDocumentModel(this);
    this.indexData = [];

    this.ServiceDocumentController = function () {
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
                serviceId: elements[i].childNodes[1].childNodes[0].childNodes[0].dataset.id,
                groundId: elements[i].childNodes[2].childNodes[0].value,
                date: elements[i].childNodes[3].childNodes[0].value,
                count: elements[i].childNodes[4].childNodes[0].value,
                price: elements[i].childNodes[5].childNodes[0].value,
                sum: elements[i].childNodes[6].childNodes[0].value
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
            this.model.fillGroundList(event.target.firstElementChild.dataset.id);
        }
    };

    this.onIndexDataChanged = function (event) {
        var serviceId = event.target.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0].dataset.id;
        var date = event.target.parentNode.parentNode.childNodes[3].childNodes[0].value;
        var kontragentId = $('[name=kontragent]')[0].dataset.id;
        var groundId = event.target.parentNode.parentNode.childNodes[2].childNodes[0].value;

        if (!serviceId || !date || !kontragentId || !groundId) {
            return;
        }

        this.model.fillRow(date, kontragentId, groundId, serviceId);
    };

    this.onRefreshComplete = function (data) {
        if (data.kontragentId) {
            this.model.kontragentId = 0;
            this.model.fillGroundList(data.kontragentId);
        }
        var view = kernel.getServiceContainer().get(this.viewName);
        view.render(data);

        var eventContainer = kernel.getServiceContainer().get('container.event');
        eventContainer.setEvents(this.events);
    };

    this.onAddRow = function () {
        var fio = $('[name=kontragent]')[0];

        if (!fio.dataset.id || !this.model.groundList) {
            alert('Сначала необходимо указать ФИО собственника');

            return;
        }

        var groundList = '';

        var view = kernel.getServiceContainer().get(this.viewName);
        var html = $(view.addData(view.rowTemplate, {groundList: this.model.generateGroundList(0)}))[0];

        $('.subtable')[0].append(html);

        var eventContainer = kernel.getServiceContainer().get('container.event');
        eventContainer.setEvents(this.events);
    };

    this.onAutoFill = function () {
        var date = $('[name=date]')[0].value;
        var kontragentId = $('[name=kontragent]')[0].dataset.id;

        this.model.fillAllRows(date, kontragentId);
    };

    this.onAutoFillComplete = function (data) {
        data = data.result;

        var rows = $('.table_row');
        var rowService = '';
        var date = '';
        var groundId = '';
        var dateHelper = kernel.getServiceContainer().get('helper.date');

        for (var i = 0; i < data.length; i++) {
            var isRowInTable = false;

            for (var j = 0; j < rows.length; j++) {
                rowService = parseInt(rows[j].childNodes[1].childNodes[0].childNodes[0].dataset.id);
                date = rows[j].childNodes[3].childNodes[0].value;
                groundId = parseInt(rows[j].childNodes[2].childNodes[0].value);
                groundId = !groundId ? null : groundId;

                if (rowService == data[i].serviceId && dateHelper.isEqualPeriodMonth(date, data[i].date.date) && groundId == data[i].groundId) {
                    isRowInTable = true;

                    break;
                }
            }

            if (!isRowInTable) {
                this.onAddRow();

                rows = $('.table_row');
                var row = rows[rows.length - 1];
                row.childNodes[1].childNodes[0].childNodes[0].dataset.id = data[i].serviceId;
                row.childNodes[1].childNodes[0].childNodes[0].value = data[i].service;
                row.childNodes[2].childNodes[0].value = data[i].groundId;
                row.childNodes[3].childNodes[0].value = dateHelper.getDateFormatInput(data[i].date.date);
                row.childNodes[4].childNodes[0].value = data[i].count;
                row.childNodes[5].childNodes[0].value = data[i].price;
                row.childNodes[6].childNodes[0].value = data[i].sum;
            }
        }
    };

    this.ServiceDocumentController();
}