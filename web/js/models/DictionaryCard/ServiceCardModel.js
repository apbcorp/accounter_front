function ServiceCardModel(object) {
    AbstractCardModel.call(this);
    this.baseUrl = '/api/v1.0/dictionary/service';

    this.AbstractCardModel(object);
}