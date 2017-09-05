function UrlHelper() {
    this.getUrlWithoutDomain = function (url) {
        var parts = url.split('/');
        result = parts.splice(3, parts.length);

        return '/' + result.join('/');
    }
}

function NavigatorHelper() {
    this.goTo = function (url) {
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
        {'result': '{"status":"success","result":{}}', 'url': '/api/v1.0/login', 'data': {'login': 'admin', 'password': 'qwerty'}, 'method': 'GET'}
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
        'requester.ajax': {'class': 'AjaxMockRequester', 'args': {}} //mock
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
        '/login.html': 'controller.login'
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

function MainController() {
    this.init = function () {
        var userContainer = kernel.getServiceContainer().get('container.user');

        if (!userContainer.isLogin()) {
            kernel.getServiceContainer().get('helper.navigator').goTo('login.html');

            return;
        }

        alert('Yes!!!!');
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
        kernel.getServiceContainer().get('helper.navigator').goTo('index.html');
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