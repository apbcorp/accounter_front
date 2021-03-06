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