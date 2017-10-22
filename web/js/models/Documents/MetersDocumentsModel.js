function MetersDocumentsModel(params) {
    DocumentsAbstractModel.call(this);

    this.url = '/api/v1.0/document/list/meter';
    this.dataNames = {
        "id": RECORD_NUMBER_LANG,
        "date": DOCUMENT_DATE_LANG
    };
    this.filters = {
        'period': {name: PERIOD_LANG, type:'period'}
    };

    this.MetersDocumentsModel = function (object) {
        this.DocumentsAbstractModel(object);
    };

    this.MetersDocumentsModel(params);
}