function ConsumerCardModel(object) {
    AbstractCardModel.call(this);
    this.baseUrl = '/api/v1.0/kontragent';

    this.AbstractCardModel(object);
}