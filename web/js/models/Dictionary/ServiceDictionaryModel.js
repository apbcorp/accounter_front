function ServiceDictionaryModel(params) {
    DictionaryAbstractModel.call(this);
    this.url = '/api/v1.0/dictionary/list/service';
    this.dataNames = {
        "id": RECORD_NUMBER_LANG,
        "name": SERVICE_NAME_LANG,
        "type": SERVICE_TYPE_LANG,
        "subtype": SERVICE_CALC_TYPE_BASE_LANG
    };

    this.ServiceDictionaryModel = function (object) {
        this.DictionaryAbstractModel(object);
    };

    this.ServiceDictionaryModel(params);
}