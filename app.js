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
function AbstractCardController() {
    MainControllerAbstract.call(this);
    this.viewName = undefined;

    this.AbstractCardController = function () {
        this.MainControllerAbstract();
    };

    this.init = function (params) {
        this.model.setId(params[0]);

        this.model.refresh();
    };

    this.onRefreshComplete = function (data) {
        var view = kernel.getServiceContainer().get(this.viewName);
        view.render(data);

        var eventContainer = kernel.getServiceContainer().get('container.event');
        eventContainer.setEvents(this.events);
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
        alert('add');
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
}
function ConsumerCardController() {
    AbstractCardController.call(this);
    this.model = new ConsumerCardModel(this);
    this.viewName = 'view.consumerCard';

    this.AbstractCardController();
}
function ConsumerDictionaryController() {
    AbstractDictionaryController.call(this);
    this.model = new ConsumerDictionaryModel(this);
    this.cardPath = '/dictionary/consumer/';
    this.viewName = 'view.consumerDictionary';

    this.AbstractDictionaryController();
}
function GroundCardController() {
    AbstractCardController.call(this);
    this.model = new GroundCardModel(this);
    this.viewName = 'view.groundCard';

    this.AbstractCardController();
}
function GroundDictionaryController() {
    AbstractDictionaryController.call(this);
    this.model = new GroundDictionaryModel(this);
    this.cardPath = '/dictionary/ground/';
    this.viewName = 'view.groundDictionary';

    this.AbstractDictionaryController();
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
        requester.setUrl('/api/v1.0/login');
        requester.setData({'login': $('[name = login]')[0].value, 'password': $('[name = password]')[0].value});
        requester.setMethod('GET');
        requester.setSuccess(this.onLoginSuccessEvent);
        requester.setError(this.onLoginErrorEvent);
        requester.request();
    };

    this.onLoginSuccess = function (data) {
        data = JSON.parse(data);
        var userContainer = kernel.getServiceContainer().get('container.user');
        userContainer.setUserData(data.result);
        kernel.getServiceContainer().get('helper.navigator').goTo('/index.html');
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
function MainControllerAbstract() {
    this.events = [];

    this.MainControllerAbstract = function () {
        this.onGetGroundDictionaryEvent = this.onGetGroundDictionary.bind(this);
        this.onGetMetersDictionaryEvent = this.onGetMetersDictionary.bind(this);
        this.onGetConsumerDictionaryEvent = this.onGetConsumerDictionary.bind(this);
        this.onGetServicesDictionaryEvent = this.onGetServicesDictionary.bind(this);

        this.events.push({'selector': '.ground_dictionary_button', 'action': 'click', 'event': this.onGetGroundDictionaryEvent});
        this.events.push({'selector': '.services_dictionary_button', 'action': 'click', 'event': this.onGetServicesDictionaryEvent});
        this.events.push({'selector': '.meters_dictionary_button', 'action': 'click', 'event': this.onGetMetersDictionaryEvent});
        this.events.push({'selector': '.consumer_dictionary_button', 'action': 'click', 'event': this.onGetConsumerDictionaryEvent});
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
}
function MeterCardController() {
    AbstractCardController.call(this);
    this.model = new MeterCardModel(this);
    this.viewName = 'view.meterCard';

    this.AbstractCardController();
}
function MeterDictionaryController() {
    AbstractDictionaryController.call(this);
    this.model = new MeterDictionaryModel(this);
    this.cardPath = '/dictionary/meter/';
    this.viewName = 'view.meterDictionary';

    this.AbstractDictionaryController();
}
function ServiceCardController() {
    AbstractCardController.call(this);
    this.model = new ServiceCardModel(this);
    this.viewName = 'view.serviceCard';

    this.AbstractCardController();
}
function ServiceDictionaryController() {
    AbstractDictionaryController.call(this);
    this.model = new ServiceDictionaryModel(this);
    this.cardPath = '/dictionary/service/';
    this.viewName = 'view.serviceDictionary';

    this.AbstractDictionaryController();
}
/**
 * Created by User on 10.09.2017.
 */

const HTTP_METHOD_GET    = 'GET';
const HTTP_METHOD_POST   = 'POST';
const HTTP_METHOD_PUT    = 'PUT';
const HTTP_METHOD_PATCH  = 'PATCH';
const HTTP_METHOD_DELETE = 'DELETE';
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
    '/dictionary/consumer/(.*)\.html': 'controller.consumerCard'
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
    //'requester.ajax': {'class': 'AjaxRequester', 'args': {}}
    'requester.ajax': {'class': 'AjaxMockRequester', 'args': {}}, //mock
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
    'controller.groundCard': {'class': 'GroundCardController', 'args': {}},
    'view.groundCard': {'class': 'GroundCardView', 'args': {}},
    'controller.serviceCard': {'class': 'ServiceCardController', 'args': {}},
    'view.serviceCard': {'class': 'ServiceCardView', 'args': {}},
    'controller.meterCard': {'class': 'MeterCardController', 'args': {}},
    'view.meterCard': {'class': 'MeterCardView', 'args': {}},
    'controller.consumerCard': {'class': 'ConsumerCardController', 'args': {}},
    'view.consumerCard': {'class': 'ConsumerCardView', 'args': {}}
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
function AbstractModel() {
    this.creator = undefined;
    this.data = {};
    this.requestData = {};
    this.method = 'GET';

    this.AbstractModel = function (object) {
        this.creator = object;

        this.onRefreshSuccessEvent = this.onRefreshSuccess.bind(this);
        this.onRequestErrorEvent = this.onRequestError.bind(this);
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
        data = JSON.parse(data);
        this.data = data.result;

        this.creator.onRefreshComplete(this.getDataForView());
    };

    this.getDataForView = function () {
        return this.data;
    };

    this.onRequestError = function () {
        alert('Не получилось получить доступ к серверу.');
    };
}
function ConsumerCardModel(object) {
    AbstractModel.call(this);
    this.baseUrl = '/api/v1.0/consumer/';

    this.setId = function (id) {
        this.url = this.baseUrl + id;
    };

    this.AbstractModel(object);
}
function ConsumerDictionaryModel(params) {
    DictionaryAbstractModel.call(this);
    this.url = '/api/v1.0/consumer';
    this.dataNames = {
        "id": "№ п/п",
        "surname": "Фамилия",
        "name": "Имя",
        "name2": "Отчество",
        "phone": "Телефон",
        "adress": "Адрес"
    };

    this.ConsumerDictionaryModel = function (object) {
        this.DictionaryAbstractModel(object);
    };

    this.ConsumerDictionaryModel(params);
}
function DictionaryAbstractModel() {
    AbstractModel.call(this);
    this.currentId = undefined;

    this.DictionaryAbstractModel = function (object) {
        this.AbstractModel(object);
    };

    this.appendDataToRequest = function (data) {
        for (var key in data) {
            this.requestData[key] = data[key];
        }
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
function GroundCardModel(object) {
    AbstractModel.call(this);
    this.baseUrl = '/api/v1.0/ground/';

    this.setId = function (id) {
        this.url = this.baseUrl + id;
    };

    this.AbstractModel(object);
}
function GroundDictionaryModel(params) {
    DictionaryAbstractModel.call(this);
    this.url = '/api/v1.0/ground';
    this.dataNames = {
        "id": "№ п/п",
        "accNumber": "№ счета",
        "line": "Линия",
        "groundNumber": "Номер участка",
        "area": "Занимаемая площадь, кв. м.",
        "freeArea": "Не относящаяся к причалу площадь, кв. м.",
        "commonArea": "Площадь общего пользования, кв. м.",
        "allArea": "Всего площадь, кв. м.",
        "owner": "Собственник"
    };

    this.GroundDictionaryModel = function (object) {
        this.DictionaryAbstractModel(object);
    };

    this.GroundDictionaryModel(params);
}
function MeterCardModel(object) {
    AbstractModel.call(this);
    this.baseUrl = '/api/v1.0/meter/';

    this.setId = function (id) {
        this.url = this.baseUrl + id;
    };

    this.AbstractModel(object);
}
function MeterDictionaryModel(params) {
    DictionaryAbstractModel.call(this);
    this.url = '/api/v1.0/meter';
    this.dataNames = {
        "id": "№ п/п",
        "number": "Номер счетчика",
        "type": "Тип счетчика",
        "ground": "Участок установки"
    };

    this.ServiceDictionaryModel = function (object) {
        this.DictionaryAbstractModel(object);
    };

    this.ServiceDictionaryModel(params);
}
function ServiceCardModel(object) {
    AbstractModel.call(this);
    this.baseUrl = '/api/v1.0/service/';

    this.setId = function (id) {
        this.url = this.baseUrl + id;
    };

    this.AbstractModel(object);
}
function ServiceDictionaryModel(params) {
    DictionaryAbstractModel.call(this);
    this.url = '/api/v1.0/service';
    this.dataNames = {
        "id": "№ п/п",
        "name": "Название услуги",
        "type": "Тип потребителя услуги",
        "subtype": "Тип базы для расчета"
    };

    this.ServiceDictionaryModel = function (object) {
        this.DictionaryAbstractModel(object);
    };

    this.ServiceDictionaryModel(params);
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
        {'url': '/api/v1.0/ground/1', 'data': {}, 'method': 'GET', 'result': '{"status":"success","result":{"id":1,"accNumber":449,"line":4,"groundNumber":245,"area":"91","freeArea":"0","commonArea":"13,34","allArea":"104,34"}}'}
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
function AbstractDictionaryView() {
    AbstractView.call(this);

    this.buildTemplate = function (data) {
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        html += kernel.getServiceContainer().get('view.table').buildTemplate(data);
        html += '</div>';

        return html;
    };
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
function ConsumerCardView() {
    AbstractView.call(this);
    this.template = '';

    this.buildTemplate = function (data) {
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        html += '</div>';

        return html;
    };
}
function ConsumerDictionaryView() {
    AbstractDictionaryView.call(this);
}
function GroundCardView() {
    AbstractView.call(this);
    this.template = '';

    this.buildTemplate = function (data) {
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        html += '</div>';

        return html;
    };
}
function GroundDictionaryView() {
    AbstractDictionaryView.call(this);
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
    this.template = '<div><ul class="menu"><li class="menu_element"><p>Справочники</p><ul class="submenu"><li class="submenu_element consumer_dictionary_button"><p>Потребители</p></li><li class="submenu_element ground_dictionary_button"><p>Участки</p></li><li class="submenu_element meters_dictionary_button"><p>Счетчики</p></li><li class="submenu_element services_dictionary_button"><p>Усуги</p></li></ul></li><li class="menu_element"><p>Документы</p></li><li class="menu_element"><p>Отчеты</p></li></ul></div>';

    this.buildTemplate = function () {
        return this.template;
    };
}
function MeterCardView() {
    AbstractView.call(this);
    this.template = '';

    this.buildTemplate = function (data) {
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        html += '</div>';

        return html;
    };
}
function MeterDictionaryView() {
    AbstractDictionaryView.call(this);
}
function ServiceCardView() {
    AbstractView.call(this);
    this.template = '';

    this.buildTemplate = function (data) {
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        html += '</div>';

        return html;
    };
}
function ServiceDictionaryView() {
    AbstractDictionaryView.call(this);
}
function TableHeadView() {
    this.template = [
        '<ul class="table_head">',
        '<li class="column_head" data-name="{name}">',
        '<li class="column_head" data-name="{name}"><img class="order_image" src="/img/uparrow.png">',
        '<li class="column_head" data-name="{name}"><img class="order_image" src="/img/downarrow.png">',
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
        '<div class="sheet"><li><ul><button class="add_button"></button><button class="edit_button"></button><button class="delete_button"></button></ul><ul><div class="table">',
        '</div></ul></li></div>'
    ];

    this.buildTemplate = function (data) {
        var html = this.template[0];
        html += kernel.getServiceContainer().get('view.tableHead').buildTemplate(data.columns, data.orderBy, data.orderType);

        for (var i = 0; i < data.data.length; i++) {
            html += kernel.getServiceContainer().get('view.tableRow').buildTemplate(data.data[i], Object.keys(data.columns));
        }

        html += this.template[1];

        return html;
    };
}
