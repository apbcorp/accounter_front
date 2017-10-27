function MeterServiceDocumentsModel(params) {
    DocumentsAbstractModel.call(this);

    this.url = '/api/v1.0/document/list/meter_service';
    this.dataNames = {
        "id": RECORD_NUMBER_LANG,
        "date": DOCUMENT_DATE_LANG,
        "ground": KONTRAGENT_ID_LANG
    };
    this.filters = {
        'period': {name: PERIOD_LANG, type:'period'},
        'ground': {name:KONTRAGENT_ID_LANG, value:''}
    };

    this.MeterServiceDocumentsModel = function (object) {
        this.DocumentsAbstractModel(object);
    };

    this.MeterServiceDocumentsModel(params);
}