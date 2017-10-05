function AccurringDocumentsModel(params) {
    DocumentsAbstractModel.call(this);

    this.url = '/api/v1.0/document/list/accurring';
    this.dataNames = {
        "id": RECORD_NUMBER_LANG,
        "created": DOCUMENT_DATE_LANG,
        "kontragent": KONTRAGENT_SERVICE_FULL_NAME_LANG
    };

    this.AccurringDocumentsModel = function (object) {
        this.DocumentsAbstractModel(object);
    };

    this.AccurringDocumentsModel(params);
}