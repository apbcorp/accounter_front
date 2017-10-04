function TarifsDocumentsModel(params) {
    DocumentsAbstractModel.call(this);

    this.url = '/api/v1.0/document/list/tarif';
    this.dataNames = {
        "id": RECORD_NUMBER_LANG,
        "created": DOCUMENT_DATE_LANG,
        "dateStart": TARIFS_DATE_START_LANG
    };

    this.TarifsDocumentsModel = function (object) {
        this.DocumentsAbstractModel(object);
    };

    this.TarifsDocumentsModel(params);
}