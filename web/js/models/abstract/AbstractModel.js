function AbstractModel() {
    this.creator = undefined;
    this.data = {};
    this.requestData = {};
    this.method = 'GET';
    this.successCallback = undefined;
    this.url = '';

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

        if (this.successCallback !== undefined) {
            this.successCallback(this.getDataForView())
        } else {
            this.creator.onRefreshComplete(this.getDataForView());
        }
    };

    this.getDataForView = function () {
        return this.data;
    };

    this.onRequestError = function () {
        alert('Не получилось получить доступ к серверу.');
    };
}