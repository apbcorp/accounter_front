function MetersDocumentModel(params) {
    DocumentAbstractModel.call(this);
    this.baseUrl = '/api/v1.0/document/meter';
    this.collectionFields = {
        meterDocument: {
            id: 'meterId',
            name: 'meter'
        }
    };

    this.MetersDocumentModel = function (object) {
        var date = new Date();

        this.defaultData.date = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);

        this.DocumentAbstractModel(object);
    };

    this.isValidData = function (data) {
        var validator = kernel.getServiceContainer().get('service.validator');
        var validationData = [
            {data: data.date, type: VALIDATION_TYPE_DATE, fieldName: DOCUMENT_DATE_LANG},
            {data: data.rows, type: VALIDATION_TYPE_NOT_EMPTY_ARRAY, fieldName: SHEET_LANG},
            {data: data.rows, type: VALIDATION_TYPE_TABLE_ROWS, fieldName: '', subvalidation: [
                {data: 'meterId', type: VALIDATION_TYPE_OBJECT_ID, fieldName: METER_NAME_LANG},
                {data: 'startValue', type: VALIDATION_TYPE_FLOAT, fieldName: START_VALUE_LANG},
                {data: 'endValue', type: VALIDATION_TYPE_FLOAT, fieldName: END_VALUE_LANG}
            ]}
        ];

        var isValid = validator.validate(validationData);
        this.errors = isValid ? '' : validator.getErrors();

        return isValid;
    };

    this.MetersDocumentModel(params);
}