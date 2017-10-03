function MeterDictionaryModel(params) {
    DictionaryAbstractModel.call(this);
    this.url = '/api/v1.0/dictionary/list/meter';
    this.dataNames = {
        "id": RECORD_NUMBER_LANG,
        "number": METER_NUMBER_LANG,
        "type": METER_TYPE_LANG,
        "ground": METER_GROUND_OWNER_LANG
    };

    this.ServiceDictionaryModel = function (object) {
        this.DictionaryAbstractModel(object);
    };

    this.ServiceDictionaryModel(params);
}