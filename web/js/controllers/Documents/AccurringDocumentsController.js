function AccurringDocumentsController() {
    AbstractDocumentsController.call(this);
    this.model = new AccurringDocumentsModel(this);
    this.cardPath = '/document/accurring/';
    this.viewName = 'view.accurringDocuments';

    this.AbstractDocumentsController();
}