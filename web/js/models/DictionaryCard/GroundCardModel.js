function GroundCardModel(object) {
    AbstractCardModel.call(this);
    this.baseUrl = '/api/v1.0/dictionary/ground';
    this.collectionFields = {
        kontragent: {
            id: 'kontragentId',
            name: 'owner'
        }
    };

    this.AbstractCardModel(object);
}