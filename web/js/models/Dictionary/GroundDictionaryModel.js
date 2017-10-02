function GroundDictionaryModel(params) {
    DictionaryAbstractModel.call(this);
    this.url = '/api/v1.0/list/ground';
    this.dataNames = {
        "id": RECORD_NUMBER_LANG,
        "accNumber": ACCOUNT_NUMBER_LANG,
        "number": NUMBER_LANG,
        "line": GROUND_LINE_LANG,
        "groundNumber": GROUND_NUMBER_LANG,
        "area": GROUND_AREA_LANG,
        "freeArea": GROUND_FREE_AREA_LANG,
        "commonArea": GROUND_COMMON_AREA_LANG,
        "allArea": GROUND_ALL_AREA_LANG,
        "owner": OWNER_FULL_NAME_LANG
    };

    this.GroundDictionaryModel = function (object) {
        this.DictionaryAbstractModel(object);
    };

    this.GroundDictionaryModel(params);
}