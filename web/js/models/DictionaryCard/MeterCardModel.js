function MeterCardModel(object) {
    AbstractCardModel.call(this);
    this.baseUrl = '/api/v1.0/dictionary/meter';
    this.collectionFields = {
        ground: {
            id: 'groundId',
            name: 'ground'
        }
    };
    
    this.isValidData = function (data) {
        var validator = kernel.getServiceContainer().get('service.validator');

        validator.setData([
            {data: data.number, type: VALIDATION_TYPE_STRING, fieldName: METER_NUMBER_LANG},
            {data: data.groundId, type: VALIDATION_TYPE_OBJECT_ID, fieldName: METER_GROUND_OWNER_LANG}
        ]);

        var isValid = validator.validate();
        this.errors = isValid ? '' : validator.getErrors();

        return isValid;
    };

    this.AbstractCardModel(object);
}