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