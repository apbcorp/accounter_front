function AccurringDocumentModel(params) {
    DocumentAbstractModel.call(this);
    this.baseUrl = '/api/v1.0/document/tarif';

    this.AccurringDocumentModel = function (object) {
        this.DocumentAbstractModel(object);
    };

    this.AccurringDocumentModel(params);
}