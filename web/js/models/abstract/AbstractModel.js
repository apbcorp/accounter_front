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