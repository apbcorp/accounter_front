function ConsumerCardModel(object) {
    AbstractCardModel.call(this);
    this.baseUrl = '/api/v1.0/dictionary/kontragent';

    this.AbstractCardModel(object);
}