function AccurringDocumentsModel(params) {
    DocumentsAbstractModel.call(this);

    this.url = '/api/v1.0/document/list/accurring';
    this.dataNames = {
        "id": RECORD_NUMBER_LANG,
        "date": DOCUMENT_DATE_LANG,
        "ground": KONTRAGENT_ID_LANG
    };

    this.AccurringDocumentsModel = function (object) {
        this.DocumentsAbstractModel(object);
    };

    this.AccurringDocumentsModel(params);
}