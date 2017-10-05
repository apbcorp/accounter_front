function PayDocumentModel(params) {
    DocumentAbstractModel.call(this);
    this.baseUrl = '/api/v1.0/document/tarif';

    this.PayDocumentModel = function (object) {
        this.DocumentAbstractModel(object);
    };

    this.PayDocumentModel(params);
}