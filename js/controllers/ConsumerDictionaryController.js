function ConsumerDictionaryController() {
    AbstractDictionaryController.call(this);
    this.model = new ConsumerDictionaryModel(this);
    this.cardPath = '/dictionary/consumer/';
    this.viewName = 'view.consumerDictionary';

    this.AbstractDictionaryController();
}