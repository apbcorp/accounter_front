function GroundCardModel(object) {
    AbstractCardModel.call(this);
    this.baseUrl = '/api/v1.0/dictionary/ground';
    this.collectionFields = {
        kontragent: {
            id: 'kontragentId',
            name: 'owner'
        }
    };

    this.isValidData = function (data) {
        var validator = kernel.getServiceContainer().get('service.validator');
        var validationData = [
            {data: data.area, type: VALIDATION_TYPE_FLOAT, fieldName: GROUND_AREA_LANG},
            {data: data.freeArea, type: VALIDATION_TYPE_FLOAT, fieldName: GROUND_FREE_AREA_LANG},
            {data: data.commonArea, type: VALIDATION_TYPE_FLOAT, fieldName: GROUND_COMMON_AREA_LANG},
            {data: data.kontragentId, type: VALIDATION_TYPE_OBJECT_ID, fieldName: OWNER_FULL_NAME_LANG}
        ];

        var isValid = validator.validate(validationData);
        this.errors = isValid ? '' : validator.getErrors();

        return isValid;
    };

    this.AbstractCardModel(object);
}