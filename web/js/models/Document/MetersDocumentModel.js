function MetersDocumentModel(params) {
    DocumentAbstractModel.call(this);
    this.baseUrl = '/api/v1.0/document/meter';

    this.MetersDocumentModel = function (object) {
        this.DocumentAbstractModel(object);
    };

    this.MetersDocumentModel(params);
}