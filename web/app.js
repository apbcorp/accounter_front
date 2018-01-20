function Kernel() {
    this.services = new ServiceContainer();

    this.start = function () {
        eventContainer = kernel.services.get('container.event');
        this.navigate();
    };

    this.getServiceContainer = function () {
        return this.services;
    };

    this.navigate = function () {
        var url = this.services.get('helper.url').getCurrentUrlWithoutDomain(document.location.href);

        if (!(url === LOGIN_ROUTE)) {
            var userContainer = kernel.getServiceContainer().get('container.user');
            userContainer.isLogin();

            return;
        }

        this.processShow();
    };

    this.processShow = function () {
        var router = this.services.get('service.router');
        var url = this.services.get('helper.url').getCurrentUrlWithoutDomain(document.location.href);

        var controllerInfo = router.getController(url);

        var controller = this.services.get(controllerInfo.name);
        controller.init(controllerInfo.params);
    };

    this.redirectToLogin = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo(LOGIN_ROUTE + '?' + this.services.get('helper.url').getCurrentUrlWithoutDomain(document.location.href));
    }
}
function Router() {
    this.routes = ROUTES;
    this.getController = function (url) {
        var controllerName = '';
        var result = null;
        var params = [];
        for (var routing in this.routes) {
            result = url.match(routing);
            if (result) {
                controllerName = this.routes[routing];

                if (result.length > 1) {
                    for (var i = 1; i < result.length; i++) {
                        params.push(result[i]);
                    }
                }

                break;
            }
        }

        return {
            'name': controllerName,
            'params': params
        };
    };
}
function CollectionContainer() {
    this.data = collections;
    this.event = undefined;
    this.thisCollection = undefined;

    this.getDataById = function (collectionName, id) {
        var name = collectionName + 'Collection';
        var collection = this.data[name];

        return collection.data[id];
    };

    this.getDataForSelect = function (collectionName, id) {
        var name = collectionName + 'Collection';
        var collection = this.data[name];
        var result = '';

        for (var key in collection.data) {
            result += '<option value="' + key + '"' + (key == id ? ' selected' : '') + '>' + collection.data[key].name + '</option>'
        }

        return result;
    };

    this.getDataBySupply = function (collectionName, searchString, event) {
        this.event = event;

        var data = searchString instanceof Object ? searchString : {search: searchString};

        var name = collectionName + 'SupplyCollection';
        this.thisCollection = this.data[name];
        this.thisCollection.data = {};
        var requester = kernel.getServiceContainer().get('requester.ajax');
        requester.setUrl(this.thisCollection.url);
        requester.setData(data);
        requester.setMethod(HTTP_METHOD_GET);
        requester.setSuccess(this.onGetDataSuccess.bind(this));
        requester.request();
    };

    this.onGetDataSuccess = function (data) {
        var staticCollection = this.data[this.thisCollection.staticCollection];
        var params = {};

        for (var i = 0; i < data.result.length; i++) {
            if (!this.thisCollection.data[data.result[i].id]) {
                this.thisCollection.data[data.result[i].id] = this.getEmptyRecord();
            }

            if (!staticCollection.data[data.result[i].id]) {
                staticCollection.data[data.result[i].id] = this.getEmptyRecord();
            }

            this.thisCollection.data[data.result[i].id].name = data.result[i].name;
            staticCollection.data[data.result[i].id].name = data.result[i].name;

            params = data.result[i].additionalParams ? data.result[i].additionalParams : {};

            for (var key in params) {
                this.thisCollection.data[data.result[i].id].params[key] = params[key];
                staticCollection.data[data.result[i].id].params[key] = params[key];
            }
        }

        this.event();
    };

    this.getDataFromSupply = function (collectionName) {
        var name = collectionName + 'SupplyCollection';
        var collection = this.data[name];

        return collection.data;
    };

    this.addDataRow = function (collectionName, id, value) {
        var name = collectionName + 'Collection';
        var collection = this.data[name];

        if (!collection.data[id]) {
            collection.data[id] = this.getEmptyRecord();
        }

        collection.data[id].name = value;
    };

    this.getEmptyRecord = function () {
        return {name: '', params: {}};
    };
}

function EventContainer() {
    this.currentEvents = {};

    this.setEvents = function (eventList) {
        this.clearEvents();
        this.currentEvents = eventList;

        var selector = '';
        var action = '';
        var event = undefined;
        for (var i = 0; i < eventList.length; i++) {
            selector = eventList[i].selector;
            action = eventList[i].action;
            event = eventList[i].event;

            $(selector).on(action, event);
        }
    };

    this.clearEvents = function () {
        var selector = '';
        var action = '';
        var event = undefined;
        for (var i = 0; i < this.currentEvents.length; i++) {
            selector = this.currentEvents[i].selector;
            action = this.currentEvents[i].action;
            event = this.currentEvents[i].event;

            $(selector).off(action, event);
        }
    }
}
function ServiceContainer() {
    this.servicesList = SERVICES_LIST;
    this.services = {};

    this.get = function (serviceName) {
        if (this.services[serviceName] === undefined) {
            if (!this.load(serviceName)) {
                throw new Error('Service ' + serviceName + ' not found.')
            }
        }

        return this.services[serviceName];
    };

    this.load = function (serviceName) {
        if (this.servicesList[serviceName] === undefined) {
            return false;
        }

        var service = this.servicesList[serviceName];
        var className = service.class;

        this.services[serviceName] = new window[className](service.args);

        return true;
    };
}
function UserContainer() {
    this.user = undefined;
    this.url = '/api/v1.0/user/current';

    this.UserContainer = function () {
        this.onGetUserSuccessEvent = this.onGetUserSuccess.bind(this);
        this.onGetUserErrorEvent = this.onGetUserError.bind(this);
    };

    this.isLogin = function () {
        if (this.user === undefined) {
            this.getUser();
        }

        this.onGetUserSuccess();
    };

    this.getUser = function () {
        var requester = kernel.getServiceContainer().get('requester.ajax');
        requester.setUrl(this.url);
        requester.setData({});
        requester.setMethod(HTTP_METHOD_GET);
        requester.setSuccess(this.onGetUserSuccessEvent);
        requester.setError(this.onGetUserErrorEvent);
        requester.request();
    };

    this.onGetUserSuccess = function (data) {
        if (data !== undefined && data.result !== undefined) {
            this.setUserData(data.result);
        }

        kernel.processShow();
    };

    this.onGetUserError = function () {
        kernel.redirectToLogin();
    };

    this.setUserData = function (data) {
        this.user = data;
    };

    this.UserContainer();
}
function ConsumerDictionaryController() {
    AbstractDictionaryController.call(this);
    this.model = new ConsumerDictionaryModel(this);
    this.cardPath = '/dictionary/consumer/';
    this.viewName = 'view.consumerDictionary';

    this.AbstractDictionaryController();
}
function GroundDictionaryController() {
    AbstractDictionaryController.call(this);
    this.model = new GroundDictionaryModel(this);
    this.cardPath = '/dictionary/ground/';
    this.viewName = 'view.groundDictionary';

    this.AbstractDictionaryController();
}
function MeterDictionaryController() {
    AbstractDictionaryController.call(this);
    this.model = new MeterDictionaryModel(this);
    this.cardPath = '/dictionary/meter/';
    this.viewName = 'view.meterDictionary';

    this.AbstractDictionaryController();
}
function ServiceDictionaryController() {
    AbstractDictionaryController.call(this);
    this.model = new ServiceDictionaryModel(this);
    this.cardPath = '/dictionary/service/';
    this.viewName = 'view.serviceDictionary';

    this.AbstractDictionaryController();
}
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
        var rows = [];

        for (var i = 1; i <= 5; i++) {
            var id = $('[name=id' + i + ']')[0].value;
            var number = $('[name=number' + i + ']')[0].value;
            var line = $('[name=line' + i + ']')[0].value;
            var lineNumber = $('[name=line_number' + i + ']')[0].value;

            rows.push({number: number, line: line, groundNumber: lineNumber, id: id});
        }

        var data = {
            accNumber: $('[name="accNumber"]')[0].value,
            area: $('[name="area"]')[0].value,
            freeArea: $('[name="freeArea"]')[0].value,
            commonArea: $('[name="commonArea"]')[0].value,
            allArea: $('[name="allArea"]')[0].value,
            kontragentId: $('[name="owner"]')[0].dataset.id,
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

    this.onAreaChanged = function () {
        var area = $('[name="area"]')[0].value.replace(',', '.');
        var freeArea = $('[name="freeArea"]')[0].value.replace(',', '.');
        var commonArea = $('[name="commonArea"]')[0].value.replace(',', '.');

        area = area ? area : 0;
        freeArea = freeArea ? freeArea : 0;
        commonArea = commonArea ? commonArea : 0;

        var sum = parseFloat(area) + parseFloat(freeArea) + parseFloat(commonArea);
        $('[name="allArea"]')[0].value = !sum ? 0 : sum.toFixed(3);
    };

    this.GroundCardController();
}
function MeterCardController() {
    AbstractCardController.call(this);
    this.viewName = 'view.meterCard';
    this.backUrl = '/dictionary/meters.html';
    this.model = new MeterCardModel(this);

    this.MeterCardController = function () {
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
            number: $('[name="number"]')[0].value,
            type: $('[name="type"]')[0].value,
            groundId: $('[name="ground"]')[0].dataset.id
        };

        if (this.model.isValidData(data)) {
            this.model.appendDataToRequest(data);

            return true;
        } else {
            alert(this.model.getErrors())
        }

        return false;
    };

    this.MeterCardController();
}
function ServiceCardController() {
    AbstractCardController.call(this);
    this.viewName = 'view.serviceCard';
    this.backUrl = '/dictionary/services.html';
    this.model = new ServiceCardModel(this);

    this.ServiceCardController = function () {
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
            type: $('[name="type"]')[0].value,
            subtype: $('[name="subtype"]')[0].value,
            periodType: $('[name="periodType"]')[0].value
        };

        if (this.model.isValidData(data)) {
            this.model.appendDataToRequest(data);

            return true;
        } else {
            alert(this.model.getErrors())
        }

        return false;
    };

    this.ServiceCardController();
}
function MeterServiceDocumentController() {
    AbstractDocumentController.call(this);
    this.viewName = 'view.meterServiceDocument';
    this.backUrl = '/document/meter_service.html';
    this.model = new MeterServiceDocumentModel(this);
    this.indexData = [];

    this.MeterServiceDocumentController = function () {
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
                meterId: elements[i].childNodes[2].childNodes[0].value,
                date: elements[i].childNodes[3].childNodes[0].value,
                startData: elements[i].childNodes[4].childNodes[0].value,
                endData: elements[i].childNodes[5].childNodes[0].value,
                price: elements[i].childNodes[6].childNodes[0].value,
                sum: elements[i].childNodes[7].childNodes[0].value
            })
        }

        var data = {
            date: $('[name="date"]')[0].value,
            groundId: $('[name="ground"]')[0].dataset.id,
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
        if (event.target.firstElementChild.name == 'ground') {
            this.model.fillMeterList(event.target.firstElementChild.dataset.id);
        }
    };

    this.onIndexDataChanged = function (event) {
        var serviceId = event.target.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0].dataset.id;
        var date = event.target.parentNode.parentNode.childNodes[3].childNodes[0].value;
        var meterId = event.target.parentNode.parentNode.childNodes[2].childNodes[0].value;

        if (!serviceId || !date || !meterId) {
            return;
        }

        this.model.fillRow(date, meterId, serviceId);
    };

    this.onRefreshComplete = function (data) {
        if (data.groundId) {
            this.model.groundId = 0;
            this.model.fillMeterList(data.groundId);
        }
        var view = kernel.getServiceContainer().get(this.viewName);
        view.render(data);

        var eventContainer = kernel.getServiceContainer().get('container.event');
        eventContainer.setEvents(this.events);
    };

    this.onAddRow = function () {
        var ground = $('[name=ground]')[0];

        if (!ground.dataset.id || !this.model.meterList) {
            alert('Сначала необходимо указать Л/с');

            return;
        }

        var view = kernel.getServiceContainer().get(this.viewName);
        var html = $(view.addData(view.rowTemplate, {meterList: this.model.generateMeterList(0)}))[0];

        $('.subtable')[0].append(html);

        var eventContainer = kernel.getServiceContainer().get('container.event');
        eventContainer.setEvents(this.events);
    };

    this.onAutoFill = function () {
        var date = $('[name=date]')[0].value;
        var groundId = $('[name=ground]')[0].dataset.id;

        if(!groundId) {
            alert('Сначала необходимо указать Л/с');

            return;
        }

        this.model.fillAllRows(date, groundId);
    };

    this.onAutoFillComplete = function (data) {
        data = data.result;

        var rows = $('.table_row');
        var rowService = '';
        var date = '';
        var meterId = '';
        var dateHelper = kernel.getServiceContainer().get('helper.date');

        for (var i = 0; i < data.length; i++) {
            var isRowInTable = false;

            for (var j = 0; j < rows.length; j++) {
                rowService = parseInt(rows[j].childNodes[1].childNodes[0].childNodes[0].dataset.id);
                date = rows[j].childNodes[3].childNodes[0].value;
                meterId = parseInt(rows[j].childNodes[2].childNodes[0].value);

                if (rowService == data[i].serviceId && dateHelper.isEqualPeriodMonth(date, data[i].date.date) && meterId == data[i].meterId) {
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
                row.childNodes[2].childNodes[0].value = data[i].meterId;
                row.childNodes[3].childNodes[0].value = dateHelper.getDateFormatInput(data[i].date);
                row.childNodes[4].childNodes[0].value = data[i].startData;
                row.childNodes[5].childNodes[0].value = data[i].endData;
                row.childNodes[6].childNodes[0].value = data[i].price;
                row.childNodes[7].childNodes[0].value = data[i].sum;
            }
        }
    };

    this.MeterServiceDocumentController();
}
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

    this.MetersDocumentController();
}
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
function TarifsDocumentController() {
    AbstractDocumentController.call(this);
    this.viewName = 'view.tarifDocument';
    this.backUrl = '/document/tarifs.html';
    this.model = new TarifsDocumentModel(this);

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

        if (this.model.isValidData(data)) {
            this.model.appendDataToRequest(data);

            return true;
        } else {
            alert(this.model.getErrors())
        }

        return false;
    };

    this.TarifsDocumentController();
}
function MeterServiceDocumentsController() {
    AbstractDocumentsController.call(this);
    this.model = new MeterServiceDocumentsModel(this);
    this.cardPath = '/document/meter_service/';
    this.viewName = 'view.meterServiceDocuments';

    this.AbstractDocumentsController();
}
function MetersDocumentsController() {
    AbstractDocumentsController.call(this);
    this.model = new MetersDocumentsModel(this);
    this.cardPath = '/document/meters/';
    this.viewName = 'view.metersDocuments';
    this.apiPath = '/document/meter/';

    this.AbstractDocumentsController();
}
function PayDocumentsController() {
    AbstractDocumentsController.call(this);
    this.model = new PayDocumentsModel(this);
    this.cardPath = '/document/pays/';
    this.viewName = 'view.paysDocuments';

    this.AbstractDocumentsController();
}

function ServiceDocumentsController() {
    AbstractDocumentsController.call(this);
    this.model = new ServiceDocumentsModel(this);
    this.cardPath = '/document/service/';
    this.viewName = 'view.serviceDocuments';
    this.apiPath = '/document/service_document/';

    this.AbstractDocumentsController();
}
function TarifsDocumentsController() {
    AbstractDocumentsController.call(this);
    this.model = new TarifsDocumentsModel(this);
    this.cardPath = '/document/tarifs/';
    this.viewName = 'view.tarifsDocuments';

    this.AbstractDocumentsController();
}
function LoginController() {
    this.events = [];

    this.LoginController = function () {
        this.onLoginEvent = this.onLogin.bind(this);
        this.onLoginSuccessEvent = this.onLoginSuccess.bind(this);
        this.onLoginErrorEvent = this.onLoginError.bind(this);

        this.events = [
            {'selector': '.login_button', 'action': 'click', 'event': this.onLoginEvent}
        ];
    };

    this.init = function () {
        var view = kernel.getServiceContainer().get('view.login');
        view.render();
        var eventContainer = kernel.getServiceContainer().get('container.event');
        eventContainer.setEvents(this.events);
    };

    this.onLogin = function () {
        var requester = kernel.getServiceContainer().get('requester.ajax');
        requester.setUrl('/api/auth/login');
        requester.setData({'login': $('[name = login]')[0].value, 'password': $('[name = password]')[0].value});
        requester.setMethod(HTTP_METHOD_POST);
        requester.setSuccess(this.onLoginSuccessEvent);
        requester.setError(this.onLoginErrorEvent);
        requester.request();
    };

    this.onLoginSuccess = function (data) {
        var userContainer = kernel.getServiceContainer().get('container.user');
        userContainer.setUserData(data.result);
        document.cookie = 'token=' + data.result.token;
        var url = kernel.getServiceContainer().get('helper.url').getUrlParamsString(document.location.href);
        url = !url ? '/index.html' : url;
        kernel.getServiceContainer().get('helper.navigator').goTo(url);
    };

    this.onLoginError = function () {
        $('.login_error')[0].style.display = 'block';
    };

    this.LoginController();
}
function MainController() {
    this.init = function () {
        var view = kernel.getServiceContainer().get('view.main');
        view.render();
        var eventContainer = kernel.getServiceContainer().get('container.event');
        eventContainer.setEvents(this.events);
    };

    MainControllerAbstract.call(this);

    this.MainControllerAbstract();
}
function BalanceReportController() {
    AbstractReportController.call(this);
    this.view = 'view.balanceReports';
    this.reportUrl = '/api/v1.0/document/report/balance';

    this.BalanceReportController = function () {
        this.events.push({'selector': '.submit', 'action': 'click', 'event': this.refreshReport.bind(this)});
        this.AbstractReportController();
    };

    this.refreshReport = function () {
        this.getData();
    };

    this.BalanceReportController();
}
function InvoiceReportController() {
    AbstractReportController.call(this);
    this.view = 'view.invoiceReportView';
    this.reportUrl = '/api/v1.0/document/service_document/';

    this.InvoiceReportController = function () {
        this.events.push({'selector': '.submit', 'action': 'click', 'event': this.refreshReport.bind(this)});
        this.AbstractReportController();
    };

    this.refreshReport = function () {
        this.getData();
    };

    this.getRequestData = function () {
        return {};
    };

    this.getRequestUrl = function () {
        var selector = $('[name="id"]');

        if (selector.length) {
            return this.reportUrl + selector[0].value;
        }

        var data = kernel.getServiceContainer().get('helper.url').getUrlParamsObject(document.location.href);

        return data['id'] === undefined ? this.reportUrl + '1' : this.reportUrl + data['id'];
    };

    this.InvoiceReportController();
}

function MainReportController() {
    AbstractReportController.call(this);
    this.view = 'view.mainReport';
    this.reportUrl = '/api/v1.0/document/report/main';

    this.MainReportController = function () {
        this.events.push({'selector': '.submit', 'action': 'click', 'event': this.refreshReport.bind(this)});
        this.AbstractReportController();
    };

    this.refreshReport = function () {
        this.getData();
    };

    this.MainReportController();
}
function MeterInvoiceReportController() {
    AbstractReportController.call(this);
    this.view = 'view.meterInvoiceReportView';
    this.reportUrl = '/api/v1.0/document/meter_service/';

    this.MeterInvoiceReportController = function () {
        this.events.push({'selector': '.submit', 'action': 'click', 'event': this.refreshReport.bind(this)});
        this.AbstractReportController();
    };

    this.refreshReport = function () {
        this.getData();
    };

    this.getRequestData = function () {
        return {};
    };

    this.getRequestUrl = function () {
        var selector = $('[name="id"]');

        if (selector.length) {
            return this.reportUrl + selector[0].value;
        }

        var data = kernel.getServiceContainer().get('helper.url').getUrlParamsObject(document.location.href);

        return data['id'] === undefined ? this.reportUrl + '1' : this.reportUrl + data['id'];
    };

    this.MeterInvoiceReportController();
}
function MetersReportController() {
    AbstractReportController.call(this);
    this.view = 'view.metersReport';
    this.reportUrl = '/api/v1.0/document/report/meters';

    this.MetersReportController = function () {
        this.events.push({'selector': '.submit', 'action': 'click', 'event': this.refreshReport.bind(this)});
        this.AbstractReportController();
    };

    this.refreshReport = function () {
        this.getData();
    };

    this.MetersReportController();
}
function SmsReportController() {
    AbstractReportController.call(this);
}
function SocialInvoiceReportController() {
    AbstractReportController.call(this);
    this.view = 'view.socialInvoiceReportView';
    this.reportUrl = '/api/v1.0/document/service_document/';

    this.SocialInvoiceReportController = function () {
        this.events.push({'selector': '.submit', 'action': 'click', 'event': this.refreshReport.bind(this)});
        this.AbstractReportController();
    };

    this.refreshReport = function () {
        this.getData();
    };

    this.getRequestData = function () {
        return {};
    };

    this.getRequestUrl = function () {
        var selector = $('[name="id"]');

        if (selector.length) {
            return this.reportUrl + selector[0].value;
        }

        var data = kernel.getServiceContainer().get('helper.url').getUrlParamsObject(document.location.href);

        return data['id'] === undefined ? this.reportUrl + '1' : this.reportUrl + data['id'];
    };

    this.SocialInvoiceReportController();
}
function AbstractCardController() {
    MainControllerAbstract.call(this);
    SelectBoxElement.call(this);
    this.viewName = undefined;
    this.submodels = {};
    this.backUrl = '/index.html';

    this.AbstractCardController = function () {
        this.onSaveEvent = this.onSave.bind(this);
        this.onCancelEvent = this.onCancel.bind(this);

        this.events.push({'selector': '.save_button', 'action': 'click', 'event': this.onSaveEvent});
        this.events.push({'selector': '.cancel_button', 'action': 'click', 'event': this.onCancelEvent});

        var events = this.generateActions();
        for (var i = 0; i < events.length; i++) {
            this.events.push(events[i]);
        }

        this.MainControllerAbstract();
    };

    this.init = function (params) {
        this.model.setId(params[0]);
        this.model.requestData = {};

        this.model.refresh();
    };

    this.onRefreshComplete = function (data) {
        var view = kernel.getServiceContainer().get(this.viewName);
        view.render(data);

        var eventContainer = kernel.getServiceContainer().get('container.event');
        eventContainer.setEvents(this.events);
    };

    this.onSave = function () {
        if (this.fillModel()) {
            this.model.save();
        }
    };

    this.onCancel = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo(this.backUrl);
    };

    this.fillModel = function () {

    };

}
function AbstractDictionaryController() {
    MainControllerAbstract.call(this);
    this.model = null;
    this.cardPath = undefined;
    this.viewName = undefined;

    this.AbstractDictionaryController = function () {
        this.onAddRecordEvent = this.onAddRecord.bind(this);
        this.onEditRecordEvent = this.onEditRecord.bind(this);
        this.onDeleteRecordEvent = this.onDeleteRecord.bind(this);
        this.onSelectRecordEvent = this.onSelectRecord.bind(this);
        this.onSortRecordsEvent = this.onSortRecords.bind(this);
        this.onFilterRecordsEvent = this.onFilterRecords.bind(this);
        this.onClearFilterRecordsEvent = this.onClearFilters.bind(this);

        this.events.push({'selector': '.add_button', 'action': 'click', 'event': this.onAddRecordEvent});
        this.events.push({'selector': '.edit_button', 'action': 'click', 'event': this.onEditRecordEvent});
        this.events.push({'selector': '.delete_button', 'action': 'click', 'event': this.onDeleteRecordEvent});
        this.events.push({'selector': '.table_row', 'action': 'click', 'event': this.onSelectRecordEvent});
        this.events.push({'selector': '.table_row', 'action': 'dblclick', 'event': this.onEditRecordEvent});
        this.events.push({'selector': '.column_head', 'action': 'click', 'event': this.onSortRecordsEvent});
        this.events.push({'selector': '.filter_button', 'action': 'click', 'event': this.onFilterRecordsEvent});
        this.events.push({'selector': '.clear_filter_button', 'action': 'click', 'event': this.onClearFilterRecordsEvent});

        this.MainControllerAbstract();
    };

    this.init = function () {
        this.model.appendDataToRequest(kernel.getServiceContainer().get('helper.url').getUrlParamsObject(document.location.href));

        this.model.refresh();
    };

    this.onRefreshComplete = function (data) {
        var view = kernel.getServiceContainer().get(this.viewName);
        view.render(data);

        $('.paginator-button').on('click', this.pageChanged.bind(this));

        var eventContainer = kernel.getServiceContainer().get('container.event');
        eventContainer.setEvents(this.events);
    };

    this.onSortRecords = function (event) {
        var urlHelper = kernel.getServiceContainer().get('helper.url');
        this.model.appendDataToRequest({
            'order_by': event.currentTarget.dataset.name,
            'order_type': this.model.getRequestData('order_by') !== event.currentTarget.dataset.name
                ? 'desc'
                : this.model.getRequestData('order_type') === 'desc'
                ? 'asc'
                : 'desc'
        });

        kernel.getServiceContainer().get('helper.navigator').goTo(
            urlHelper.buildUrl(
                urlHelper.getCurrentUrlWithoutDomain(document.location.href),
                this.model.getRequestData()
            )
        );
    };

    this.onAddRecord = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo(this.cardPath + 'new.html')
    };

    this.onEditRecord = function (event) {
        var id = 0;
        if (event.currentTarget.class == 'table_row') {
            this.onSelectRecord(event);
            id = event.currentTarget.childNodes[0].innerHTML;
        } else {
            id = this.model.currentId;
        }

        if (this.model.currentId === undefined) {
            return;
        }

        kernel.getServiceContainer().get('helper.navigator').goTo(this.cardPath + id + '.html')
    };

    this.onDeleteRecord = function () {
        if (this.model.currentId === undefined) {
            return;
        }

        this.model.delete(this.cardPath + 'delete/' + this.model.currentId);
    };

    this.onSelectRecord = function (event) {
        if (this.model.currentId !== undefined) {
            $('.table_row[data-id="' + this.model.currentId + '"]')[0].classList.remove('active');
        }
        this.model.currentId = event.currentTarget.dataset.id;

        event.currentTarget.classList.add('active');
    };

    this.pageChanged = function (event) {
        var urlHelper = kernel.getServiceContainer().get('helper.url');
        this.model.appendDataToRequest({
            'page': event.currentTarget.dataset.page
        });

        kernel.getServiceContainer().get('helper.navigator').goTo(
            urlHelper.buildUrl(
                urlHelper.getCurrentUrlWithoutDomain(document.location.href),
                this.model.getRequestData()
            )
        );
    };

    this.onFilterRecords = function () {
        var urlHelper = kernel.getServiceContainer().get('helper.url');
        var elements = $('input');

        var data = [];
        for (var i = 0; i < elements.length; i++) {
            data['filter[' + elements[i].name + ']'] = elements[i].value;
        }

        this.model.appendDataToRequest(data);

        kernel.getServiceContainer().get('helper.navigator').goTo(
            urlHelper.buildUrl(
                urlHelper.getCurrentUrlWithoutDomain(document.location.href),
                this.model.getRequestData()
            )
        );
    };

    this.onClearFilters = function () {
        var elements = $('input');

        for (var i = 0; i < elements.length; i++) {
            elements[i].value = '';
        }

        for (var key in this.model.filters) {
            this.model.filters[key].value = '';
        }
    }
}
function AbstractDocumentController() {
    AbstractCardController.call(this);

    this.AbstractDocumentController = function () {
        this.onAddRowEvent = this.onAddRow.bind(this);
        this.onDeleteRowEvent = this.onDeleteRow.bind(this);

        this.events.push({'selector': '.add_row_button', 'action': 'click', 'event': this.onAddRowEvent});
        this.events.push({'selector': '.delete_row_button', 'action': 'click', 'event': this.onDeleteRowEvent});

        this.AbstractCardController();
    };

    this.init = function (params) {
        this.model.requestData = {};
        if (params === undefined || params[0] === undefined || params[0] == 'new') {
            this.onRefreshComplete(this.model.defaultData);
            this.model.setId(0);

            return;
        }

        this.model.setId(params[0]);

        this.model.refresh();
    };

    this.onAddRow = function () {
        var view = kernel.getServiceContainer().get(this.viewName);
        var html = $(view.addData(view.rowTemplate, {}))[0];

        $('.subtable')[0].append(html);

        var eventContainer = kernel.getServiceContainer().get('container.event');
        eventContainer.setEvents(this.events);
    };

    this.onDeleteRow = function () {
        var elements = $('[name=checker]');
        var result = [];
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].checked) {
                result.push(elements[i]);
            }
        }

        if (!result.length) {
            alert('Нечего удалять. Пожалуйста, выделите строки.')

            return;
        }

        for (i = 0; i < result.length; i++) {
            result[i].parentElement.parentElement.remove()
        }
    };

    this.onAutoFill = function () {
        alert(1);
    };

    this.onAutoFillComplete = function () {

    };
}
function AbstractDocumentsController() {
    AbstractDictionaryController.call(this);
    this.apiPath = '';

    this.onDeleteRecord = function () {
        if (this.model.currentId === undefined) {
            return;
        }

        this.model.delete(this.apiPath + 'delete/' + this.model.currentId);
    };

    this.AbstractDocumentsController = function () {
        this.AbstractDictionaryController()
    }
}
function AbstractReportController() {
    MainControllerAbstract.call(this);
    this.viewName = '';
    this.reportUrl = '';

    this.AbstractReportController = function () {
        this.MainControllerAbstract();
    };

    this.init = function () {
        this.getData();
    };

    this.getRequestData = function () {
        var dataHelper = kernel.getServiceContainer().get('helper.date');
        var selector = $('[name="dateStart"]');
        var startDate = selector.length ? selector[0].value : dataHelper.getFirstDayOfMonth(new Date());
        selector = $('[name="dateEnd"]');
        var endDate = selector.length ? selector[0].value : dataHelper.getLastDayOfMonth(new Date());

        return {dateStart: startDate, dateEnd: endDate};
    };

    this.getRequestUrl = function () {
        return this.reportUrl;
    };

    this.getData = function () {
        var requester = kernel.getServiceContainer().get('requester.ajax');
        requester.setUrl(this.getRequestUrl());
        requester.setData(this.getRequestData());
        requester.setMethod(HTTP_METHOD_GET);
        requester.setSuccess(this.onRender.bind(this));
        requester.request();
    };

    this.onRender = function (data) {
        var view = kernel.getServiceContainer().get(this.view);
        view.render(data);

        var eventContainer = kernel.getServiceContainer().get('container.event');
        eventContainer.setEvents(this.events);
    };
}
function MainControllerAbstract() {
    this.events = [];

    this.MainControllerAbstract = function () {
        this.onGetGroundDictionaryEvent = this.onGetGroundDictionary.bind(this);
        this.onGetMetersDictionaryEvent = this.onGetMetersDictionary.bind(this);
        this.onGetConsumerDictionaryEvent = this.onGetConsumerDictionary.bind(this);
        this.onGetServicesDictionaryEvent = this.onGetServicesDictionary.bind(this);
        this.onGetPayDocumentsEvent = this.onGetPayDocuments.bind(this);
        this.onGetServiceDocumentsEvent = this.onGetServiceDocuments.bind(this);
        this.onGetMeterServiceDocumentsEvent = this.onGetMeterServiceDocuments.bind(this);
        this.onGetMetersDocumentsEvent = this.onGetMetersDocuments.bind(this);
        this.onGetTarifsDocumentsEvent = this.onGetTarifDocuments.bind(this);
        this.onGetMainReportEvent = this.onGetMainReport.bind(this);
        this.onGetMetersReportEvent = this.onGetMetersReport.bind(this);
        this.onGetBalanceReportEvent = this.onGetBalanceReport.bind(this);
        this.onGetSmsReportEvent = this.onGetSmsReport.bind(this);
        this.onInvoiceReportEvent = this.onInvoiceReport.bind(this);
        this.onMeterInvoiceReportEvent = this.onMeterInvoiceReport.bind(this);
        this.onSocialInvoiceReportEvent = this.onSocialInvoiceReport.bind(this);

        this.events.push({'selector': '.ground_dictionary_button', 'action': 'click', 'event': this.onGetGroundDictionaryEvent});
        this.events.push({'selector': '.services_dictionary_button', 'action': 'click', 'event': this.onGetServicesDictionaryEvent});
        this.events.push({'selector': '.meters_dictionary_button', 'action': 'click', 'event': this.onGetMetersDictionaryEvent});
        this.events.push({'selector': '.consumer_dictionary_button', 'action': 'click', 'event': this.onGetConsumerDictionaryEvent});
        this.events.push({'selector': '.pay_documents_button', 'action': 'click', 'event': this.onGetPayDocumentsEvent});
        this.events.push({'selector': '.service_documents_button', 'action': 'click', 'event': this.onGetServiceDocumentsEvent});
        this.events.push({'selector': '.service_meter_documents_button', 'action': 'click', 'event': this.onGetMeterServiceDocumentsEvent});
        this.events.push({'selector': '.meters_documents_button', 'action': 'click', 'event': this.onGetMetersDocumentsEvent});
        this.events.push({'selector': '.tarifs_documents_button', 'action': 'click', 'event': this.onGetTarifsDocumentsEvent});
        this.events.push({'selector': '.main_report_button', 'action': 'click', 'event': this.onGetMainReportEvent});
        this.events.push({'selector': '.meters_report_button', 'action': 'click', 'event': this.onGetMetersReportEvent});
        this.events.push({'selector': '.balance_report_button', 'action': 'click', 'event': this.onGetBalanceReportEvent});
        this.events.push({'selector': '.sms_report_button', 'action': 'click', 'event': this.onGetSmsReportEvent});
        this.events.push({'selector': '.invoice_report_button', 'action': 'click', 'event': this.onInvoiceReportEvent});
        this.events.push({'selector': '.meter_invoice_report_button', 'action': 'click', 'event': this.onMeterInvoiceReportEvent});
        this.events.push({'selector': '.social_invoice_report_button', 'action': 'click', 'event': this.onSocialInvoiceReportEvent});
    };

    this.onGetConsumerDictionary = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/dictionary/consumers.html');
    };

    this.onGetGroundDictionary = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/dictionary/grounds.html');
    };

    this.onGetMetersDictionary = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/dictionary/meters.html');
    };

    this.onGetServicesDictionary = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/dictionary/services.html');
    };

    this.onGetPayDocuments = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/document/pays.html');
    };

    this.onGetServiceDocuments = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/document/service.html');
    };

    this.onGetMeterServiceDocuments = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/document/meter_service.html');
    };

    this.onGetMetersDocuments = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/document/meters.html');
    };

    this.onGetTarifDocuments = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/document/tarifs.html');
    };

    this.onGetMainReport = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/report/main.html');
    };

    this.onGetMetersReport = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/report/meters.html');
    };

    this.onGetBalanceReport = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/report/balance.html');
    };

    this.onGetSmsReport = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/report/sms.html');
    };

    this.onInvoiceReport = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/report/invoice.html');
    };

    this.onMeterInvoiceReport = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/report/meter_invoice.html');
    };

    this.onSocialInvoiceReport = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/report/social_invoice.html');
    };
}
var collections = {
    kontragentCollection: {
        type: 'static',
        data: {}
    },
    kontragentSupplyCollection: {
        type: 'dynamic',
        url: '/api/v1.0/dictionary/supply/kontragent',
        staticCollection: 'kontragentCollection',
        data: {}
    },
    groundCollection: {
        type: 'static',
        data: {}
    },
    groundSupplyCollection: {
        type: 'dynamic',
        url: '/api/v1.0/dictionary/supply/ground',
        staticCollection: 'groundCollection',
        data: {}
    },
    meterCollection: {
        type: 'static',
        data: {}
    },
    meterSupplyCollection: {
        type: 'dynamic',
        url: '/api/v1.0/dictionary/supply/meter',
        staticCollection: 'meterCollection',
        data: {}
    },
    meterTypesCollection: {
        type: 'static',
        data: {
            1: {name: 'Электричество'},
            2: {name: 'Вода'}
        }
    },
    meterDocumentSupplyCollection: {
        type: 'dynamic',
        url: '/api/v1.0/document/supply/meter',
        staticCollection: 'meterDocumentCollection',
        data: {}
    },
    meterDocumentCollection: {
        type: 'static',
        data: {}
    },
    serviceTypesCollection: {
        type: 'static',
        data: {
            1: {name: 'Член сообщества'},
            2: {name: 'Участок'}
        }
    },
    serviceSubtypesCollection: {
        type: 'static',
        data: {
            1: {name: 'Фиксированный'},
            2: {name: 'По общей площади'},
            3: {name: 'По счетчику (электричество)'},
            4: {name: 'По счетчику (вода)'},
            5: {name: 'По занимаемой площади'}
        }
    },
    servicePeriodTypesCollection: {
        type: 'static',
        data: {
            1: {name: 'Без периодизации'},
            2: {name: 'Ежемесячно'},
            3: {name: 'Ежегодно'}
        }
    },
    serviceCollection: {
        type: 'static',
        data: {}
    },
    serviceSupplyCollection: {
        type: 'dynamic',
        url: '/api/v1.0/dictionary/supply/service',
        staticCollection: 'serviceCollection',
        data: {}
    }
};
const HTTP_METHOD_GET    = 'GET';
const HTTP_METHOD_POST   = 'POST';
const HTTP_METHOD_PUT    = 'PUT';
const HTTP_METHOD_PATCH  = 'PATCH';
const HTTP_METHOD_DELETE = 'DELETE';
var RECORD_NUMBER_LANG = "№ п/п";
var ACCOUNT_NUMBER_LANG = "№ счета";
var NUMBER_LANG = "№ куреня";
var GROUND_LINE_LANG = "Линия";
var GROUNDS_LANG = "Участки";
var GROUND_NUMBER_LANG = "Номер участка";
var GROUND_AREA_LANG = "Занимаемая площадь, кв. м.";
var GROUND_FREE_AREA_LANG = "Не относящаяся к причалу площадь, кв. м.";
var GROUND_COMMON_AREA_LANG = "Площадь общего пользования, кв. м.";
var GROUND_ALL_AREA_LANG = "Всего площадь, кв. м.";
var OWNER_FULL_NAME_LANG = "ФИО собственника";
var KONTRAGENT_PAY_FULL_NAME_LANG = "ФИО плательщика";
var KONTRAGENT_ID_LANG = "Л/с потребителя";
var SURNAME_LANG = "Фамилия";
var NAME_LANG = "Имя";
var NAME2_LANG = "Отчество";
var PHONE_LANG = "Телефон";
var ADRESS_LANG = "Адрес";
var METER_NUMBER_LANG = "Номер счетчика";
var METER_TYPE_LANG = "Тип счетчика";
var METER_GROUND_OWNER_LANG = "Участок установки";
var SERVICE_NAME_LANG = "Название услуги";
var SERVICE_TYPE_LANG = "Тип потребителя услуги";
var SERVICE_CALC_TYPE_BASE_LANG = "Тип базы для расчета";
var SERVICE_PERIOD_TYPE_LANG = "Период начисления";
var TARIFS_DATE_START_LANG = "Дата начала действия";
var DOCUMENT_DATE_LANG = "Дата документа";
var TARIF_LANG = "Тариф, грн";
var SUM_LANG = "Сумма, грн";
var START_VALUE_LANG = "Предыдущие данные";
var END_VALUE_LANG = "Текущие данные";
var METER_NAME_LANG = "Счетчик";
var PERIOD_LANG = "Период";
var SERVICE_CALC_BASE_LANG = "База расчета";
var KOMMENT_LANG = "Комментарий";
var SHEET_LANG = 'Таблица';
var DOLG_LANG = 'Задолженность';
var RECEIPT = "Квитанция";
var RECEIPT_SOC = "Квитанция (общественная)";
const ROUTES = {
    '/index\.html': 'controller.main',
    '/login\.html': 'controller.login',
    '/dictionary/consumers\.html': 'controller.consumerDictionary',
    '/dictionary/grounds\.html': 'controller.groundDictionary',
    '/dictionary/meters\.html': 'controller.meterDictionary',
    '/dictionary/services\.html': 'controller.serviceDictionary',
    '/dictionary/ground/(.*)\.html': 'controller.groundCard',
    '/dictionary/meter/(.*)\.html': 'controller.meterCard',
    '/dictionary/service/(.*)\.html': 'controller.serviceCard',
    '/dictionary/consumer/(.*)\.html': 'controller.consumerCard',
    '/document/pays\.html': 'controller.payDocuments',
    '/document/service\.html': 'controller.serviceDocuments',
    '/document/meter_service\.html': 'controller.meterServiceDocuments',
    '/document/meter_service/(.*)\.html': 'controller.meterServiceDocument',
    '/document/meters\.html': 'controller.metersDocuments',
    '/document/tarifs\.html': 'controller.tarifsDocuments',
    '/document/tarifs/(.*)\.html': 'controller.tarifsDocument',
    '/document/meters/(.*)\.html': 'controller.metersDocument',
    '/document/service/(.*)\.html': 'controller.serviceDocument',
    '/document/pays/(.*)\.html': 'controller.payDocument',
    '/report/main\.html': 'controller.mainReport',
    '/report/meters\.html': 'controller.metersReport',
    '/report/balance\.html': 'controller.balanceReport',
    '/report/sms\.html': 'controller.smsReport',
    '/report/invoice\.html': 'controller.invoiceReport',
    '/report/meter_invoice\.html': 'controller.meterInvoiceReport',
    '/report/social_invoice\.html': 'controller.socialInvoiceReport'
};

LOGIN_ROUTE = '/login.html';
const SERVICES_LIST = {
    'helper.url': {'class': 'UrlHelper', 'args': {}},
    'helper.navigator': {'class': 'NavigatorHelper', 'args': {}},
    'helper.date': {'class': 'DateHelper', 'args': {}},
    'service.router': {'class': 'Router', 'args': {}},
    'service.validator': {'class': 'ValidatorService', 'args': {}},
    'container.user': {'class': 'UserContainer', 'args': {}},
    'controller.main': {'class': 'MainController', 'args': {}},
    'controller.login': {'class': 'LoginController', 'args': {}},
    'view.login': {'class': 'LoginView', 'args': {}},
    'container.event': {'class': 'EventContainer', 'args': {}},
    'container.collection': {'class': 'CollectionContainer', 'args': {}},
    'requester.ajax': {'class': 'AjaxRequester', 'args': {}},
    'requester.ajax2': {'class': 'AjaxRequester', 'args': {}},
    //'requester.ajax': {'class': 'AjaxMockRequester', 'args': {}}, //mock
    'view.main': {'class': 'MainView', 'args': {}},
    'controller.serviceDictionary': {'class': 'ServiceDictionaryController', 'args': {}},
    'controller.groundDictionary': {'class': 'GroundDictionaryController', 'args': {}},
    'controller.meterDictionary': {'class': 'MeterDictionaryController', 'args': {}},
    'controller.consumerDictionary': {'class': 'ConsumerDictionaryController', 'args': {}},
    'view.groundDictionary': {'class': 'GroundDictionaryView', 'args': {}},
    'view.consumerDictionary': {'class': 'ConsumerDictionaryView', 'args': {}},
    'view.serviceDictionary': {'class': 'ServiceDictionaryView', 'args': {}},
    'view.meterDictionary': {'class': 'MeterDictionaryView', 'args': {}},
    'view.table': {'class': 'TableView', 'args': {}},
    'view.tableHead': {'class': 'TableHeadView', 'args': {}},
    'view.tableRow': {'class': 'TableRowView', 'args': {}},
    'view.tablePaginator': {'class': 'TablePaginatorView', 'args': {}},
    'controller.groundCard': {'class': 'GroundCardController', 'args': {}},
    'view.groundCard': {'class': 'GroundCardView', 'args': {}},
    'controller.serviceCard': {'class': 'ServiceCardController', 'args': {}},
    'view.serviceCard': {'class': 'ServiceCardView', 'args': {}},
    'controller.meterCard': {'class': 'MeterCardController', 'args': {}},
    'view.meterCard': {'class': 'MeterCardView', 'args': {}},
    'controller.consumerCard': {'class': 'ConsumerCardController', 'args': {}},
    'view.consumerCard': {'class': 'ConsumerCardView', 'args': {}},
    'controller.serviceDocuments': {'class': 'ServiceDocumentsController', 'args': {}},
    'controller.serviceDocument': {'class': 'ServiceDocumentController', 'args': {}},
    'controller.meterServiceDocuments': {'class': 'MeterServiceDocumentsController', 'args': {}},
    'controller.meterServiceDocument': {'class': 'MeterServiceDocumentController', 'args': {}},
    'controller.metersDocuments': {'class': 'MetersDocumentsController', 'args': {}},
    'controller.metersDocument': {'class': 'MetersDocumentController', 'args': {}},
    'controller.payDocuments': {'class': 'PayDocumentsController', 'args': {}},
    'controller.payDocument': {'class': 'PayDocumentController', 'args': {}},
    'controller.tarifsDocuments': {'class': 'TarifsDocumentsController', 'args': {}},
    'controller.tarifsDocument': {'class': 'TarifsDocumentController', 'args': {}},
    'controller.balanceReport': {'class': 'BalanceReportController', 'args': {}},
    'controller.mainReport': {'class': 'MainReportController', 'args': {}},
    'controller.metersReport': {'class': 'MetersReportController', 'args': {}},
    'controller.smsReport': {'class': 'SmsReportController', 'args': {}},
    'view.serviceDocuments': {'class': 'ServiceDocumentsView', 'args': {}},
    'view.meterServiceDocuments': {'class': 'MeterServiceDocumentsView', 'args': {}},
    'view.metersDocuments': {'class': 'MetersDocumentsView', 'args': {}},
    'view.paysDocuments': {'class': 'PayDocumentsView', 'args': {}},
    'view.tarifsDocuments': {'class': 'TarifsDocumentsView', 'args': {}},
    'view.tarifDocument': {'class': 'TarifsDocumentView', 'args': {}},
    'view.payDocument': {'class': 'PayDocumentView', 'args': {}},
    'view.meterDocument': {'class': 'MeterDocumentView', 'args': {}},
    'view.meterServiceDocument': {'class': 'MeterServiceDocumentView', 'args': {}},
    'view.serviceDocument': {'class': 'ServiceDocumentView', 'args': {}},
    'view.balanceReports': {'class': 'BalanceReportView', 'args': {}},
    'view.mainReport': {'class': 'MainReportView', 'args': {}},
    'view.metersReport': {'class': 'MetersReportView', 'args': {}},
    'view.smsReports': {'class': 'SmsReportsView', 'args': {}},
    'controller.invoiceReport': {'class': 'InvoiceReportController', 'args': {}},
    'controller.meterInvoiceReport': {'class': 'MeterInvoiceReportController', 'args': {}},
    'controller.socialInvoiceReport': {'class': 'SocialInvoiceReportController', 'args': {}},
    'view.invoiceReportView': {'class': 'InvoiceReportView', 'args': {}},
    'view.meterInvoiceReportView': {'class': 'MeterInvoiceReportView', 'args': {}},
    'view.socialInvoiceReportView': {'class': 'SocialInvoiceReportView', 'args': {}},
};

var VALIDATION_TYPE_STRING = 'string';
var VALIDATION_TYPE_EMPTY_STRING = 'emptyString';
var VALIDATION_TYPE_OBJECT_ID = 'objectId';
var VALIDATION_TYPE_PHONE = 'phone';
var VALIDATION_TYPE_FLOAT = 'float';
var VALIDATION_TYPE_DATE = 'date';
var VALIDATION_TYPE_NOT_EMPTY_ARRAY = 'notEmptyArray';
var VALIDATION_TYPE_TABLE_ROWS = 'tableRows';
var VALIDATION_TYPE_NOT_EMPTY_FLOAT = 'notEmptyFloat';
function DateHelper() {
    this.getFirstDayOfMonth = function (date) {
        var newDate = new Date(date.getFullYear(), date.getMonth(), 1);

        return this.getDateFormatInput(newDate);
    };
    this.getLastDayOfMonth = function (date) {
        var newDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        return this.getDateFormatInput(newDate);
    };
    this.getDateFormatInput = function (date) {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    };
    this.isEqualDate = function (date1, date2) {
        date1 = new Date(date1);
        date2 = new Date(date2);

        return date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate();
    };
    this.isEqualPeriodMonth = function (date1, date2) {
        date1 = new Date(date1);
        date2 = new Date(date2);

        return date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth();
    }
}
function NavigatorHelper() {
    this.goTo = function (url) {
        url = kernel.getServiceContainer().get('helper.url').getDomain(document.location.href) + url;
        history.pushState(null, null, url);

        kernel.navigate();
    }
}
function UrlHelper() {
    this.getUrlWithoutDomain = function (url) {
        var parts = url.split('/');
        result = parts.splice(3, parts.length);

        return '/' + result.join('/');
    };
    this.getDomain = function (url) {
        var parts = url.split('/');
        parts.splice(3, parts.length);

        return parts.join('/');
    };
    this.getCurrentUrl = function (url) {
        var parts = url.split('?');

        return parts[0];
    };
    this.getCurrentUrlWithoutDomain = function (url) {
        return this.getCurrentUrl(this.getUrlWithoutDomain(url));
    };
    this.getUrlParamsString = function (url) {
        var parts = url.split('?');

        return parts.length < 2 ? '' : parts[1];
    };
    this.buildUrl = function (url, params) {
        var paramsArray = [];

        for (var key in params) {
            if (params[key] instanceof Array) {
                for (var subkey in params[key]) {
                    paramsArray.push(key + '[' + subkey + ']=' + params[key][subkey]);
                }
            } else {
                paramsArray.push(key + '=' + params[key]);
            }
        }

        return url + '?' + paramsArray.join('&');
    };
    this.getUrlParamsObject = function (url) {
        var params = this.getUrlParamsString(url);
        var result = {};

        if (!params) {
            return result;
        }
        var parts = params.split('&');
        var forParts = [];

        for (var i = 0; i < parts.length; i++) {
            forParts = parts[i].split('=');
            result[forParts[0]] = forParts[1];
        }

        return result;
    }
}
function ConsumerDictionaryModel(params) {
    DictionaryAbstractModel.call(this);
    this.url = '/api/v1.0/dictionary/list/kontragent';
    this.dataNames = {
        "id": RECORD_NUMBER_LANG,
        "surname": SURNAME_LANG,
        "name": NAME_LANG,
        "name2": NAME2_LANG,
        "phone": PHONE_LANG,
        "adress": ADRESS_LANG
    };

    this.ConsumerDictionaryModel = function (object) {
        this.DictionaryAbstractModel(object);
    };

    this.ConsumerDictionaryModel(params);
}
function GroundDictionaryModel(params) {
    DictionaryAbstractModel.call(this);
    this.url = '/api/v1.0/dictionary/list/ground';
    this.dataNames = {
        "id": RECORD_NUMBER_LANG,
        "accNumber": ACCOUNT_NUMBER_LANG,
        "number": NUMBER_LANG,
        "line": GROUND_LINE_LANG,
        "groundNumber": GROUND_NUMBER_LANG,
        "area": GROUND_AREA_LANG,
        "freeArea": GROUND_FREE_AREA_LANG,
        "commonArea": GROUND_COMMON_AREA_LANG,
        "allArea": GROUND_ALL_AREA_LANG,
        "owner": OWNER_FULL_NAME_LANG
    };

    this.GroundDictionaryModel = function (object) {
        this.DictionaryAbstractModel(object);
    };

    this.GroundDictionaryModel(params);
}
function MeterDictionaryModel(params) {
    DictionaryAbstractModel.call(this);
    this.url = '/api/v1.0/dictionary/list/meter';
    this.dataNames = {
        "id": RECORD_NUMBER_LANG,
        "number": METER_NUMBER_LANG,
        "type": METER_TYPE_LANG,
        "ground": METER_GROUND_OWNER_LANG
    };

    this.ServiceDictionaryModel = function (object) {
        this.DictionaryAbstractModel(object);
    };

    this.ServiceDictionaryModel(params);
}
function ServiceDictionaryModel(params) {
    DictionaryAbstractModel.call(this);
    this.url = '/api/v1.0/dictionary/list/service';
    this.dataNames = {
        "id": RECORD_NUMBER_LANG,
        "name": SERVICE_NAME_LANG,
        "type": SERVICE_TYPE_LANG,
        "subtype": SERVICE_CALC_TYPE_BASE_LANG
    };

    this.ServiceDictionaryModel = function (object) {
        this.DictionaryAbstractModel(object);
    };

    this.ServiceDictionaryModel(params);
}
function ConsumerCardModel(object) {
    AbstractCardModel.call(this);
    this.baseUrl = '/api/v1.0/dictionary/kontragent';

    this.isValidData = function (data) {
        var validator = kernel.getServiceContainer().get('service.validator');
        var validationData = [
            {data: data.name, type: VALIDATION_TYPE_STRING, fieldName: NAME_LANG},
            {data: data.surname, type: VALIDATION_TYPE_STRING, fieldName: SURNAME_LANG},
            {data: data.name2, type: VALIDATION_TYPE_STRING, fieldName: NAME2_LANG},
            {data: data.phone, type: VALIDATION_TYPE_PHONE, fieldName: PHONE_LANG}
        ];

        var isValid = validator.validate(validationData);
        this.errors = isValid ? '' : validator.getErrors();

        return isValid;
    };

    this.AbstractCardModel(object);
}
function GroundCardModel(object) {
    AbstractCardModel.call(this);
    this.baseUrl = '/api/v1.0/dictionary/ground';
    this.collectionFields = {
        kontragent: {
            id: 'kontragentId',
            name: 'owner'
        }
    };

    this.isValidData = function (data) {
        var validator = kernel.getServiceContainer().get('service.validator');
        var validationData = [
            {data: data.area, type: VALIDATION_TYPE_FLOAT, fieldName: GROUND_AREA_LANG},
            {data: data.freeArea, type: VALIDATION_TYPE_FLOAT, fieldName: GROUND_FREE_AREA_LANG},
            {data: data.commonArea, type: VALIDATION_TYPE_FLOAT, fieldName: GROUND_COMMON_AREA_LANG},
            {data: data.kontragentId, type: VALIDATION_TYPE_OBJECT_ID, fieldName: OWNER_FULL_NAME_LANG}
        ];

        var isValid = validator.validate(validationData);
        this.errors = isValid ? '' : validator.getErrors();

        return isValid;
    };

    this.AbstractCardModel(object);
}
function MeterCardModel(object) {
    AbstractCardModel.call(this);
    this.baseUrl = '/api/v1.0/dictionary/meter';
    this.collectionFields = {
        ground: {
            id: 'groundId',
            name: 'ground'
        }
    };

    this.isValidData = function (data) {
        var validator = kernel.getServiceContainer().get('service.validator');
        var validationData = [
            {data: data.number, type: VALIDATION_TYPE_STRING, fieldName: METER_NUMBER_LANG},
            {data: data.groundId, type: VALIDATION_TYPE_OBJECT_ID, fieldName: METER_GROUND_OWNER_LANG}
        ];

        var isValid = validator.validate(validationData);
        this.errors = isValid ? '' : validator.getErrors();

        return isValid;
    };

    this.AbstractCardModel(object);
}
function ServiceCardModel(object) {
    AbstractCardModel.call(this);
    this.baseUrl = '/api/v1.0/dictionary/service';

    this.isValidData = function (data) {
        var validator = kernel.getServiceContainer().get('service.validator');
        var validationData = [
            {data: data.name, type: VALIDATION_TYPE_STRING, fieldName: SERVICE_NAME_LANG}
        ];

        var isValid = validator.validate(validationData);
        this.errors = isValid ? '' : validator.getErrors();

        return isValid;
    };

    this.AbstractCardModel(object);
}
function MeterServiceDocumentModel(params) {
    DocumentAbstractModel.call(this);
    this.baseUrl = '/api/v1.0/document/meter_service';
    this.groundId = 0;
    this.meterList = undefined;
    this.meterListUrl = '/api/v1.0/dictionary/meter_by_ground/';

    this.MeterServiceDocumentModel = function (object) {
        var date = new Date();

        this.groundId = 0;
        this.defaultData.date = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);

        this.DocumentAbstractModel(object);
    };

    this.isValidData = function (data) {
        var validator = kernel.getServiceContainer().get('service.validator');
        var validationData = [
            {data: data.date, type: VALIDATION_TYPE_DATE, fieldName: DOCUMENT_DATE_LANG},
            {data: data.groundId, type: VALIDATION_TYPE_OBJECT_ID, fieldName: KONTRAGENT_PAY_FULL_NAME_LANG},
            {data: data.rows, type: VALIDATION_TYPE_NOT_EMPTY_ARRAY, fieldName: SHEET_LANG},
            {data: data.rows, type: VALIDATION_TYPE_TABLE_ROWS, fieldName: '', subvalidation: [
                {data: 'serviceId', type: VALIDATION_TYPE_OBJECT_ID, fieldName: SERVICE_NAME_LANG},
                {data: 'meterId', type: VALIDATION_TYPE_OBJECT_ID, fieldName: METER_NUMBER_LANG},
                {data: 'date', type: VALIDATION_TYPE_DATE, fieldName: PERIOD_LANG},
                {data: 'startData', type: VALIDATION_TYPE_FLOAT, fieldName: START_VALUE_LANG},
                {data: 'endData', type: VALIDATION_TYPE_FLOAT, fieldName: END_VALUE_LANG},
                {data: 'price', type: VALIDATION_TYPE_FLOAT, fieldName: TARIF_LANG},
                {data: 'sum', type: VALIDATION_TYPE_FLOAT, fieldName: SUM_LANG}
            ]}
        ];

        var isValid = validator.validate(validationData);
        this.errors = isValid ? '' : validator.getErrors();

        return isValid;
    };

    this.fillMeterList = function (id) {
        if (this.groundId == id) {
            return;
        }
        this.meterList = undefined;
        var requester = kernel.getServiceContainer().get('requester.ajax2');
        requester.setUrl(this.meterListUrl + id);
        requester.setData({});
        requester.setMethod(HTTP_METHOD_GET);
        requester.setSuccess(this.setMeterList.bind(this));
        requester.request();
    };

    this.setMeterList = function (data) {
        data = data.result;

        if (data && data[0].groundId) {
            this.groundId = data[0].groundId;
        }

        this.meterList = [];
        for (var i = 0; i < data.length; i++) {
            this.meterList[data[i].id] = data[i].number + '(' + data[i].type + ')';
        }

        var rows = $('.table_row');
        var list = '';
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].childNodes[2].childNodes[0].dataset.id == 'null') {
                continue;
            }

            list = this.generateMeterList(rows[i].childNodes[2].childNodes[0].dataset.id);
            rows[i].childNodes[2].childNodes[0].innerHTML = list;
        }
    };

    this.generateMeterList = function (id) {
        var result = '';
        var list = this.meterList;
        for (var key in list) {
            result += '<option value="' + key + '"' + (key == id ? ' selected' : '') + '>' + list[key] + '</option>';
        }

        return result;
    };

    this.fillRow = function (date, meterId, serviceId) {
        var requester = kernel.getServiceContainer().get('requester.ajax');
        requester.setUrl('/api/v1.0/document/fill_meter_service_row');
        requester.setData({date: date, meterId: meterId, serviceId:serviceId});
        requester.setMethod(HTTP_METHOD_GET);
        requester.setSuccess(this.setRowData.bind(this));
        requester.request();
    };

    this.fillAllRows = function (date, groundId) {
        var requester = kernel.getServiceContainer().get('requester.ajax');
        requester.setUrl('/api/v1.0/document/fill_meter_service');
        requester.setData({date: date, groundId: groundId});
        requester.setMethod(HTTP_METHOD_GET);
        requester.setSuccess(this.creator.onAutoFillComplete.bind(this.creator));
        requester.request();
    };

    this.setRowData = function (data) {
        data = data.result;

        var rows = $('.table_row');
        var sum = '';
        var row = '';
        var date = '';
        var meterId = '';
        var dateHelper = kernel.getServiceContainer().get('helper.date');

        for (var i = 0; i < rows.length; i++) {
            date = rows[i].childNodes[3].childNodes[0].value;
            meterId = parseInt(rows[i].childNodes[2].childNodes[0].value);
            sum = rows[i].childNodes[7].childNodes[0].value;

            if (dateHelper.isEqualDate(date, data.date) && meterId == data.meterId && !sum) {
                row = rows[i];
            }
        }

        if (!row) {
            return;
        }

        row.childNodes[4].childNodes[0].value = data.startData;
        row.childNodes[5].childNodes[0].value = data.endData;
        row.childNodes[6].childNodes[0].value = data.price;
        row.childNodes[7].childNodes[0].value = data.sum;
    };

    this.MeterServiceDocumentModel(params);
}
function MetersDocumentModel(params) {
    DocumentAbstractModel.call(this);
    this.baseUrl = '/api/v1.0/document/meter';
    this.collectionFields = {
        meterDocument: {
            id: 'meterId',
            name: 'meter'
        }
    };

    this.MetersDocumentModel = function (object) {
        var date = new Date();

        this.defaultData.date = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);

        this.DocumentAbstractModel(object);
    };

    this.isValidData = function (data) {
        var validator = kernel.getServiceContainer().get('service.validator');
        var validationData = [
            {data: data.date, type: VALIDATION_TYPE_DATE, fieldName: DOCUMENT_DATE_LANG},
            {data: data.rows, type: VALIDATION_TYPE_NOT_EMPTY_ARRAY, fieldName: SHEET_LANG},
            {data: data.rows, type: VALIDATION_TYPE_TABLE_ROWS, fieldName: '', subvalidation: [
                {data: 'meterId', type: VALIDATION_TYPE_OBJECT_ID, fieldName: METER_NAME_LANG},
                {data: 'startValue', type: VALIDATION_TYPE_FLOAT, fieldName: START_VALUE_LANG},
                {data: 'endValue', type: VALIDATION_TYPE_FLOAT, fieldName: END_VALUE_LANG}
            ]}
        ];

        var isValid = validator.validate(validationData);
        this.errors = isValid ? '' : validator.getErrors();

        return isValid;
    };

    this.MetersDocumentModel(params);
}
function PayDocumentModel(params) {
    DocumentAbstractModel.call(this);
    this.baseUrl = '/api/v1.0/document/pay';
    this.fillUrl = '/api/v1.0/document/fill_pays';

    this.PayDocumentModel = function (object) {
        var date = new Date();

        this.defaultData.date = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);

        this.DocumentAbstractModel(object);
    };

    this.isValidData = function (data) {
        var validator = kernel.getServiceContainer().get('service.validator');
        var validationData = [
            {data: data.date, type: VALIDATION_TYPE_DATE, fieldName: DOCUMENT_DATE_LANG},
            {data: data.kontragentId, type: VALIDATION_TYPE_OBJECT_ID, fieldName: OWNER_FULL_NAME_LANG},
            {data: data.rows, type: VALIDATION_TYPE_NOT_EMPTY_ARRAY, fieldName: SHEET_LANG},
            {data: data.rows, type: VALIDATION_TYPE_TABLE_ROWS, fieldName: '', subvalidation: [
                {data: 'serviceId', type: VALIDATION_TYPE_OBJECT_ID, fieldName: SERVICE_NAME_LANG},
                {data: 'groundId', type: VALIDATION_TYPE_OBJECT_ID, fieldName: KONTRAGENT_ID_LANG},
                {data: 'sum', type: VALIDATION_TYPE_FLOAT, fieldName: SUM_LANG}
            ]}
        ];

        var isValid = validator.validate(validationData);
        this.errors = isValid ? '' : validator.getErrors();

        return isValid;
    };

    this.fillDocument = function (id, date) {
        this.meterList = undefined;
        var requester = kernel.getServiceContainer().get('requester.ajax2');
        requester.setUrl(this.fillUrl);
        requester.setData({kontragentId: id, date: date});
        requester.setMethod(HTTP_METHOD_GET);
        requester.setSuccess(this.fillDocumentComplete.bind(this));
        requester.request();
    };

    this.fillDocumentComplete = function (data) {
        this.creator.fillDocument(data.result);
    };

    this.PayDocumentModel(params);
}
function ServiceDocumentModel(params) {
    DocumentAbstractModel.call(this);
    this.baseUrl = '/api/v1.0/document/service_document';
    this.groundList = undefined;
    this.kontragentId = 0;
    this.groundListUrl = '/api/v1.0/dictionary/ground_by_kontragent/';

    this.ServiceDocumentModel = function (object) {
        var date = new Date();

        this.defaultData.date = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        this.kontragentId = 0;

        this.DocumentAbstractModel(object);
    };

    this.isValidData = function (data) {
        var validator = kernel.getServiceContainer().get('service.validator');
        var validationData = [
            {data: data.date, type: VALIDATION_TYPE_DATE, fieldName: DOCUMENT_DATE_LANG},
            {data: data.kontragentId, type: VALIDATION_TYPE_OBJECT_ID, fieldName: KONTRAGENT_ID_LANG},
            {data: data.rows, type: VALIDATION_TYPE_NOT_EMPTY_ARRAY, fieldName: SHEET_LANG},
            {data: data.rows, type: VALIDATION_TYPE_TABLE_ROWS, fieldName: '', subvalidation: [
                {data: 'serviceId', type: VALIDATION_TYPE_OBJECT_ID, fieldName: SERVICE_NAME_LANG},
                {data: 'date', type: VALIDATION_TYPE_DATE, fieldName: PERIOD_LANG},
                {data: 'count', type: VALIDATION_TYPE_FLOAT, fieldName: SERVICE_CALC_BASE_LANG},
                {data: 'price', type: VALIDATION_TYPE_FLOAT, fieldName: TARIF_LANG},
                {data: 'sum', type: VALIDATION_TYPE_FLOAT, fieldName: SUM_LANG}
            ]}
        ];

        var isValid = validator.validate(validationData);
        this.errors = isValid ? '' : validator.getErrors();

        return isValid;
    };

    this.fillGroundList = function (id) {
        if (this.kontragentId == id) {
            return;
        }
        this.groundList = undefined;
        var requester = kernel.getServiceContainer().get('requester.ajax2');
        requester.setUrl(this.groundListUrl + id);
        requester.setData({});
        requester.setMethod(HTTP_METHOD_GET);
        requester.setSuccess(this.setGroundList.bind(this));
        requester.request();
    };

    this.setGroundList = function (data) {
        data = data.result;

        if (data && data[0].kontragentId) {
            this.kontragentId = data[0].kontragentId;
        }

        this.groundList = [];
        for (var i = 0; i < data.length; i++) {
            this.groundList[data[i].id] = data[i].accNumber;
        }

        var rows = $('.table_row');
        var list = '';
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].childNodes[2].childNodes[0].dataset.id == 'null') {
                continue;
            }

            list = this.generateGroundList(rows[i].childNodes[2].childNodes[0].dataset.id);
            rows[i].childNodes[2].childNodes[0].innerHTML = list;
        }
    };

    this.generateGroundList = function (id) {
        var result = '';
        var list = this.groundList;
        for (var key in list) {
            result += '<option value="' + key + '"' + (key == id ? ' selected' : '') + '>' + list[key] + '</option>';
        }

        return result;
    };

    this.fillRow = function (date, kontragentId, groundId, serviceId) {
        var requester = kernel.getServiceContainer().get('requester.ajax');
        requester.setUrl('/api/v1.0/document/fill_service_row');
        requester.setData({date: date, groundId: groundId, serviceId:serviceId});
        requester.setMethod(HTTP_METHOD_GET);
        requester.setSuccess(this.setRowData.bind(this));
        requester.request();
    };

    this.fillAllRows = function (date, kontragentId) {
        var requester = kernel.getServiceContainer().get('requester.ajax');
        requester.setUrl('/api/v1.0/document/fill_service');
        requester.setData({date: date, kontragentId: kontragentId});
        requester.setMethod(HTTP_METHOD_GET);
        requester.setSuccess(this.creator.onAutoFillComplete.bind(this.creator));
        requester.request();
    };

    this.setRowData = function (data) {
        data = data.result;

        var rows = $('.table_row');
        var rowService = '';
        var sum = '';
        var row = '';
        var date = '';
        var dateHelper = kernel.getServiceContainer().get('helper.date');

        for (var i = 0; i < rows.length; i++) {
            rowService = parseInt(rows[i].childNodes[1].childNodes[0].childNodes[0].dataset.id);
            date = rows[i].childNodes[3].childNodes[0].value;
            sum = rows[i].childNodes[6].childNodes[0].value;

            if (rowService == data.serviceId && dateHelper.isEqualDate(date, data.date.date) && !sum) {
                if (!data.groundId) {
                    row = rows[i];
                } else {
                    if (rows[i].childNodes[2].childNodes[0].value == data.groundId) {
                        row = rows[i];
                    }
                }
            }
        }

        if (!row) {
            return;
        }

        row.childNodes[2].childNodes[0].value = data.groundId;
        row.childNodes[4].childNodes[0].value = data.count;
        row.childNodes[5].childNodes[0].value = data.price;
        row.childNodes[6].childNodes[0].value = data.sum;
    };

    this.ServiceDocumentModel(params);
}
function TarifsDocumentModel(params) {
    DocumentAbstractModel.call(this);
    this.baseUrl = '/api/v1.0/document/tarif';
    this.collectionFields = {
        service: {
            id: 'serviceId',
            name: 'service'
        }
    };

    this.TarifsDocumentModel = function (object) {
        var date = new Date();

        this.defaultData.dateStart = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);

        this.DocumentAbstractModel(object);
    };

    this.isValidData = function (data) {
        var validator = kernel.getServiceContainer().get('service.validator');
        var validationData = [
            {data: data.dateStart, type: VALIDATION_TYPE_DATE, fieldName: TARIFS_DATE_START_LANG},
            {data: data.rows, type: VALIDATION_TYPE_NOT_EMPTY_ARRAY, fieldName: SHEET_LANG},
            {data: data.rows, type: VALIDATION_TYPE_TABLE_ROWS, fieldName: '', subvalidation: [
                {data: 'serviceId', type: VALIDATION_TYPE_OBJECT_ID, fieldName: SERVICE_NAME_LANG},
                {data: 'price', type: VALIDATION_TYPE_FLOAT, fieldName: TARIF_LANG}
            ]}
        ];

        var isValid = validator.validate(validationData);
        this.errors = isValid ? '' : validator.getErrors();

        return isValid;
    };

    this.TarifsDocumentModel(params);
}
function MeterServiceDocumentsModel(params) {
    DocumentsAbstractModel.call(this);

    this.url = '/api/v1.0/document/list/meter_service';
    this.dataNames = {
        "id": RECORD_NUMBER_LANG,
        "date": DOCUMENT_DATE_LANG,
        "ground": KONTRAGENT_ID_LANG,
        "doc": RECEIPT
    };
    this.filters = {
        'period': {name: PERIOD_LANG, type:'period'},
        'ground': {name:KONTRAGENT_ID_LANG, value:''}
    };

    this.MeterServiceDocumentsModel = function (object) {
        this.DocumentsAbstractModel(object);
    };

    this.MeterServiceDocumentsModel(params);
}
function MetersDocumentsModel(params) {
    DocumentsAbstractModel.call(this);

    this.url = '/api/v1.0/document/list/meter';
    this.dataNames = {
        "id": RECORD_NUMBER_LANG,
        "date": DOCUMENT_DATE_LANG
    };
    this.filters = {
        'period': {name: PERIOD_LANG, type:'period'}
    };

    this.MetersDocumentsModel = function (object) {
        this.DocumentsAbstractModel(object);
    };

    this.MetersDocumentsModel(params);
}
function PayDocumentsModel(params) {
    DocumentsAbstractModel.call(this);

    this.url = '/api/v1.0/document/list/pay';
    this.dataNames = {
        "id": RECORD_NUMBER_LANG,
        "date": DOCUMENT_DATE_LANG,
        "kontragent": KONTRAGENT_PAY_FULL_NAME_LANG
    };
    this.filters = {
        'period': {name: PERIOD_LANG, type:'period'},
        'kontragent': {name:KONTRAGENT_PAY_FULL_NAME_LANG, value:''}
    };

    this.PayDocumentsModel = function (object) {
        this.DocumentsAbstractModel(object);
    };

    this.PayDocumentsModel(params);
}
function ServiceDocumentsModel(params) {
    DocumentsAbstractModel.call(this);

    this.url = '/api/v1.0/document/list/service_document';
    this.dataNames = {
        "id": RECORD_NUMBER_LANG,
        "date": DOCUMENT_DATE_LANG,
        "kontragent": OWNER_FULL_NAME_LANG,
        "doc": RECEIPT,
        "docSoc": RECEIPT_SOC
    };
    this.filters = {
        'period': {name: PERIOD_LANG, type:'period'},
        'kontragent': {name:OWNER_FULL_NAME_LANG, value:''}
    };

    this.ServiceDocumentsModel = function (object) {
        this.DocumentsAbstractModel(object);
    };

    this.ServiceDocumentsModel(params);
}
function TarifsDocumentsModel(params) {
    DocumentsAbstractModel.call(this);

    this.url = '/api/v1.0/document/list/tarif';
    this.dataNames = {
        "id": RECORD_NUMBER_LANG,
        "created": DOCUMENT_DATE_LANG,
        "dateStart": TARIFS_DATE_START_LANG
    };
    this.filters = {
        'period': {name: PERIOD_LANG, type:'period'}
    };

    this.TarifsDocumentsModel = function (object) {
        this.DocumentsAbstractModel(object);
    };

    this.TarifsDocumentsModel(params);
}
function BalanceReportModel() {
    
}
function MainReportModel() {

}
function MetersReportModel() {
    
}
function SmsReportModel() {
    
}
function AbstractCardModel(object) {
    AbstractModel.call(this);
    this.recordId = 0;

    this.AbstractCardModel = function (object) {
        this.onSaveSuccessEvent = this.onSaveSuccess.bind(this);
        this.onSaveErrorEvent = this.onSaveError.bind(this);

        this.AbstractModel(object);
    };

    this.setId = function (id) {
        this.recordId = id;
        this.url = id ? this.baseUrl + '/' + id : this.baseUrl;
    };

    this.save = function () {
        var method = HTTP_METHOD_POST;
        var url = this.url ? this.url : this.baseUrl;

        var requester = kernel.getServiceContainer().get('requester.ajax');
        requester.setUrl(url);
        requester.setData(this.requestData);
        requester.setMethod(method);
        requester.setSuccess(this.onSaveSuccessEvent);
        requester.setError(this.onSaveErrorEvent);
        requester.request();
    };

    this.onSaveSuccess = function () {
        alert('Сохранение прошло успешно');

        if (!this.backUrl) {
            return;
        }

        kernel.getServiceContainer().get('helper.navigator').goTo(this.backUrl);
    };

    this.onSaveError = function () {
        alert('Ошибка соединения с сервером. Повторите попытку позднее');
    };
}
function AbstractModel() {
    this.creator = undefined;
    this.data = {};
    this.requestData = {};
    this.defaultData = {};
    this.method = 'GET';
    this.successCallback = undefined;
    this.url = '';
    this.collectionFields = {};
    this.backUrl = '';
    this.errors = '';
    this.filters = {};

    this.AbstractModel = function (object) {
        this.creator = object;
        this.backUrl = object.backUrl ? object.backUrl : '';

        this.onRefreshSuccessEvent = this.onRefreshSuccess.bind(this);
        this.onRequestErrorEvent = this.onRequestError.bind(this);
    };

    this.setSuccessCallback = function (callback) {
        this.successCallback = callback;
    };

    this.appendDataToRequest = function (data) {
        for (var key in data) {
            if (data[key]) {
                this.requestData[key] = data[key];
            } else {
                delete(this.requestData[key]);
            }
        }
    };

    this.refresh = function () {
        var requester = kernel.getServiceContainer().get('requester.ajax');
        requester.setUrl(this.url);
        requester.setData(this.requestData);
        requester.setMethod(this.method);
        requester.setSuccess(this.onRefreshSuccessEvent);
        requester.setError(this.onRequestErrorEvent);
        requester.request();
    };

    this.delete = function (url) {
        var requester = kernel.getServiceContainer().get('requester.ajax');
        requester.setUrl('/api/v1.0' + url);
        requester.setData('');
        requester.setMethod(HTTP_METHOD_GET);
        requester.setSuccess(this.refresh.bind(this));
        requester.setError(this.onRequestErrorEvent);
        requester.request();
    };

    this.getRequestData = function (paramName) {
        if (paramName === undefined) {
            return this.requestData;
        }

        return this.requestData[paramName];
    };

    this.onRefreshSuccess = function (data) {
        this.data = data.result;

        this.saveDataToCollection();

        if (this.successCallback !== undefined) {
            this.successCallback(this.getDataForView())
        } else {
            this.creator.onRefreshComplete(this.getDataForView());
        }
    };

    this.saveDataToCollection = function () {
        var container = kernel.getServiceContainer().get('container.collection');

        for (var key in this.collectionFields) {
            container.addDataRow(key, this.data[this.collectionFields[key].id], this.data[this.collectionFields[key].name]);
        }
    };

    this.getDataForView = function () {
        return this.isEmpty(this.data) ? this.defaultData : this.data
    };

    this.isEmpty = function (data) {
        if (data === undefined) {
            return true;
        }

        if (data === null) {
            return true;
        }

        if (typeof data == "object" && !Object.keys(data).length) {
            return true;
        }

        return false;
    };

    this.onRequestError = function () {
        alert('Не получилось получить доступ к серверу.');
    };

    this.isValidData = function () {
        return true;
    };

    this.getErrors = function () {
        return this.errors;
    };
}
function DictionaryAbstractModel() {
    AbstractModel.call(this);
    this.currentId = undefined;

    this.DictionaryAbstractModel = function (object) {
        this.AbstractModel(object);
    };

    this.getDataForView = function () {
        var result = {
            'columns': this.dataNames,
            'filters': this.fillFilters(),
            'data': this.isEmpty(this.data) ? this.defaultData : this.data
        };
        if (this.getRequestData('order_by')) {
            result['orderBy'] = this.getRequestData('order_by');
        }
        if (this.getRequestData('order_type')) {
            result['orderType'] = this.getRequestData('order_type');
        }

        return result;
    };

    this.fillFilters = function () {
        if (!Object.keys(this.filters).length) {
            return {};
        }

        if (this.filters.period) {
            if (this.getRequestData('filter[periodStart]') && this.filters.period) {
                this.filters.period['periodStart'] = this.getRequestData('filter[periodStart]');
            } else {
                this.filters.period['periodStart'] = '';
            }

            if (this.getRequestData('filter[periodEnd]') && this.filters.period) {
                this.filters.period['periodEnd'] = this.getRequestData('filter[periodEnd]');
            } else {
                this.filters.period['periodEnd'] = '';
            }
        }

        for (var key in this.filters) {
            var data = this.getRequestData('filter[' + key + ']');
            if (data) {
                this.filters[key].value = decodeURI(data);
            }
        }

        return this.filters;
    }
}
function DocumentAbstractModel() {
    AbstractCardModel.call(this);

    this.DocumentAbstractModel = function (object) {
        this.AbstractCardModel(object);
    };

    this.saveDataToCollection = function () {
        var container = kernel.getServiceContainer().get('container.collection');

        for (var key in this.collectionFields) {
            if (this.data[this.collectionFields[key].id]) {
                container.addDataRow(key, this.data[this.collectionFields[key].id], this.data[this.collectionFields[key].name]);
            }

            if (this.data['rows'][0][this.collectionFields[key].id]) {
                for (var i = 0; i < this.data['rows'].length; i++) {
                    container.addDataRow(key, this.data['rows'][i][this.collectionFields[key].id], this.data['rows'][i][this.collectionFields[key].name]);
                }
            }
        }
    };
}
function DocumentsAbstractModel() {
    DictionaryAbstractModel.call(this);

    this.DocumentsAbstractModel = function (object) {
        this.DictionaryAbstractModel(object);
    }
}
function AjaxMockRequester() {
    this.requestData = {
        'url': '',
        'data': {},
        'method': 'GET',
        'onSuccess': undefined,
        'onError': undefined
    };

    this.mocks = [
        {'result': '{"status":"success","result":{}}', 'url': '/api/v1.0/login', 'data': {'login': 'admin', 'password': 'qwerty'}, 'method': 'GET'},
        {'url': '/api/v1.0/ground', 'data': {}, 'method': 'GET', 'result': '{"status":"success","result":[{"id":1,"accNumber":449,"line":4,"groundNumber":245,"area":"91","freeArea":"0","commonArea":"13,34","allArea":"104,34","owner":"Агафонников И.В."}, {"id":2,"accNumber":450,"line":4,"groundNumber":245,"area":"0","freeArea":"0","commonArea":"0","allArea":"0","owner":"Агафонников И.В."}]}'},
        {'url': '/api/v1.0/consumer', 'data': {}, 'method': 'GET', 'result': '{"status":"success","result":[{"id":1,"name":"Игорь","surname":"Агафонников","name2":"Валерьевич","phone":"+380931234567","adress":"г. Одесса ул. М. Арнаутская 1, кв. 1"}]}'},
        {'url': '/api/v1.0/service', 'data': {}, 'method': 'GET', 'result': '{"status":"success","result":[{"id":1,"name":"Членские взносы","type":"Член сообщества","subtype":"Фиксированный"},{"id":2,"name":"Аренда земли","type":"Участок","subtype":"По площади"},{"id":3,"name":"Услуги энергоснабжения","type":"Участок","subtype":"По счетчику (электричество)"}]}'},
        {'url': '/api/v1.0/meter', 'data': {}, 'method': 'GET', 'result': '{"status":"success","result":[{"id":1,"number":"Э1111","type":"Электричество","ground":"4/245"},{"id":2,"number":"Г2222","type":"Газовый","ground":"4/245"}]}'},
        {'url': '/api/v1.0/ground/1', 'data': {}, 'method': 'GET', 'result': '{"status":"success","result":{"id":1,"accNumber":449,"line":4,"groundNumber":245,"area":"91","freeArea":"0","commonArea":"13,34","allArea":"104,34","owner":"Агафонников И.В."}}'},
        {'url': '/api/v1.0/consumer/1', 'data': {}, 'method': 'GET', 'result': '{"status":"success","result":{"id":1,"name":"Игорь","surname":"Агафонников","name2":"Валерьевич","phone":"+380931234567","adress":"г. Одесса ул. М. Арнаутская 1, кв. 1"}}'},
        {'url': '/api/v1.0/meter/1', 'data': {}, 'method': 'GET', 'result': '{"status":"success","result":{"id":1,"number":"Э1111","type":"Электричество","ground":"4/245"}}'},
        {'url': '/api/v1.0/service/1', 'data': {}, 'method': 'GET', 'result': '{"status":"success","result":{"id":1,"name":"Членские взносы","type":"Член сообщества","subtype":"Фиксированный"}}'},
    ];

    this.setUrl = function (url) {
        this.requestData.url = url;
    };

    this.setData = function (data) {
        this.requestData.data = data;
    };

    this.setMethod = function (method) {
        this.requestData.method = method;
    };

    this.setSuccess = function(closure) {
        this.requestData.onSuccess = closure;
    };

    this.setError = function (closure) {
        this.requestData.onError = closure;
    };

    this.request = function () {
        var isEqual = false;
        for (var i = 0; i < this.mocks.length; i++) {
            if (this.mocks[i].url == this.requestData.url && this.requestData.method == this.mocks[i].method) {
                isEqual = true;
                for (var key in this.mocks[i].data) {
                    if (this.mocks[i].data[key] != this.requestData.data[key]) {
                        isEqual = false;

                        break;
                    }
                }

                if (isEqual) {
                    this.requestData.onSuccess(this.mocks[i].result);

                    return;
                }
            }
        }

        this.requestData.onError();
    }
}
function AjaxRequester() {
    this.requestData = {
        'url': '',
        'data': {},
        'method': 'GET',
        'onSuccess': undefined,
        'onError': undefined
    };

    this.setUrl = function (url) {
        this.requestData.url = url;
    };

    this.setData = function (data) {
        this.requestData.data = data;
    };

    this.setMethod = function (method) {
        this.requestData.method = method;
    };

    this.setSuccess = function(closure) {
        this.requestData.onSuccess = closure;
    };

    this.setError = function (closure) {
        this.requestData.onError = closure;
    };

    this.request = function () {
        $.ajax({
            url: this.requestData.url,
            data: this.requestData.data,
            type: this.requestData.method,
            success: this.requestData.onSuccess,
            error: this.requestData.onError
        });
    }
}
function SelectBoxElement() {
    this.element = undefined;
    this.text = 'Введите информацию для поиска';
    this.failText = 'По вашему запросу ничего не найдено';

    this.generateActions = function () {
        this.onActivateSelectBoxEvent = this.onActivateSelectBox.bind(this);
        this.onBlurSelectBoxEvent = this.onBlurSelectBox.bind(this);
        this.onKeyPressSelectBoxEvent = this.onKeyPressSelectBox.bind(this);
        this.onGetDataSuccessEvent = this.onGetDataSuccess.bind(this);
        this.onSelectSelectBoxItemEvent = this.onSelectSelectBoxItem.bind(this);

        return [
            {'selector': '.selectbox > :input', 'action': 'focus', 'event': this.onActivateSelectBoxEvent},
            {'selector': '.selectbox > :input', 'action': 'keydown', 'event': this.onKeyPressSelectBoxEvent},
            {'selector': '.selectbox', 'action': 'blur', 'event': this.onBlurSelectBoxEvent}
        ];
    };

    this.onKeyPressSelectBox = function (event) {
        this.element = $(event.target.parentElement.childNodes[0])[0];

        if (event.originalEvent.code == 'Escape') {
            this.onBlurSelectBox({target: event.target.parentElement});

            return;
        };

        if (this.element.value.length < 2) {
            return;
        }

        var container = kernel.getServiceContainer().get('container.collection');
        container.getDataBySupply(this.element.dataset.type, this.getRequestData(), this.onGetDataSuccessEvent);
    };

    this.onGetDataSuccess = function () {
        var data = kernel.getServiceContainer().get('container.collection').getDataFromSupply(this.element.dataset.type);

        var html = data == {} ? this.failText : this.text;
        for (var key in data) {
            html += '<p class="selectbox-item" data-id="' + key + '">' + data[key].name + ' (' + key + ')</p>';
        }

        $(this.element)[0].nextSibling.innerHTML = html;
        $('.selectbox-item').bind('click', this.onSelectSelectBoxItemEvent);
    };

    this.onSelectSelectBoxItem = function (event) {
        this.element.dataset.id = event.target.dataset.id;
        var blurEvent = {target: this.element.parentElement};
        this.onBlurSelectBox(blurEvent);
    };

    this.onActivateSelectBox = function (event) {
        $(event.target.parentElement.childNodes[1]).removeClass();
        $(event.target.parentElement.childNodes[1]).addClass('selectbox-list');
        $(event.target.parentElement.childNodes[1])[0].innerHTML = this.text;

        this.element = $(event.target.parentElement.childNodes[0])[0];
        this.element.value = '';
    };

    this.onBlurSelectBox = function (event) {
        $(event.target.childNodes[1]).removeClass();
        $(event.target.childNodes[1]).addClass('selectbox-list-hide');

        var container = kernel.getServiceContainer().get('container.collection');
        var input = $(event.target.childNodes[0])[0];
        var collection = input.dataset.type;
        var id = input.dataset.id;

        input.value = container.getDataById(collection, id).name;
        $('body')[0].focus();

        this.afterOnBlur(event);
    };

    this.afterOnBlur = function (event) {

    };

    this.getRequestData = function () {
        return this.element.value;
    }
}

function ValidatorService() {
    this.errors = '';

    this.validate = function (data, clearErrors) {
        if (clearErrors !== false) {
            this.errors = '';
        }

        for (var i = 0; i < data.length; i++) {
            switch (data[i].type) {
                case VALIDATION_TYPE_STRING:
                    this.validateString(data[i].data, data[i].fieldName);
                    break;
                case VALIDATION_TYPE_EMPTY_STRING:
                    this.validateEmptyString(data[i].data, data[i].fieldName);
                    break;
                case VALIDATION_TYPE_OBJECT_ID:
                    this.validateObjectId(data[i].data, data[i].fieldName);
                    break;
                case VALIDATION_TYPE_PHONE:
                    this.validatePhone(data[i].data, data[i].fieldName);
                    break;
                case VALIDATION_TYPE_FLOAT:
                    this.validateFloat(data[i].data, data[i].fieldName);
                    break;
                case VALIDATION_TYPE_NOT_EMPTY_FLOAT:
                    this.validateNotEmptyFloat(data[i].data, data[i].fieldName);
                    break;
                case VALIDATION_TYPE_DATE:
                    this.validateDate(data[i].data, data[i].fieldName);
                    break;
                case VALIDATION_TYPE_NOT_EMPTY_ARRAY:
                    this.validateNotEmptyArray(data[i].data, data[i].fieldName);
                    break;
                case VALIDATION_TYPE_TABLE_ROWS:
                    for (var j = 0; j < data[i].data.length; j++) {
                        var subData = [];
                        for (var n = 0; n < data[i].subvalidation.length; n++) {
                            var obj = {};
                            for (var key in data[i].subvalidation[n]) {
                                obj[key] = data[i].subvalidation[n][key];
                            }
                            subData.push(obj);
                        }

                        for (var n = 0; n < subData.length; n++) {
                            subData[n].data = data[i].data[j][subData[n].data];
                            subData[n].fieldName = subData[n].fieldName + ' (строка ' + (j + 1) + ')';
                        }

                        this.validate(subData, false);
                    }
                    break;
            }
        }

        return !this.errors;
    };

    this.getErrors = function () {
        return this.errors;
    };

    this.validateNotEmptyArray = function (data, fieldName) {
        if (!data || !data.length) {
            this.errors += fieldName + ' не может быть пустой\n';
        }
    };

    this.validateDate = function (data, fieldName) {
        if (!data) {
            this.errors += 'Поле ' + fieldName + ' не может быть пустым\n';
            return;
        }

        if (!data instanceof Date) {
            data = new Date().parse(date);
        }

        if (!data instanceof Date && !data.getMonth()) {
            this.errors += 'Поле ' + fieldName + ' должно содержать дату\n';
        }
    };

    this.validateString = function (data, fieldName) {
        if (!data) {
            this.errors += 'Поле ' + fieldName + ' не может быть пустым\n';
            return;
        }
        this.validateEmptyString(data, fieldName);
    };

    this.validateEmptyString = function (data, fieldName) {
        if (data.length > 255) {
            this.errors += 'Поле ' + fieldName + ' слишком длинное\n';
        }
    };

    this.validateObjectId = function (data, fieldName) {
        if (!data) {
            this.errors += 'Поле ' + fieldName + ' не может быть пустым\n';
        }
    };

    this.validatePhone = function (data, fieldName) {
        if (!data) {
            return;
        }
        if (data.length != 13 || !/\+\d{12}/.test(data)) {
            this.errors += 'Поле ' + fieldName + ' должно начинаться с символа "+" и содержать 12 цифр\n';
        }
    };

    this.validateNotEmptyFloat = function (data, fieldName) {
        if (!data) {
            this.errors += 'Поле ' + fieldName + ' не может быть пустым\n';
            return;
        }

        if (!/^\w{0}\d*[\.,\,]\d*\w{0}$/.test(data) && !/^\w{0}\d*\w{0}$/.test(data)) {
            this.errors += 'Поле ' + fieldName + ' может содержать только цифры и знаки "." или ","\n';
        }
    };

    this.validateFloat = function (data, fieldName) {
        if (!data) {
            return;
        }

        if (!/^\w{0}\d*[\.,\,]\d*\w{0}$/.test(data) && !/^\w{0}\d*\w{0}$/.test(data)) {
            this.errors += 'Поле ' + fieldName + ' может содержать только цифры и знаки "." или ","\n';
        }
    };
}
function ConsumerDictionaryView() {
    AbstractDictionaryView.call(this);
}
function GroundDictionaryView() {
    AbstractDictionaryView.call(this);
    this.buildTemplate = function (data) {
        for (var i = 0; i < data.data.result.length; i++) {
            var rows = data.data.result[i].rows;
            var number = [];
            var line = [];
            var ground = [];

            if (!rows) {
                data.data.result[i].number = '';
                data.data.result[i].line = '';
                data.data.result[i].groundNumber = '';

                continue;
            }

            if (rows.length == 1) {
                data.data.result[i].number = data.data.result[i].rows[0].number;
                data.data.result[i].line = data.data.result[i].rows[0].line;
                data.data.result[i].groundNumber = data.data.result[i].rows[0].groundNumber;

                continue;
            }

            for (var j = 0; j < rows.length; j++) {
                number.push(rows[j].number);
                line.push(rows[j].line);
                ground.push(rows[j].groundNumber);
            }

            data.data.result[i].number = number.join('<br>');
            data.data.result[i].line = line.join('<br>');
            data.data.result[i].groundNumber = ground.join('<br>');
        }

        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        html += kernel.getServiceContainer().get('view.table').buildTemplate(data);
        html += '</div>';

        return html;
    }
}
function MeterDictionaryView() {
    AbstractDictionaryView.call(this);
}
function ServiceDictionaryView() {
    AbstractDictionaryView.call(this);
}
function ConsumerCardView() {
    AbstractCardView.call(this);
    this.template = '<div class="sheet"><ul><button class="save_button"></button><button class="cancel_button"></button></ul><ul class="card_row"><li class="card_cell">{SURNAME_LANG}<input name="surname" value="{surname}"></li><li class="card_cell">{NAME_LANG}<input name="name" value="{name}"></li></ul><ul class="card_row"><li class="card_cell">{NAME2_LANG}<input name="name2" value="{name2}"></li><li class="card_cell">{PHONE_LANG}<input name="phone" value="{phone}"></li></ul><ul class="card_row"><li class="card_cell_full">{ADRESS_LANG}<input name="adress" value="{adress}" size="100"></li></ul><div class="table_ground"></div></div>';
}
function GroundCardView() {
    AbstractCardView.call(this);
    this.template = '<div class="sheet"><ul><button class="save_button"></button><button class="cancel_button"></button></ul><ul class="card_row"><li class="card_cell">{ACCOUNT_NUMBER_LANG}<input name="accNumber" value="{accNumber}"></li><!--<li class="card_cell">{NUMBER_LANG}<input name="number" value="{number}"></li>--></ul><ul class="card_row"><div class="table"><ul class="table_head"><li class="column_head">{NUMBER_LANG}</li><li class="column_head">{GROUND_LINE_LANG}</li><li class="column_head">{GROUND_NUMBER_LANG}</li></ul><ul class="table_row"><li><input type="hidden" name="id1" value="{id1}"><input name="number1" value="{number1}"></li><li><input name="line1" value="{line1}"></li><li><input name="line_number1" value="{groundNumber1}"></li></ul><ul class="table_row"><li><input type="hidden" name="id2" value="{id2}"><input name="number2" value="{number2}"></li><li><input name="line2" value="{line2}"></li><li><input name="line_number2" value="{groundNumber2}"></li></ul><ul class="table_row"><li><input type="hidden" name="id3" value="{id3}"><input name="number3" value="{number3}"></li><li><input name="line3" value="{line3}"></li><li><input name="line_number3" value="{groundNumber3}"></li></ul><ul class="table_row"><li><input type="hidden" name="id4" value="{id4}"><input name="number4" value="{number4}"></li><li><input name="line4" value="{line4}"></li><li><input name="line_number4" value="{groundNumber4}"></li></ul><ul class="table_row"><li><input type="hidden" name="id5" value="{id5}"><input name="number5" value="{number5}"></li><li><input name="line5" value="{line5}"></li><li><input name="line_number5" value="{groundNumber5}"></li></ul></div><!--<li class="card_cell">{GROUND_LINE_LANG}<input name="line" value="{line}"></li><li class="card_cell">{GROUND_NUMBER_LANG}<input name="groundNumber" value="{groundNumber}"></li>--></ul><ul class="card_row"><li class="card_cell">{GROUND_AREA_LANG}<input name="area" value="{area}"></li><li class="card_cell">{GROUND_FREE_AREA_LANG}<input name="freeArea" value="{freeArea}"></li></ul><ul class="card_row"><li class="card_cell">{GROUND_COMMON_AREA_LANG}<input name="commonArea" value="{commonArea}"></li><li class="card_cell">{GROUND_ALL_AREA_LANG}<input name="allArea" value="{allArea}" disabled></li></ul><ul class="card_row"><li class="card_cell">{OWNER_FULL_NAME_LANG}<div class="selectbox" tabindex="-1"><input name="owner" data-id="{kontragentId}" data-type="kontragent" value="{owner}"><p class="selectbox-list-hide"></p></div></li></ul></div>';
}
function MeterCardView() {
    AbstractCardView.call(this);
    this.template = '<div class="sheet"><ul><button class="save_button"></button><button class="cancel_button"></button></ul><ul class="card_row"><li class="card_cell">{METER_NUMBER_LANG}<input name="number" value="{number}"></li><li class="card_cell">{METER_TYPE_LANG}<select name="type">{type}</select></li></ul><ul class="card_row"><li class="card_cell">{METER_GROUND_OWNER_LANG}<div class="selectbox" tabindex="-1"><input name="ground" data-id="{groundId}" data-type="ground" value="{ground}" size="45"><p class="selectbox-list-hide"></p></div></li></ul></div>';

    this.buildTemplate = function (data) {
        var container = kernel.getServiceContainer().get('container.collection');
        data['type'] = container.getDataForSelect('meterTypes', data['type']);
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        html += this.addData(this.template, data) + '</div>';

        return html;
    };
}
function ServiceCardView() {
    AbstractCardView.call(this);
    this.template = '<div class="sheet"><ul><button class="save_button"></button><button class="cancel_button"></button></ul><ul class="card_row"><li class="card_cell">{SERVICE_NAME_LANG}<input name="name" value="{name}"></li><li class="card_cell">{SERVICE_TYPE_LANG}<select name="type">{type}</select></li></ul><ul class="card_row"><li class="card_cell">{SERVICE_CALC_TYPE_BASE_LANG}<select name="subtype">{subtype}</select></li><li class="card_cell">{SERVICE_PERIOD_TYPE_LANG}<select name="periodType">{periodType}</select></li></ul></div>';

    this.buildTemplate = function (data) {
        var container = kernel.getServiceContainer().get('container.collection');
        data['type'] = container.getDataForSelect('serviceTypes', data['type']);
        data['subtype'] = container.getDataForSelect('serviceSubtypes', data['subtype']);
        data['periodType'] = container.getDataForSelect('servicePeriodTypes', data['periodType']);
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        html += this.addData(this.template, data) + '</div>';

        return html;
    };
}
function MeterDocumentView() {
    AbstractDocumentView.call(this);
    this.template = '<div class="sheet"><ul><button class="save_button"></button><button class="cancel_button"></button></ul><ul class="card_row"><li class="card_cell">{DOCUMENT_DATE_LANG}<input type="date" name="date" value="{date}"></li></ul><ul class="card_row"><div class="table subtable"><ul class="button_panel"><button class="add_row_button"></button><button class="delete_row_button"></button></ul>{table}</div></ul></div>';
    this.rowTemplate = '<ul class="table_row" data-id="{id}"><li><input type="checkbox" name="checker"></li><li><div class="selectbox" tabindex="-1"><input name="meter" data-id="{meterId}" data-type="meterDocument" value="{meter}" size="70"><p class="selectbox-list-hide"></p></div></li><li><input name="startValue" value="{startValue}" disabled></li><li><input name="endValue" value="{endValue}"></li></ul>';
    this.headTemplate = '<ul class="table_head"><li class="column_head"></li><li class="column_head" data-name="meter">{METER_NAME_LANG}</li><li class="column_head" data-name="startValue">{START_VALUE_LANG}</li><li class="column_head" data-name="endValue">{END_VALUE_LANG}</li></ul>';
}
function MeterServiceDocumentView() {
    AbstractDocumentView.call(this);
    this.template = '<div class="sheet"><ul><button class="save_button"></button><button class="cancel_button"></button></ul><ul class="card_row"><li class="card_cell">{DOCUMENT_DATE_LANG}<input type="date" name="date" value="{date}"></li><li class="card_cell">{KONTRAGENT_ID_LANG}<div class="selectbox" tabindex="-1"><input name="ground" data-id="{groundId}" data-type="ground" value="{ground}"><p class="selectbox-list-hide"></p></div></li></ul><ul class="card_row"><div class="table subtable"><ul class="button_panel"><button class="add_row_button"></button><button class="delete_row_button"></button><button class="autoset_button"></button></ul>{table}</div></ul></div>';
    this.rowTemplate = '<ul class="table_row" data-id="{id}"><li><input type="checkbox" name="checker"></li><li><div class="selectbox indexData" tabindex="-1"><input name="service" data-id="{serviceId}" data-type="service" value="{service}"><p class="selectbox-list-hide"></p></div></li><li><select class="indexData" data-id="{meterId}" name="meterId">{meterList}</select></li><li><input class="indexData" type="date" name="date" value="{date}"></li><li><input name="startData" value="{startData}" disabled></li><li><input name="endData" value="{endData}" disabled></li><li><input name="price" value="{price}" disabled></li><li><input name="sum" value="{sum}" disabled></li></ul>';
    this.headTemplate = '<ul class="table_head"><li class="column_head"></li><li class="column_head" data-name="service">{SERVICE_NAME_LANG}</li><li class="column_head" data-name="meter">{METER_NUMBER_LANG}</li><li class="column_head" data-name="date">{PERIOD_LANG}</li><li class="column_head" data-name="startData">{START_VALUE_LANG}</li><li class="column_head" data-name="endData">{END_VALUE_LANG}</li><li class="column_head" data-name="price">{TARIF_LANG}</li><li class="column_head" data-name="sum">{SUM_LANG}</li></ul>';
}
function PayDocumentView() {
    AbstractDocumentView.call(this);
    this.template = '<div class="sheet"><ul><button class="save_button"></button><button class="cancel_button"></button></ul><ul class="card_row"><li class="card_cell">{DOCUMENT_DATE_LANG}<input type="date" name="date" value="{date}"></li><li class="card_cell">{OWNER_FULL_NAME_LANG}<div class="selectbox" tabindex="-1"><input name="kontragent" data-id="{kontragentId}" data-type="kontragent" value="{kontragent}"><p class="selectbox-list-hide"></p></div></li></ul><ul class="card_row"><div class="table subtable">{table}</div></ul></div>';
    this.rowTemplate = '<ul class="table_row" data-id="{id}"><li><input type="checkbox" name="checker"></li><li><input name="ground" data-id="{groundId}" value="{ground}" disabled></li><li><input name="service" data-id="{serviceId}" value="{service}" disabled></li><li><input name="dolg" value="{dolg}" disabled></li><li><input name="sum" value="{sum}"></li></ul>';
    this.headTemplate = '<ul class="table_head"><li class="column_head"></li><li class="column_head" data-name="ground">{KONTRAGENT_ID_LANG}</li><li class="column_head" data-name="service">{SERVICE_NAME_LANG}</li><li class="column_head" data-name="dolg">{DOLG_LANG}</li><li class="column_head" data-name="sum">{SUM_LANG}</li></ul>';
}
function ServiceDocumentView() {
    AbstractDocumentView.call(this);
    this.template = '<div class="sheet"><ul><button class="save_button"></button><button class="cancel_button"></button></ul><ul class="card_row"><li class="card_cell">{DOCUMENT_DATE_LANG}<input type="date" name="date" value="{date}"></li><li class="card_cell">{OWNER_FULL_NAME_LANG}<div class="selectbox" tabindex="-1"><input name="kontragent" data-id="{kontragentId}" data-type="kontragent" value="{kontragent}"><p class="selectbox-list-hide"></p></div></li></ul><ul class="card_row"><div class="table subtable"><ul class="button_panel"><button class="add_row_button"></button><button class="delete_row_button"></button><button class="autoset_button"></button></ul>{table}</div></ul></div>';
    this.rowTemplate = '<ul class="table_row" data-id="{id}"><li><input type="checkbox" name="checker"></li><li><div class="selectbox indexData" tabindex="-1"><input name="service" data-id="{serviceId}" data-type="service" value="{service}"><p class="selectbox-list-hide"></p></div></li><li><select data-id="{groundId}" name="groundId">{groundList}</select></li><li><input class="indexData" type="date" name="date" value="{date}"></li><li><input name="calcBase" value="{count}" disabled></li><li><input name="price" value="{price}" disabled></li><li><input name="sum" value="{sum}" disabled></li></ul>';
    this.headTemplate = '<ul class="table_head"><li class="column_head"></li><li class="column_head" data-name="service">{SERVICE_NAME_LANG}</li><li class="column_head" data-name="ground">{KONTRAGENT_ID_LANG}</li><li class="column_head" data-name="date">{PERIOD_LANG}</li><li class="column_head" data-name="count">{SERVICE_CALC_BASE_LANG}</li><li class="column_head" data-name="price">{TARIF_LANG}</li><li class="column_head" data-name="sum">{SUM_LANG}</li></ul>';
}
function TarifsDocumentView() {
    AbstractDocumentView.call(this);
    this.template = '<div class="sheet"><ul><button class="save_button"></button><button class="cancel_button"></button></ul><ul class="card_row"><li class="card_cell">{TARIFS_DATE_START_LANG}<input type="date" name="dateStart" value="{dateStart}"></li></ul><ul class="card_row"><div class="table subtable"><ul class="button_panel"><button class="add_row_button"></button><button class="delete_row_button"></button></ul>{table}</div></ul></div>';
    this.rowTemplate = '<ul class="table_row" data-id="{id}"><li><input type="checkbox" name="checker"></li><li><div class="selectbox" tabindex="-1"><input name="serviceId" data-id="{serviceId}" data-type="service" value="{service}"><p class="selectbox-list-hide"></p></div></li><li><input name="price" value="{price}"></li></ul>';
    this.headTemplate = '<ul class="table_head"><li class="column_head"></li><li class="column_head" data-name="serviceId">{SERVICE_NAME_LANG}</li><li class="column_head" data-name="price">{TARIF_LANG}</li></ul>';
}
function MeterServiceDocumentsView() {
    AbstractDocumentsView.call(this);

    this.buildTemplate = function (data) {
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();

        var urlHelper = kernel.getServiceContainer().get('helper.url');
        for (var key in data.data.result) {
            data.data.result[key].doc = '<a href="' + urlHelper.getDomain(window.location.href) + '/report/meter_invoice.html?id=' + data.data.result[key].id + '">' + data.columns.doc + '</a>';
        }
        html += kernel.getServiceContainer().get('view.table').buildTemplate(data);
        html += '</div>';

        return html;
    };
}
function MetersDocumentsView() {
    AbstractDocumentsView.call(this);
}
function PayDocumentsView() {
    AbstractDocumentsView.call(this);
}
function ServiceDocumentsView() {
    AbstractDocumentsView.call(this);

    this.buildTemplate = function (data) {
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();

        var urlHelper = kernel.getServiceContainer().get('helper.url');
        for (var key in data.data.result) {
            data.data.result[key].doc = '<a href="' + urlHelper.getDomain(window.location.href) + '/report/invoice.html?id=' + data.data.result[key].id + '">' + data.columns.doc + '</a>';
            data.data.result[key].docSoc = '<a href="' + urlHelper.getDomain(window.location.href) + '/report/social_invoice.html?id=' + data.data.result[key].id + '">' + data.columns.docSoc + '</a>';
        }
        html += kernel.getServiceContainer().get('view.table').buildTemplate(data);
        html += '</div>';

        return html;
    };
}
function TarifsDocumentsView() {
    AbstractDocumentsView.call(this);
}
function LoginView() {
    AbstractView.call(this);
    this.template = '<table align="center" style="padding-top: 100px;"><tr><td><table><tr><td>Имя пользователя</td><td><input name="login"></td></tr><tr><td>Пароль</td><td><input type="password" name="password"></td></tr></table></td></tr><tr class="login_error"><td>Ввведна неверная комбинация имени и пароля</td></tr><tr><td><center><button class="login_button">Вход</button></center></td></tr></table>';

    this.buildTemplate = function () {
        return this.template;
    };
}
function MainView() {
    AbstractView.call(this);
    this.template = '<div class="noprint"><ul class="menu"><li class="menu_element"><p>Справочники</p><ul class="submenu"><li class="submenu_element consumer_dictionary_button"><p>Потребители</p></li><li class="submenu_element ground_dictionary_button"><p>Участки</p></li><li class="submenu_element meters_dictionary_button"><p>Счетчики</p></li><li class="submenu_element services_dictionary_button"><p>Усуги</p></li></ul></li><li class="menu_element"><p>Документы</p><ul class="submenu"><li class="submenu_element pay_documents_button"><p>Оплаты</p></li><li class="submenu_element service_documents_button"><p>Начисления услуг</p></li><li class="submenu_element service_meter_documents_button"><p>Начисления услуг по счетчикам</p></li><li class="submenu_element meters_documents_button"><p>Показания счетчиков</p></li><li class="submenu_element tarifs_documents_button"><p>Тарифы</p></li></ul></li><li class="menu_element"><p>Отчеты</p><ul class="submenu"><li class="submenu_element main_report_button"><p>Основной отчет</p></li><li class="submenu_element meters_report_button"><p>Отчет по счетчикам</p></li><li class="submenu_element balance_report_button"><p>Баланс расчетов</p></li><li class="submenu_element sms_report_button"><p>Отчет о смс</p></li><li class="submenu_element invoice_report_button"><p>Квитанции</p></li><li class="submenu_element meter_invoice_report_button"><p>Квитанции по счетчикам</p></li><li class="submenu_element social_invoice_report_button"><p>Квитанции по общественным платежам</p></li></ul></li></ul></div>';

    this.buildTemplate = function () {
        return this.template;
    };
}
function BalanceReportView() {
    AbstractCardView.call(this);

    this.buildTemplate = function (data) {
        data = data.result;
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        var dateStart = kernel.getServiceContainer().get('helper.date').getDateFormatInput(data.additionalInfo.dateStart.date);
        var dateEnd = kernel.getServiceContainer().get('helper.date').getDateFormatInput(data.additionalInfo.dateEnd.date);
        html += '<div class="reportSheet"><li><ul><table><tr><td class="noprint">Пероид с <input type="date" name="dateStart" value="';
        html += dateStart + '"> по <input type="date" name="dateEnd" value="';
        html += dateEnd + '">&nbsp;&nbsp;<button class="submit">Сформировать</button></td></tr><tr><td><table border="1" cellspacing="0"><tr>';

        var columns = ['№', 'ФИО', 'Л/с', 'Услуга', 'На начало периода', 'Начисленнло', 'Оплаченно', 'На конец периода'];

        for (i = 0; i < columns.length; i++) {
            html += '<td class="head1">' + columns[i] + '</td>'
        }

        html += '</tr>';

        html += this.showRows(data.result);

        html += '</table></td></tr>';
        html += '</table></div>';

        return html;
    };

    this.showRows = function (data) {
        result = '';

        var rowInfo = {};
        var elements = [];
        var i = 1;
        for (var fio in data) {
            rowInfo = this.getRowInfo(data[fio]);
            elements['fio'] = '<td rowspan="' + rowInfo.count + '">' + i + '</td><td rowspan="' + rowInfo.count + '">' + fio + '</td>';
            for (var account in data[fio]) {
                elements['account'] = '<td rowspan="' + rowInfo.data[account].count + '">' + account + '</td>';
                for (var service in data[fio][account]) {
                    result += '<tr>' + elements['fio'] + elements['account'];
                    result += '<td>' + service + '</td><td>' + data[fio][account][service]['startData'] + '</td><td>' + data[fio][account][service]['out'] + '</td><td>' + data[fio][account][service]['in'] + '</td><td>' + data[fio][account][service]['endData'] + '</td></tr>';

                    elements['fio'] = '';
                    elements['account'] = '';
                    i++;
                }
            }
        }

        return result;
    };

    this.getRowInfo = function (data) {
        var result = {count: 0, data: []};

        for (var account in data) {
            result.data[account] = {count: 0, data: []};
            for (var service in data[account]) {
                result.data[account].count++;
                result.count++;
            }
        }

        return result;
    };
}
function InvoiceReportView() {
    AbstractCardView.call(this);

    this.buildTemplate = function (data) {
        data = data.result;
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        var id = 1;
        if (data.id === undefined) {
            alert('Квитанция с таким номером не найдена');
        } else {
            id = data.id;
        }

        html += '<div class="reportSheet"><li><ul><table><tr><td class="noprint">Номер квитанции&nbsp;<input name="id" value="';
        html += id + '">&nbsp;&nbsp;<button class="submit">Сформировать</button></td></tr>';

        if (data.id === undefined) {
            html += '</table></div>';

            return html;
        }

        html += '<tr><td><table border="1" cellspacing="0">';

        html += '</table></td></tr>';
        html += '</table></div>';

        return html;
    }
}
function MainReportView() {
    AbstractCardView.call(this);

    this.buildTemplate = function (data) {
        data = data.result;
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        var dateStart = kernel.getServiceContainer().get('helper.date').getDateFormatInput(data.additionalInfo.dateStart.date);
        var dateEnd = kernel.getServiceContainer().get('helper.date').getDateFormatInput(data.additionalInfo.dateEnd.date);
        html += '<div class="reportSheet"><li><ul><table><tr><td class="noprint">Пероид с <input type="date" name="dateStart" value="';
        html += dateStart + '"> по <input type="date" name="dateEnd" value="';
        html += dateEnd + '">&nbsp;&nbsp;<button class="submit">Сформировать</button></td></tr><tr><td><table border="1" cellspacing="0">';

        var columns = ['№', 'ФИО', 'Л/с', '№ кур', 'Ряд', 'Место', 'Площадь', 'Не относится к земле причала', 'Площадь общего пользования', 'Всего площадь'];
        var payColumns = [];

        for (var key in data.services) {
            columns.push(data.services[key]);
            payColumns.push(key);
        }

        var head = [{name: '', cols: 2}, {name: 'Адрес:', cols: 4}, {name: 'Площадь:', cols: 4}, {name: 'Платежи:', cols: columns.length - 10}];

        html += this.showColumns(head, columns);

        html += this.showData(data.result, payColumns);

        html += '</table></td></tr>';
        html += this.showCalcTables();
        html += this.showNames();
        html += '</table></div>';

        return html;
    };

    this.showCalcTables = function () {
        var result = '<tr><td align="center"><table border="1" cellspacing="0"><tr><td colspan="3" class="head1">Расчет платы за землю</td></tr>';
        result += '<tr><td class="head1">Сумма аренды</td><td class="head1">Общая площадь</td><td class="head1">Цена за 1м.кв.</td></tr>';
        result += '<tr><td class="head1">433405.44</td><td class="head1">33942</td><td class="head1">12.769</td></tr></table></td></tr>';

        result += '<tr><td align="center"><table border="1" cellspacing="0"><tr><td colspan="5" class="head1">Расчет коэффициента для взноса на содержание причала</td></tr>';
        result += '<tr><td class="head1" colspan="2">Занимаемая площадь</td><td class="head1"></td><td class="head1" rowspan="2">Сумма взноса на<br>содерж. причала</td><td class="head1" rowspan="2">Коэффициент</td></tr>';
        result += '<tr><td class="head1">наша</td><td class="head1">порт</td><td class="head1">всего</td></tr>';
        result += '<tr><td class="head1">23742</td><td class="head1">980.2</td><td class="head1">24722.2</td><td class="head1">999086</td><td class="head1">40.4125</td></tr></table></td></tr>';

        return result;
    };

    this.showNames = function () {
        var result = '<tr style="height: 50px"><td></td></tr><tr><td><table width="100%">';
        result += '<tr><td width="50%">Начальник причала №114 "Бугово"</td><td>А. В. Григоращенко</td></tr>';
        result += '<tr><td width="50%">Зам. начальник причала №114 "Бугово"</td><td>В. В. Белашевский</td></tr>';
        result += '<tr><td width="50%">Кассир причала №114 "Бугово"</td><td>Н. М. Артемьева</td></tr>';
        result += '<tr><td width="50%">Главный бухгалтер ОО "ВМСООРЛ"</td><td>В. В. Обозовская</td></tr>';
        result += '</table></td></tr>';

        return result;
    };

    this.showColumns = function (heads, columns) {
        var result = '<tr>';

        for (var i = 0; i < heads.length; i++) {
            if (heads[i].cols) {
                result += '<td colspan="' + heads[i].cols + '" class="head1">' + heads[i].name + '</td>';
            }
        }

        result += '</tr><tr>';

        for (var i = 0; i < columns.length; i++) {
            result += '<td>' + columns[i] + '</td>';
        }

        result += '</tr>';

        return result;
    };

    this.showData = function (reportData, payColumns) {
        var result = '';
        var j = 0;
        var n = 0;
        var cell = '';

        var tag = '';
        for (var i = 0; i < reportData.length; i++) {
            if (reportData[i].house.length > 1) {
                tag = '<td rowspan="' + reportData[i].house.length + '">';
            } else {
                tag = '<td>';
            }

            result += '<tr>' + tag + (i + 1) + '</td>' + tag + reportData[i].kontragent + '</td><' + tag + reportData[i].account + '</td>';
            result += '<td>' + reportData[i].house[0].number + '</td><td>' + reportData[i].house[0].line + '</td><td>' + reportData[i].house[0].groundNumber + '</td>';
            result += tag + reportData[i].area + '</td>' + tag + reportData[i].freeArea + '</td>' + tag + reportData[i].commonArea + '</td>' + tag + reportData[i].allArea + '</td>';

            for (j = 0; j < payColumns.length; j++) {
                cell = tag + '0.00</td>';
                for (n = 0; n < reportData[i].services.length; n++) {
                    if (payColumns[j] == reportData[i].services[n].id) {
                        cell = tag + reportData[i].services[n].sum + '</td>';

                        break;
                    }
                }

                result += cell;
            }

            if (reportData[i].house.length > 1) {
                for (j = 1; j < reportData[i].house.length; j++) {
                    result += '</tr><tr><td>' + reportData[i].house[j].number + '</td><td>' + reportData[i].house[j].line + '</td><td>' + reportData[i].house[j].groundNumber + '</td>';
                }
            }

            result += '</tr>'
        }

        return result;
    }
}
function MeterInvoiceReportView() {
    AbstractCardView.call(this);

    this.buildTemplate = function (data) {
        data = data.result;
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        var id = 1;
        if (data.id === undefined) {
            alert('Квитанция с таким номером не найдена');
        } else {
            id = data.id;
        }

        html += '<div class="reportSheet"><li><ul><table><tr><td class="noprint">Номер квитанции&nbsp;<input name="id" value="';
        html += id + '">&nbsp;&nbsp;<button class="submit">Сформировать</button></td></tr>';

        if (data.id === undefined) {
            html += '</table></div>';

            return html;
        }

        html += '<tr><td><table border="1" cellspacing="0">';

        html += '</table></td></tr>';
        html += '</table></div>';

        return html;
    }
}
function MetersReportView() {
    AbstractCardView.call(this);

    this.buildTemplate = function (data) {
        data = data.result;
        var i = 0;
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        var dateStart = kernel.getServiceContainer().get('helper.date').getDateFormatInput(data.additionalInfo.dateStart.date);
        var dateEnd = kernel.getServiceContainer().get('helper.date').getDateFormatInput(data.additionalInfo.dateEnd.date);
        html += '<div class="reportSheet"><li><ul><table><tr><td class="noprint">Пероид с <input type="date" name="dateStart" value="';
        html += dateStart + '"> по <input type="date" name="dateEnd" value="';
        html += dateEnd + '">&nbsp;&nbsp;<button class="submit">Сформировать</button></td></tr><tr><td><table border="1" cellspacing="0"><tr>';

        var columns = ['№', 'ФИО', 'Л/с', 'Тип', 'Номер', 'На начало периода', 'На конец периода']

        for (i = 0; i < columns.length; i++) {
            html += '<td class="head1">' + columns[i] + '</td>'
        }

        html += '</tr>';

        html += this.showRows(data.result);

        html += '</table></td></tr>';
        html += '</table></div>';

        return html;
    };

    this.showRows = function (data) {
        result = '';

        var rowInfo = {};
        var elements = [];
        var i = 1;
        for (var fio in data) {
            rowInfo = this.getRowInfo(data[fio]);
            elements['fio'] = '<td rowspan="' + rowInfo.count + '">' + i + '</td><td rowspan="' + rowInfo.count + '">' + fio + '</td>';
            for (var account in data[fio]) {
                elements['account'] = '<td rowspan="' + rowInfo.data[account].count + '">' + account + '</td>';
                for (var type in data[fio][account]) {
                    elements['type'] = '<td rowspan="' + rowInfo.data[account].data[type].count + '">' + type + '</td>';
                    for (var number in data[fio][account][type]) {
                        result += '<tr>' + elements['fio'] + elements['account'] + elements['type'];
                        result += '<td>' + number + '</td><td>' + data[fio][account][type][number]['dataStart'] + '</td><td>' + data[fio][account][type][number]['dataEnd'] + '</td></tr>';

                        elements['fio'] = '';
                        elements['account'] = '';
                        elements['type'] = '';
                        i++;
                    }
                }
            }
        }

        return result;
    };

    this.getRowInfo = function (data) {
        var result = {count: 0, data: []};

        for (var account in data) {
            result.data[account] = {count: 0, data: []};
            for (var type in data[account]) {
                result.data[account].data[type] = {count: 0, data: []};
                for (var number in data[account][type]) {
                    result.data[account].data[type].count++;
                    result.data[account].count++;
                    result.count++;
                }
            }
        }

        return result;
    };
}
function SmsReportView() {
    
}
function SocialInvoiceReportView() {
    AbstractCardView.call(this);

    this.buildTemplate = function (data) {
        data = data.result;
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        var id = 1;
        if (data.id === undefined) {
            alert('Квитанция с таким номером не найдена');
        } else {
            id = data.id;
        }

        html += '<div class="reportSheet"><li><ul><table><tr><td class="noprint">Номер квитанции&nbsp;<input name="id" value="';
        html += id + '">&nbsp;&nbsp;<button class="submit">Сформировать</button></td></tr>';

        if (data.id === undefined) {
            html += '</table></div>';

            return html;
        }

        html += '<tr><td><table border="1" cellspacing="0">';

        html += '</table></td></tr>';
        html += '</table></div>';

        return html;
    }
}
function TableHeadView() {
    this.template = [
        '<ul class="table_head">',
        '<li class="column_head" data-name="{name}">',
        '<li class="column_head" data-name="{name}"><img class="order_image" src="/img/downarrow.png">',
        '<li class="column_head" data-name="{name}"><img class="order_image" src="/img/uparrow.png">',
        '</li>',
        '</ul>'
    ];

    this.buildTemplate = function (data, orderBy, orderType) {
        var html = this.template[0];
        var template = '';

        for (var key in data) {
            if (key === orderBy) {
                template = orderType === 'asc' ? this.template[2] : this.template[3];
            } else {
                template = this.template[1];
            }

            html += template.replace('{name}', key) + data[key] + this.template[4];
        }

        html += this.template[5];

        return html;
    };
}
function TablePaginatorView() {
    this.buildTemplate = function (data) {
        if (data.pageCount < 2 || data.pageCount === undefined) {
            return '';
        }

        var startPage = data.page - 2 > 0 ? data.page - 2 : 1;
        var endPage = startPage + 5 <= data.pageCount ? startPage + 5 : data.pageCount;
        var result = '<ul>';

        if (data.page != 1) {
            result += '<button class="paginator-button" data-page="1">&lt;&lt;</button>';
            result += '<button class="paginator-button" data-page="' + (data.page - 1) + '">&lt;</button>';
        }
        for (var i = startPage; i <= endPage; i++) {
            result += '<button class="paginator-button' + (data.page == i ? ' active' : '') + '" data-page="' + i + '">' + i + '</button>';
        }
        if (data.page != data.pageCount) {
            result += '<button class="paginator-button" data-page="' + (data.page + 1) + '">&gt;</button>';
            result += '<button class="paginator-button" data-page="' + data.pageCount + '">&gt;&gt;</button>';
        }

        result += '</ul>';

        return result;
    };
}

function TableRowView() {
    this.template = [
        '<ul class="table_row" data-id="{id}">',
        '<li>',
        '</li>',
        '</ul>'
    ];

    this.buildTemplate = function (data, order) {
        var html = this.template[0].replace('{id}', data.id);

        for (var i = 0; i < order.length; i++) {
            html += this.template[1] + data[order[i]] + this.template[2];
        }

        html += this.template[3];

        return html;
    };
}
function TableView() {
    this.template = [
        '<div class="sheet"><li>',
        '',
        '<ul><button class="add_button"></button><button class="edit_button"></button><button class="delete_button"></button></ul>',
        '<ul><div class="table">',
        '</div></ul>',
        '</li><div>'
    ];

    this.buildTemplate = function (data) {
        var html = data.isSubview === undefined || data.isSubview === false ? this.template[0] : this.template[1];

        if (data.filters) {
            html += this.showFilters(data.filters);
        }

        if (data.hideButtons === undefined || data.hideButtons === false) {
            html += this.template[2];
        }

        html += this.template[3];
        html += kernel.getServiceContainer().get('view.tableHead').buildTemplate(data.columns, data.orderBy, data.orderType);

        for (var i = 0; i < data.data.result.length; i++) {
            html += kernel.getServiceContainer().get('view.tableRow').buildTemplate(data.data.result[i], Object.keys(data.columns));
        }

        html += this.template[4];

        html += kernel.getServiceContainer().get('view.tablePaginator').buildTemplate(data.data) + this.template[5];

        return html;
    };

    this.showFilters = function (filterList) {
        if (!Object.keys(filterList).length) {
            return '';
        }

        var result = '';
        for (key in filterList) {
            if (filterList[key].type == 'period') {
                if (!filterList[key].valueStart || !filterList[key].valueEnd) {
                    var date = new Date();
                    var dateHelper = kernel.getServiceContainer().get('helper.date');
                }
                
                var dateStart = filterList[key].periodStart ? filterList[key].periodStart : dateHelper.getFirstDayOfMonth(date);
                var dateEnd = filterList[key].periodEnd ? filterList[key].periodEnd : dateHelper.getLastDayOfMonth(date);
                result += '<ul>' + filterList[key].name + '&nbsp;<input type="date" name="' + key + 'Start" value="' + dateStart + '">&nbsp;<input type="date" name="' + key + 'End" value="' + dateEnd + '"></ul>';
            } else {
                result += '<ul>' + filterList[key].name + '&nbsp;<input name="' + key + '" value="' + filterList[key].value + '"></ul>';
            }
        }

        result += '<ul><button class="filter_button">Фильтровать</button>&nbsp;<button class="clear_filter_button">Очистить</button></ul>'

        return result;
    }
}
function AbstractCardView() {
    AbstractView.call(this);

    this.buildTemplate = function (data) {
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        html += this.addData(this.template, data) + '</div>';

        return html;
    };

    this.addData = function (template, data) {
        for (var key in data) {
            template = template.replace('{' + key + '}', data[key]);
        }

        template = this.addLangs(template);

        return template;
    };

    this.addLangs = function (template) {
        var matches = template.match(/{.*?}/g);

        if (!matches || !matches.length) {
            return template;
        }

        var key = '';
        for (var i = 0; i < matches.length; i++) {
            key = matches[i].replace('{', '').replace('}', '');
            if (/_LANG/.test(key)) {
                template = template.replace(matches[i], window[key] === undefined ? key : window[key]);
            } else {
                template = template.replace(matches[i], '');
            }
        }

        return template;
    };
}
function AbstractDictionaryView() {
    AbstractView.call(this);

    this.buildTemplate = function (data) {
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        html += kernel.getServiceContainer().get('view.table').buildTemplate(data);
        html += '</div>';

        return html;
    };
}
function AbstractDocumentView() {
    AbstractCardView.call(this);
    this.rowTemplate = '';
    this.headTemplate = '';

    this.buildTemplate = function (data) {
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();

        data.table = this.generateTable(data);
        html += this.addData(this.template, data) + '</div>';

        return html;
    };

    this.generateTable = function (data) {
        var result = '';
        result += this.addData(this.headTemplate, data);

        if (data.rows) {
            for (var i = 0; i < data.rows.length; i++) {
                result += this.addData(this.rowTemplate, data.rows[i]);
            }
        }

        return result;
    };
}

function AbstractDocumentsView() {
    AbstractDictionaryView.call(this);
}

function AbstractView() {
    this.template = '';

    this.render = function (data) {
        this.clear();
        var html = this.buildTemplate(data);
        $('body').append(html);
    };

    this.clear = function () {
        var body = $('body')[0];
        body.removeChild(body.lastChild);
    }
}
