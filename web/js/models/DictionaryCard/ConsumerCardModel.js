function ConsumerCardModel(object) {
    AbstractCardModel.call(this);
    this.baseUrl = '/api/v1.0/dictionary/kontragent';

    this.isValidData = function (data) {
        var validator = kernel.getServiceContainer().get('service.validator');

        validator.setData([
            {data: data.name, type: VALIDATION_TYPE_STRING, fieldName: NAME_LANG},
            {data: data.surname, type: VALIDATION_TYPE_STRING, fieldName: SURNAME_LANG},
            {data: data.name2, type: VALIDATION_TYPE_STRING, fieldName: NAME2_LANG},
            {data: data.adress, type: VALIDATION_TYPE_STRING, fieldName: ADRESS_LANG},
            {data: data.phone, type: VALIDATION_TYPE_PHONE, fieldName: PHONE_LANG}
        ]);

        var isValid = validator.validate();
        this.errors = isValid ? '' : validator.getErrors();

        return isValid;
    };

    this.AbstractCardModel(object);
}