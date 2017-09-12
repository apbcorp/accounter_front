function ServiceDictionaryModel(params) {
    DictionaryAbstractModel.call(this);
    this.url = '/api/v1.0/service';
    this.dataNames = {
        "id": "№ п/п",
        "name": "Название услуги",
        "type": "Тип потребителя услуги",
        "subtype": "Тип базы для расчета"
    };

    this.ServiceDictionaryModel = function (object) {
        this.DictionaryAbstractModel(object);
    };

    this.ServiceDictionaryModel(params);
}