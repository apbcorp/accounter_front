function PayDocumentsModel(params) {
    DocumentsAbstractModel.call(this);

    this.url = '/api/v1.0/document/list/pay';
    this.dataNames = {
        "id": RECORD_NUMBER_LANG,
        "date": DOCUMENT_DATE_LANG,
        "kontragent": KONTRAGENT_PAY_FULL_NAME_LANG
    };
    this.filters = {
        'period': {name: PERIOD_LANG, type:'period'},
        'kontragent': {name:KONTRAGENT_PAY_FULL_NAME_LANG, value:''}
    };

    this.PayDocumentsModel = function (object) {
        this.DocumentsAbstractModel(object);
    };

    this.PayDocumentsModel(params);
}