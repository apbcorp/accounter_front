function TarifsDocumentModel(params) {
    DocumentAbstractModel.call(this);
    this.baseUrl = '/api/v1.0/document/tarif';

    this.TarifsDocumentModel = function (object) {
        var date = new Date();

        this.defaultData.dateStart = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);

        this.DocumentAbstractModel(object);
    };

    this.TarifsDocumentModel(params);
}