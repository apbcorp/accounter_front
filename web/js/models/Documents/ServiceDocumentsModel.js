function ServiceDocumentsModel(params) {
    DocumentsAbstractModel.call(this);

    this.url = '/api/v1.0/document/list/service_document';
    this.dataNames = {
        "id": RECORD_NUMBER_LANG,
        "date": DOCUMENT_DATE_LANG,
        "ground": KONTRAGENT_ID_LANG
    };

    this.ServiceDocumentsModel = function (object) {
        this.DocumentsAbstractModel(object);
    };

    this.ServiceDocumentsModel(params);
}