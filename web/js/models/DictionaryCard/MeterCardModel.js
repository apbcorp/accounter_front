function MeterCardModel(object) {
    AbstractCardModel.call(this);
    this.baseUrl = '/api/v1.0/meter';

    this.AbstractCardModel(object);
}