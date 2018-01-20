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