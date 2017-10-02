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