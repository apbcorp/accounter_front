function ServiceDocumentsModel(params) {
    DocumentsAbstractModel.call(this);

    this.url = '/api/v1.0/document/list/service_document';
    this.dataNames = {
        "id": RECORD_NUMBER_LANG,
        "date": DOCUMENT_DATE_LANG,
        "kontragent": OWNER_FULL_NAME_LANG
    };
    this.filters = {
        'period': {name: PERIOD_LANG, type:'period'},
        'kontragent': {name:OWNER_FULL_NAME_LANG, value:''}
    };

    this.ServiceDocumentsModel = function (object) {
        this.DocumentsAbstractModel(object);
    };

    this.ServiceDocumentsModel(params);
}