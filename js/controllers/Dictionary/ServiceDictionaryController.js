function ServiceDictionaryController() {
    AbstractDictionaryController.call(this);
    this.model = new ServiceDictionaryModel(this);
    this.cardPath = '/dictionary/service/';
    this.viewName = 'view.serviceDictionary';

    this.AbstractDictionaryController();
}