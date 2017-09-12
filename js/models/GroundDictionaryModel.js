function GroundDictionaryModel(params) {
    DictionaryAbstractModel.call(this);
    this.url = '/api/v1.0/ground';
    this.dataNames = {
        "id": "№ п/п",
        "accNumber": "№ счета",
        "line": "Линия",
        "groundNumber": "Номер участка",
        "area": "Занимаемая площадь, кв. м.",
        "freeArea": "Не относящаяся к причалу площадь, кв. м.",
        "commonArea": "Площадь общего пользования, кв. м.",
        "allArea": "Всего площадь, кв. м.",
        "owner": "Собственник"
    };

    this.GroundDictionaryModel = function (object) {
        this.DictionaryAbstractModel(object);
    };

    this.GroundDictionaryModel(params);
}