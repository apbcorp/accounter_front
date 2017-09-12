function MeterDictionaryModel(params) {
    DictionaryAbstractModel.call(this);
    this.url = '/api/v1.0/meter';
    this.dataNames = {
        "id": "№ п/п",
        "number": "Номер счетчика",
        "type": "Тип счетчика",
        "ground": "Участок установки"
    };

    this.ServiceDictionaryModel = function (object) {
        this.DictionaryAbstractModel(object);
    };

    this.ServiceDictionaryModel(params);
}