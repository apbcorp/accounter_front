function ServiceCardModel(object) {
    AbstractCardModel.call(this);
    this.baseUrl = '/api/v1.0/service';

    this.AbstractCardModel(object);
}