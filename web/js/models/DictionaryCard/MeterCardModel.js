function MeterCardModel(object) {
    AbstractCardModel.call(this);
    this.baseUrl = '/api/v1.0/dictionary/meter';

    this.AbstractCardModel(object);
}