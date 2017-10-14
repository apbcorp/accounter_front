function AccurringDocumentModel(params) {
    DocumentAbstractModel.call(this);
    this.baseUrl = '/api/v1.0/document/accurring';

    this.AccurringDocumentModel = function (object) {
        var date = new Date();

        this.defaultData.date = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        
        this.DocumentAbstractModel(object);
    };

    this.isValidData = function (data) {
        var validator = kernel.getServiceContainer().get('service.validator');
        var validationData = [
            {data: data.date, type: VALIDATION_TYPE_DATE, fieldName: DOCUMENT_DATE_LANG},
            {data: data.kontragentId, type: VALIDATION_TYPE_OBJECT_ID, fieldName: KONTRAGENT_ID_LANG},
            {data: data.rows, type: VALIDATION_TYPE_NOT_EMPTY_ARRAY, fieldName: SHEET_LANG},
            {data: data.rows, type: VALIDATION_TYPE_TABLE_ROWS, fieldName: '', subvalidation: [
                {data: 'serviceId', type: VALIDATION_TYPE_OBJECT_ID, fieldName: SERVICE_NAME_LANG},
                {data: 'period', type: VALIDATION_TYPE_DATE, fieldName: PERIOD_LANG},
                {data: 'base', type: VALIDATION_TYPE_FLOAT, fieldName: SERVICE_CALC_BASE_LANG},
                {data: 'price', type: VALIDATION_TYPE_FLOAT, fieldName: TARIF_LANG},
                {data: 'sum', type: VALIDATION_TYPE_FLOAT, fieldName: SUM_LANG},
                {data: 'komment', type: VALIDATION_TYPE_EMPTY_STRING, fieldName: KOMMENT_LANG}
            ]}
        ];

        var isValid = validator.validate(validationData);
        this.errors = isValid ? '' : validator.getErrors();

        return isValid;
    };

    this.AccurringDocumentModel(params);
}