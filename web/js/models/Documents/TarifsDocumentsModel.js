function TarifsDocumentsModel(params) {
    DocumentAbstractModel.call(this);

    this.url = '/api/v1.0/document/list/tarif';
    this.dataNames = {
        "id": RECORD_NUMBER_LANG,
        "date": DOCUMENT_DATE_LANG,
        "dateStart": TARIFS_DATE_START_LANG
    };

    this.TarifsDocumentsModel = function (object) {
        this.DocumentAbstractModel(object);
    };

    this.TarifsDocumentsModel(params);
}