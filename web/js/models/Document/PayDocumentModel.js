function PayDocumentModel(params) {
    DocumentAbstractModel.call(this);
    this.baseUrl = '/api/v1.0/document/pay';
    this.fillUrl = '/api/v1.0/document/fill_pays';

    this.PayDocumentModel = function (object) {
        var date = new Date();
        
        this.defaultData.date = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        
        this.DocumentAbstractModel(object);
    };

    this.isValidData = function (data) {
        var validator = kernel.getServiceContainer().get('service.validator');
        var validationData = [
            {data: data.date, type: VALIDATION_TYPE_DATE, fieldName: DOCUMENT_DATE_LANG},
            {data: data.kontragentId, type: VALIDATION_TYPE_OBJECT_ID, fieldName: OWNER_FULL_NAME_LANG},
            {data: data.rows, type: VALIDATION_TYPE_NOT_EMPTY_ARRAY, fieldName: SHEET_LANG},
            {data: data.rows, type: VALIDATION_TYPE_TABLE_ROWS, fieldName: '', subvalidation: [
                {data: 'serviceId', type: VALIDATION_TYPE_OBJECT_ID, fieldName: SERVICE_NAME_LANG},
                {data: 'groundId', type: VALIDATION_TYPE_OBJECT_ID, fieldName: KONTRAGENT_ID_LANG},
                {data: 'sum', type: VALIDATION_TYPE_FLOAT, fieldName: SUM_LANG}
            ]}
        ];

        var isValid = validator.validate(validationData);
        this.errors = isValid ? '' : validator.getErrors();

        return isValid;
    };

    this.fillDocument = function (id, date) {
        this.meterList = undefined;
        var requester = kernel.getServiceContainer().get('requester.ajax2');
        requester.setUrl(this.fillUrl);
        requester.setData({kontragentId: id, date: date});
        requester.setMethod(HTTP_METHOD_GET);
        requester.setSuccess(this.fillDocumentComplete.bind(this));
        requester.request();
    };

    this.fillDocumentComplete = function (data) {
        this.creator.fillDocument(data.result);
    };

    this.PayDocumentModel(params);
}