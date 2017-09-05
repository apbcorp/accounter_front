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
    }
}

function NavigatorHelper() {
    this.goTo = function (url) {
        url = kernel.getServiceContainer().get('helper.url').getDomain(document.location.href) + url;
        history.pushState(null, null, url);

        kernel.navigate();
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
        {'url': '/api/v1.0/ground', 'data': {}, 'method': 'GET', 'result': '{"status":"success","result":[{"id":1,"accNumber":449,"line":4,"groundNumber":245,"area":"91","freeArea":"0","commonArea":"13,34","allArea":"104,34"}, {"id":2,"accNumber":450,"line":4,"groundNumber":245,"area":"0","freeArea":"0","commonArea":"0","allArea":"0"}]}'}
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

                    break;
                }
            }
        }
    }
}

function ServiceContainer() {
    this.servicesList = {
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
        'controller.metersDictionary': {'class': 'MetersDictionaryController', 'args': {}},
        'controller.consumerDictionary': {'class': 'ConsumerDictionaryController', 'args': {}},
        'view.groundDictionary': {'class': 'GroundDictionaryView', 'args': {}},
        'view.table': {'class': 'TableView', 'args': {}},
        'view.tableHead': {'class': 'TableHeadView', 'args': {}},
        'view.tableRow': {'class': 'TableRowView', 'args': {}}
    };
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

function Router() {
    this.routes = {
        '/index.html': 'controller.main',
        '/login.html': 'controller.login',
        '/dictionary/consumers.html': 'controller.consumerDictionary',
        '/dictionary/grounds.html': 'controller.groundDictionary',
        '/dictionary/meters.html': 'controller.metersDictionary',
        '/dictionary/services.html': 'controller.serviceDictionary'
    };
    this.getController = function (url) {
        var controllerName = '';
        for (var routing in this.routes) {
            if (url == routing) {
                controllerName = this.routes[routing];

                break;
            }
        }

        return {
            'name': controllerName,
            'params': {}
        };
    };
}

function ConsumerDictionaryController() {
    this.events = [];

    this.constructor = function () {
        this.onAddRecordEvent = this.onAddRecord.bind(this);
        this.onEditRecordEvent = this.onEditRecord.bind(this);
        this.onDeleteRecordEvent = this.onDeleteRecord.bind(this);

        this.events = [
            {'selector': '.add_button', 'action': 'click', 'event': this.onAddRecordEvent},
            {'selector': '.edit_button', 'action': 'click', 'event': this.onEditRecordEvent},
            {'selector': '.delete_button', 'action': 'click', 'event': this.onDeleteRecordEvent}
        ];
    };

    this.init = function () {

    };

    this.onAddRecord = function () {

    };

    this.onEditRecord = function () {

    };

    this.onDeleteRecord = function () {

    };

    this.constructor();
}

function MetersDictionaryController() {
    this.events = [];

    this.constructor = function () {
        this.onAddRecordEvent = this.onAddRecord.bind(this);
        this.onEditRecordEvent = this.onEditRecord.bind(this);
        this.onDeleteRecordEvent = this.onDeleteRecord.bind(this);

        this.events = [
            {'selector': '.add_button', 'action': 'click', 'event': this.onAddRecordEvent},
            {'selector': '.edit_button', 'action': 'click', 'event': this.onEditRecordEvent},
            {'selector': '.delete_button', 'action': 'click', 'event': this.onDeleteRecordEvent}
        ];
    };

    this.init = function () {

    };

    this.onAddRecord = function () {

    };

    this.onEditRecord = function () {

    };

    this.onDeleteRecord = function () {

    };

    this.constructor();
}

function ServiceDictionaryController() {
    this.events = [];

    this.constructor = function () {
        this.onAddRecordEvent = this.onAddRecord.bind(this);
        this.onEditRecordEvent = this.onEditRecord.bind(this);
        this.onDeleteRecordEvent = this.onDeleteRecord.bind(this);

        this.events = [
            {'selector': '.add_button', 'action': 'click', 'event': this.onAddRecordEvent},
            {'selector': '.edit_button', 'action': 'click', 'event': this.onEditRecordEvent},
            {'selector': '.delete_button', 'action': 'click', 'event': this.onDeleteRecordEvent}
        ];
    };

    this.init = function () {

    };

    this.onAddRecord = function () {

    };

    this.onEditRecord = function () {

    };

    this.onDeleteRecord = function () {

    };

    this.constructor();
}

function GroundDictionaryController() {
    this.constructor = function () {
        this.onAddRecordEvent = this.onAddRecord.bind(this);
        this.onEditRecordEvent = this.onEditRecord.bind(this);
        this.onDeleteRecordEvent = this.onDeleteRecord.bind(this);
        this.onLoadDataSuccessEvent = this.onLoadDataSuccess.bind(this);
        this.onLoadErrorEvent = this.onLoadError.bind(this);

        this.events.push({'selector': '.add_button', 'action': 'click', 'event': this.onAddRecordEvent});
        this.events.push({'selector': '.edit_button', 'action': 'click', 'event': this.onEditRecordEvent});
        this.events.push({'selector': '.delete_button', 'action': 'click', 'event': this.onDeleteRecordEvent});
        this.prototypeConstructor();
    };

    this.init = function () {
        var eventContainer = kernel.getServiceContainer().get('container.event');
        eventContainer.setEvents(this.events);

        this.sendDataRequest();
    };

    this.sendDataRequest = function () {
        var requester = kernel.getServiceContainer().get('requester.ajax');
        requester.setUrl('/api/v1.0/ground');
        requester.setData({});
        requester.setMethod('GET');
        requester.setSuccess(this.onLoadDataSuccessEvent);
        requester.setError(this.onLoadErrorEvent);
        requester.request();
    };

    this.onLoadDataSuccess = function (data) {
        data = JSON.parse(data);

        var view = kernel.getServiceContainer().get('view.groundDictionary');
        view.render(data.result);
    };

    this.onLoadError = function () {

    };

    this.onAddRecord = function () {

    };

    this.onEditRecord = function () {

    };

    this.onDeleteRecord = function () {

    };

    MainControllerPrototype.call(this);
    this.constructor();
}

function GroundDictionaryView() {
    this.columnNames = [
        '№ п/п',
        '№ счета',
        'Линия',
        'Номер участка',
        'Занимаемая площадь, кв. м.',
        'Не относящаяся к причалу площадь, кв. м.',
        'Площадь общего пользования, кв. м.',
        'Всего площадь, кв. м.'
    ];

    this.render = function (data) {
        this.clear();
        var html = this.buildTemplate(data);
        $('body').append(html);
    };

    this.buildTemplate = function (data) {
        data.unshift(this.columnNames);
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        html += kernel.getServiceContainer().get('view.table').buildTemplate(data);
        html += '</div>';

        return html;
    };

    this.clear = function () {
        var body = $('body')[0];
        body.removeChild(body.lastChild);
    }
}

function TableView() {
    this.template = [
        '<div class="sheet"><li><ul><button class="add_button"></button></ul><ul><div class="table">',
        '</div></ul></li></div>'
    ];

    this.buildTemplate = function (data) {
        var html = this.template[0];

        for (var i = 0; i < data.length; i++) {
            html += i == 0
                ? kernel.getServiceContainer().get('view.tableHead').buildTemplate(data[i])
                : kernel.getServiceContainer().get('view.tableRow').buildTemplate(data[i])
        }

        html += this.template[1];

        return html;
    };
}

function TableHeadView() {
    this.template = [
        '<ul class="table_head">',
        '<li>',
        '</li>',
        '</ul>'
    ];

    this.buildTemplate = function (data) {
        var html = this.template[0];

        for (var key in data) {
            html += this.template[1] + data[key] + this.template[2];
        }

        html += this.template[3];

        return html;
    };
}

function TableRowView() {
    this.template = [
        '<ul class="table_row">',
        '<li>',
        '</li>',
        '</ul>'
    ];

    this.buildTemplate = function (data) {
        var html = this.template[0];

        for (var key in data) {
            html += this.template[1] + data[key] + this.template[2];
        }

        html += this.template[3];

        return html;
    };
}

function MainController() {
    this.init = function () {
        var userContainer = kernel.getServiceContainer().get('container.user');

        if (!userContainer.isLogin()) {
            kernel.getServiceContainer().get('helper.navigator').goTo('/login.html');

            return;
        }

        var view = kernel.getServiceContainer().get('view.main');
        view.render();
        var eventContainer = kernel.getServiceContainer().get('container.event');
        eventContainer.setEvents(this.events);
    };
    MainControllerPrototype.call(this);
    this.prototypeConstructor();
}

function MainControllerPrototype() {
    this.events = [];

    this.prototypeConstructor = function () {
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

function MainView() {
    this.template = '<div><ul class="menu"><li class="menu_element"><p>Справочники</p><ul class="submenu"><li class="submenu_element services_consumer_dictionary_button"><p>Потребители</p></li><li class="submenu_element ground_dictionary_button"><p>Участки</p></li><li class="submenu_element meters_dictionary_button"><p>Счетчики</p></li><li class="submenu_element services_dictionary_button"><p>Усуги</p></li></ul></li><li class="menu_element"><p>Документы</p></li><li class="menu_element"><p>Отчеты</p></li></ul></div>';

    this.render = function () {
        this.clear();
        var html = this.buildTemplate();
        $('body').append(html);
    };

    this.buildTemplate = function () {
        return this.template;
    };

    this.clear = function () {
        var body = $('body')[0];
        body.removeChild(body.lastChild);
    }
}

function LoginController() {
    this.events = [];

    this.constructor = function () {
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
        var data = JSON.parse(data);
        var userContainer = kernel.getServiceContainer().get('container.user');
        userContainer.setUserData(data.result);
        kernel.getServiceContainer().get('helper.navigator').goTo('/index.html');
    };

    this.onLoginError = function () {
        $('.login_error')[0].style.display = 'block';
    };

    this.constructor();
}

function LoginView() {
    this.template = '<table align="center" style="padding-top: 100px;"><tr><td><table><tr><td>Имя пользователя</td><td><input name="login"></td></tr><tr><td>Пароль</td><td><input type="password" name="password"></td></tr></table></td></tr><tr class="login_error"><td>Ввведна неверная комбинация имени и пароля</td></tr><tr><td><center><button class="login_button">Вход</button></center></td></tr></table>';

    this.render = function () {
        var html = this.buildTemplate();
        $('body').append(html);
    };

    this.buildTemplate = function () {
        return this.template;
    };
}

function UserContainer() {
    this.user = undefined;

    this.isLogin = function () {
        return !(this.user === undefined);
    };

    this.setUserData = function (data) {
        this.user = data;
    }
}

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
        var router = this.services.get('service.router');
        var urlHelper = this.services.get('helper.url');

        var url = urlHelper.getUrlWithoutDomain(document.location.href);

        var controllerInfo = router.getController(url);

        var controller = this.services.get(controllerInfo.name);
        controller.init(controllerInfo.params);
    };
}