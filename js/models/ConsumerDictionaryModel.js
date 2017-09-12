function ConsumerDictionaryModel(params) {
    DictionaryAbstractModel.call(this);
    this.url = '/api/v1.0/consumer';
    this.dataNames = {
        "id": "№ п/п",
        "surname": "Фамилия",
        "name": "Имя",
        "name2": "Отчество",
        "phone": "Телефон",
        "adress": "Адрес"
    };

    this.ConsumerDictionaryModel = function (object) {
        this.DictionaryAbstractModel(object);
    };

    this.ConsumerDictionaryModel(params);
}