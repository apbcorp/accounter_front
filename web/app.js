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
            result += '<option value="' + key + '"' + (key == id ? ' selected' : '') + '>' + collection.data[key] + '</option>'
        }

        return result;
    };

    this.getDataBySupply = function (collectionName, searchString, event) {
        this.event = event;
        var name = collectionName + 'SupplyCollection';
        this.thisCollection = this.data[name];
        this.thisCollection.data = {};
        var requester = kernel.getServiceContainer().get('requester.ajax');
        requester.setUrl(this.thisCollection.url);
        requester.setData({search: searchString});
        requester.setMethod(HTTP_METHOD_GET);
        requester.setSuccess(this.onGetDataSuccess.bind(this));
        requester.request();
    };

    this.onGetDataSuccess = function (data) {
        var staticCollection = this.data[this.thisCollection.staticCollection];

        for (var i = 0; i < data.result.length; i++) {
            this.thisCollection.data[data.result[i].id] = data.result[i].name;
            staticCollection.data[data.result[i].id] = data.result[i].name;
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

        collection.data[id] = value;
    }
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
function GroundCardController() {
    AbstractCardController.call(this);
    this.model = new GroundCardModel(this);
    this.viewName = 'view.groundCard';
    this.backUrl = '/dictionary/grounds.html';

    this.GroundCardController = function () {
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

        this.model.appendDataToRequest(data);
    };

    this.GroundCardController();
}
function MeterCardController() {
    AbstractCardController.call(this);
    this.model = new MeterCardModel(this);
    this.viewName = 'view.meterCard';
    this.backUrl = '/dictionary/meters.html';

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

        this.model.appendDataToRequest(data);
    };

    this.MeterCardController();
}
function ServiceCardController() {
    AbstractCardController.call(this);
    this.model = new ServiceCardModel(this);
    this.viewName = 'view.serviceCard';
    this.backUrl = '/dictionary/services.html';

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
            subtype: $('[name="subtype"]')[0].value
        };

        this.model.appendDataToRequest(data);
    };

    this.ServiceCardController();
}
function AccurringDocumentsController() {
    AbstractDocumentsController.call(this);
}
function MetersDocumentsController() {
    AbstractDocumentsController.call(this);
}
function PayDocumentsController() {
    AbstractDocumentsController.call(this);
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
}
function MainReportController() {
    AbstractReportController.call(this);
}
function MetersReportController() {
    AbstractReportController.call(this);
}
function SmsReportController() {
    AbstractReportController.call(this);
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

        if (this.model.recordId != 0) {
            for (var key in this.submodels) {
                this.submodels[key].refresh();
            }
        }
    };

    this.onSave = function () {
        this.fillModel();
        this.model.save();
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

        this.events.push({'selector': '.add_button', 'action': 'click', 'event': this.onAddRecordEvent});
        this.events.push({'selector': '.edit_button', 'action': 'click', 'event': this.onEditRecordEvent});
        this.events.push({'selector': '.delete_button', 'action': 'click', 'event': this.onDeleteRecordEvent});
        this.events.push({'selector': '.table_row', 'action': 'click', 'event': this.onSelectRecordEvent});
        this.events.push({'selector': '.table_row', 'action': 'dblclick', 'event': this.onEditRecordEvent});
        this.events.push({'selector': '.column_head', 'action': 'click', 'event': this.onSortRecordsEvent});


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
        if (event.currentTarget.class == 'table_row') {
            this.onSelectRecord(event);
        }

        if (this.model.currentId === undefined) {
            return;
        }

        kernel.getServiceContainer().get('helper.navigator').goTo(this.cardPath + this.model.currentId + '.html')
    };

    this.onDeleteRecord = function () {
        if (this.model.currentId === undefined) {
            return;
        }

        alert(this.model.currentId);
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
    }
}
function AbstractDocumentsController() {
    AbstractDictionaryController.call(this);

    this.AbstractDocumentsController = function () {
        this.AbstractDictionaryController()
    }
}
function AbstractReportController() {
    MainControllerAbstract.call(this);
}
function MainControllerAbstract() {
    this.events = [];

    this.MainControllerAbstract = function () {
        this.onGetGroundDictionaryEvent = this.onGetGroundDictionary.bind(this);
        this.onGetMetersDictionaryEvent = this.onGetMetersDictionary.bind(this);
        this.onGetConsumerDictionaryEvent = this.onGetConsumerDictionary.bind(this);
        this.onGetServicesDictionaryEvent = this.onGetServicesDictionary.bind(this);
        this.onGetPayDocumentsEvent = this.onGetPayDocuments.bind(this);
        this.onGetAccuringDocumentsEvent = this.onGetAccurringDocuments.bind(this);
        this.onGetMetersDocumentsEvent = this.onGetMetersDocuments.bind(this);
        this.onGetTarifsDocumentsEvent = this.onGetTarifDocuments.bind(this);
        this.onGetMainReportEvent = this.onGetMainReport.bind(this);
        this.onGetMetersReportEvent = this.onGetMetersReport.bind(this);
        this.onGetBalanceReportEvent = this.onGetBalanceReport.bind(this);
        this.onGetSmsReportEvent = this.onGetSmsReport.bind(this);

        this.events.push({'selector': '.ground_dictionary_button', 'action': 'click', 'event': this.onGetGroundDictionaryEvent});
        this.events.push({'selector': '.services_dictionary_button', 'action': 'click', 'event': this.onGetServicesDictionaryEvent});
        this.events.push({'selector': '.meters_dictionary_button', 'action': 'click', 'event': this.onGetMetersDictionaryEvent});
        this.events.push({'selector': '.consumer_dictionary_button', 'action': 'click', 'event': this.onGetConsumerDictionaryEvent});
        this.events.push({'selector': '.pay_documents_button', 'action': 'click', 'event': this.onGetPayDocumentsEvent});
        this.events.push({'selector': '.accuring_documents_button', 'action': 'click', 'event': this.onGetAccuringDocumentsEvent});
        this.events.push({'selector': '.meters_documents_button', 'action': 'click', 'event': this.onGetMetersDocumentsEvent});
        this.events.push({'selector': '.tarifs_documents_button', 'action': 'click', 'event': this.onGetTarifsDocumentsEvent});
        this.events.push({'selector': '.main_report_button', 'action': 'click', 'event': this.onGetMainReportEvent});
        this.events.push({'selector': '.meters_report_button', 'action': 'click', 'event': this.onGetMetersReportEvent});
        this.events.push({'selector': '.balance_report_button', 'action': 'click', 'event': this.onGetBalanceReportEvent});
        this.events.push({'selector': '.sms_report_button', 'action': 'click', 'event': this.onGetSmsReportEvent});
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

    this.onGetAccurringDocuments = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/document/accurring.html');
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
}
var collections = {
    kontragentCollection: {
        type: 'static',
        data: {}
    },
    kontragentSupplyCollection: {
        type: 'dynamic',
        url: '/api/v1.0/supply/dictionary/kontragent',
        staticCollection: 'kontragentCollection',
        data: {}
    },
    groundCollection: {
        type: 'static',
        data: {}
    },
    groundSupplyCollection: {
        type: 'dynamic',
        url: '/api/v1.0/supply/dictionary/ground',
        staticCollection: 'groundCollection',
        data: {}
    },
    meterTypesCollection: {
        type: 'static',
        data: {
            1: 'Электричество',
            2: 'Газ'
        }
    },
    serviceTypesCollection: {
        type: 'static',
        data: {
            1: 'Член сообщества',
            2: 'Участок'
        }
    },
    serviceSubtypesCollection: {
        type: 'static',
        data: {
            1: 'Фиксированный',
            2: 'По площади',
            3: 'По счетчику (электричество)',
            4: 'По счетчику (газ)'
        }
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
var GROUND_NUMBER_LANG = "Номер участка";
var GROUND_AREA_LANG = "Занимаемая площадь, кв. м.";
var GROUND_FREE_AREA_LANG = "Не относящаяся к причалу площадь, кв. м.";
var GROUND_COMMON_AREA_LANG = "Площадь общего пользования, кв. м.";
var GROUND_ALL_AREA_LANG = "Всего площадь, кв. м.";
var OWNER_FULL_NAME_LANG = "ФИО собственника";
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
var SERVICE_CALC_BASE_LANG = "Тип базы для расчета";
var TARIFS_DATE_START_LANG = "Дата начала действия";
var DOCUMENT_DATE_LANG = "Дата документа";
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
    '/document/accurring\.html': 'controller.accurringDocuments',
    '/document/meters\.html': 'controller.metersDocuments',
    '/document/tarifs\.html': 'controller.tarifsDocuments',
    '/report/main\.html': 'controller.mainReport',
    '/report/meters\.html': 'controller.metersReport',
    '/report/balance\.html': 'controller.balanceReport',
    '/report/sms\.html': 'controller.smsReport'
};

LOGIN_ROUTE = '/login.html';
const SERVICES_LIST = {
    'helper.url': {'class': 'UrlHelper', 'args': {}},
    'helper.navigator': {'class': 'NavigatorHelper', 'args': {}},
    'service.router': {'class': 'Router', 'args': {}},
    'container.user': {'class': 'UserContainer', 'args': {}},
    'controller.main': {'class': 'MainController', 'args': {}},
    'controller.login': {'class': 'LoginController', 'args': {}},
    'view.login': {'class': 'LoginView', 'args': {}},
    'container.event': {'class': 'EventContainer', 'args': {}},
    'container.collection': {'class': 'CollectionContainer', 'args': {}},
    'requester.ajax': {'class': 'AjaxRequester', 'args': {}},
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
    'controller.accuringDocuments': {'class': 'AccurringDocumentsController', 'args': {}},
    'controller.metersDocuments': {'class': 'MetersDocumentsController', 'args': {}},
    'controller.payDocuments': {'class': 'PayDocumentsController', 'args': {}},
    'controller.tarifsDocuments': {'class': 'TarifsDocumentsController', 'args': {}},
    'controller.balanceReport': {'class': 'BalanceReportController', 'args': {}},
    'controller.mainReport': {'class': 'MainReportController', 'args': {}},
    'controller.metersReport': {'class': 'MetersReportController', 'args': {}},
    'controller.smsReport': {'class': 'SmsReportController', 'args': {}},
    'view.accuringDocuments': {'class': 'AccurringDictionaryView', 'args': {}},
    'view.metersDocuments': {'class': 'MetersDictionaryView', 'args': {}},
    'view.payDocuments': {'class': 'PayDictionaryView', 'args': {}},
    'view.tarifsDocuments': {'class': 'TarifsDocumentsView', 'args': {}},
    'view.balanceReports': {'class': 'BalanceReportsView', 'args': {}},
    'view.mainReports': {'class': 'MainReportsView', 'args': {}},
    'view.metersReports': {'class': 'MetersReportsView', 'args': {}},
    'view.smsReports': {'class': 'SmsReportsView', 'args': {}}
};

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
            paramsArray.push(key + '=' + params[key]);
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
        "subtype": SERVICE_CALC_BASE_LANG
    };

    this.ServiceDictionaryModel = function (object) {
        this.DictionaryAbstractModel(object);
    };

    this.ServiceDictionaryModel(params);
}
function ConsumerCardModel(object) {
    AbstractCardModel.call(this);
    this.baseUrl = '/api/v1.0/dictionary/kontragent';

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

    this.AbstractCardModel(object);
}
function MeterCardModel(object) {
    AbstractCardModel.call(this);
    this.baseUrl = '/api/v1.0/dictionary/meter';

    this.AbstractCardModel(object);
}
function ServiceCardModel(object) {
    AbstractCardModel.call(this);
    this.baseUrl = '/api/v1.0/dictionary/service';

    this.AbstractCardModel(object);
}
function AccurringDocumentsModel() {
    
}
function MetersDocumentsModel() {
    
}
function PayDocumentsModel() {
    
}
function TarifsDocumentsModel(params) {
    DocumentAbstractModel.call(this);

    this.url = '/api/v1.0/document/list/tarif';
    this.dataNames = {
        "id": RECORD_NUMBER_LANG,
        "date": DOCUMENT_DATE_LANG,
        "dateStart": TARIFS_DATE_START_LANG
    };

    this.TarifsDocumentsModel = function (object) {
        this.DocumentAbstractModel(object);
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
        var method = this.recordId ? HTTP_METHOD_PATCH : HTTP_METHOD_POST;
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
    this.method = 'GET';
    this.successCallback = undefined;
    this.url = '';
    this.collectionFields = {};

    this.AbstractModel = function (object) {
        this.creator = object;

        this.onRefreshSuccessEvent = this.onRefreshSuccess.bind(this);
        this.onRequestErrorEvent = this.onRequestError.bind(this);
    };

    this.setSuccessCallback = function (callback) {
        this.successCallback = callback;
    };

    this.appendDataToRequest = function (data) {
        for (var key in data) {
            this.requestData[key] = data[key];
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
    
    this.saveDataToCollection = function (data) {
        var container = kernel.getServiceContainer().get('container.collection');
        
        for (var key in this.collectionFields) {
            container.addDataRow(key, this.data[this.collectionFields[key].id], this.data[this.collectionFields[key].name]);
        }
    };

    this.getDataForView = function () {
        return this.data;
    };

    this.onRequestError = function () {
        alert('Не получилось получить доступ к серверу.');
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
            'data': this.data
        };
        if (this.getRequestData('order_by')) {
            result['orderBy'] = this.getRequestData('order_by');
        }
        if (this.getRequestData('order_type')) {
            result['orderType'] = this.getRequestData('order_type');
        }

        return result;
    };
}
function DocumentAbstractModel() {
    DictionaryAbstractModel.call(this);

    this.DocumentAbstractModel = function (object) {
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
        if (this.element.value.length < 2) {
            return;
        }

        var container = kernel.getServiceContainer().get('container.collection');
        container.getDataBySupply(this.element.dataset.type, this.element.value, this.onGetDataSuccessEvent);
    };

    this.onGetDataSuccess = function () {
        var data = kernel.getServiceContainer().get('container.collection').getDataFromSupply(this.element.dataset.type);

        var html = data == {} ? this.failText : this.text;
        for (var key in data) {
            html += '<p class="selectbox-item" data-id="' + key + '">' + data[key] + ' (' + key + ')</p>';
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

        input.value = container.getDataById(collection, id);
    };
}

function ConsumerDictionaryView() {
    AbstractDictionaryView.call(this);
}
function GroundDictionaryView() {
    AbstractDictionaryView.call(this);
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
    this.template = '<div class="sheet"><ul><button class="save_button"></button><button class="cancel_button"></button></ul><ul class="card_row"><li class="card_cell">{ACCOUNT_NUMBER_LANG}<input name="accNumber" value="{accNumber}"></li><li class="card_cell">{NUMBER_LANG}<input name="number" value="{number}"></li></ul><ul class="card_row"><li class="card_cell">{GROUND_LINE_LANG}<input name="line" value="{line}"></li><li class="card_cell">{GROUND_NUMBER_LANG}<input name="groundNumber" value="{groundNumber}"></li></ul><ul class="card_row"><li class="card_cell">{GROUND_AREA_LANG}<input name="area" value="{area}"></li><li class="card_cell">{GROUND_FREE_AREA_LANG}<input name="freeArea" value="{freeArea}"></li></ul><ul class="card_row"><li class="card_cell">{GROUND_COMMON_AREA_LANG}<input name="commonArea" value="{commonArea}"></li><li class="card_cell">{GROUND_ALL_AREA_LANG}<input name="allArea" value="{allArea}"></li></ul><ul class="card_row"><li class="card_cell">{OWNER_FULL_NAME_LANG}<div class="selectbox" tabindex="-1"><input name="owner" data-id="{kontragentId}" data-type="kontragent" value="{owner}"><p class="selectbox-list-hide"></p></div></li></ul></div>';
}
function MeterCardView() {
    AbstractCardView.call(this);
    this.template = '<div class="sheet"><ul><button class="save_button"></button><button class="cancel_button"></button></ul><ul class="card_row"><li class="card_cell">{METER_NUMBER_LANG}<input name="number" value="{number}"></li><li class="card_cell">{METER_TYPE_LANG}<select name="type">{type}</select></li></ul><ul class="card_row"><li class="card_cell">{METER_GROUND_OWNER_LANG}<div class="selectbox" tabindex="-1"><input name="ground" data-id="{groundId}" data-type="ground" value="{ground}"><p class="selectbox-list-hide"></p></div></li></ul></div>';

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
    this.template = '<div class="sheet"><ul><button class="save_button"></button><button class="cancel_button"></button></ul><ul class="card_row"><li class="card_cell">{SERVICE_NAME_LANG}<input name="name" value="{name}"></li><li class="card_cell">{SERVICE_TYPE_LANG}<select name="type">{type}</select></li></ul><ul class="card_row"><li class="card_cell">{SERVICE_CALC_BASE_LANG}<select name="subtype">{subtype}</select></li></ul></div>';

    this.buildTemplate = function (data) {
        var container = kernel.getServiceContainer().get('container.collection');
        data['type'] = container.getDataForSelect('serviceTypes', data['type']);
        data['subtype'] = container.getDataForSelect('serviceSubtypes', data['subtype']);
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        html += this.addData(this.template, data) + '</div>';

        return html;
    };
}
function AccurringDocumentsView() {
    
}
function MetersDocumentsView() {
    
}
function PayDocumentsView() {
    
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
    this.template = '<div><ul class="menu"><li class="menu_element"><p>Справочники</p><ul class="submenu"><li class="submenu_element consumer_dictionary_button"><p>Потребители</p></li><li class="submenu_element ground_dictionary_button"><p>Участки</p></li><li class="submenu_element meters_dictionary_button"><p>Счетчики</p></li><li class="submenu_element services_dictionary_button"><p>Усуги</p></li></ul></li><li class="menu_element"><p>Документы</p><ul class="submenu"><li class="submenu_element pay_documents_button"><p>Оплаты</p></li><li class="submenu_element accuring_documents_button"><p>Начисления</p></li><li class="submenu_element meters_documents_button"><p>Показания счетчиков</p></li><li class="submenu_element tarifs_documents_button"><p>Тарифы</p></li></ul></li><li class="menu_element"><p>Отчеты</p><ul class="submenu"><li class="submenu_element main_report_button"><p>Основной отчет</p></li><li class="submenu_element meters_report_button"><p>Отчет по счетчикам</p></li><li class="submenu_element balance_report_button"><p>Баланс расчетов</p></li><li class="submenu_element sms_report_button"><p>Отчет о смс</p></li></ul></li></ul></div>';

    this.buildTemplate = function () {
        return this.template;
    };
}
function BalanceReportView() {
    
}
function MainReportView() {
    
}
function MetersReportView() {
    
}
function SmsReportView() {
    
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
        if (data.pageCount == 1) {
            return '';
        }

        var startPage = data.page - 1 > 0 ? data.page - 1 : 1;
        var endPage = startPage + 5 < data.pageCount ? startPage + 5 : data.pageCount;
        var result = '<ul>';

        for (var i = startPage; i <= endPage; i++) {
            result += '<button class="paginator-button' + (data.page == i ? ' active' : '') + '" data-page="' + i + '">' + i + '</button>';
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
        '<ul><button class="add_button"></button><button class="edit_button"></button><!--<button class="delete_button"></button>--></ul>',
        '<ul><div class="table">',
        '</div></ul>',
        '</li><div>'
    ];

    this.buildTemplate = function (data) {
        var html = data.isSubview === undefined || data.isSubview === false ? this.template[0] : this.template[1];

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

        if (!matches.length) {
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
