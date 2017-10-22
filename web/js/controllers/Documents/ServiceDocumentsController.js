function ServiceDocumentsController() {
    AbstractDocumentsController.call(this);
    this.model = new ServiceDocumentsModel(this);
    this.cardPath = '/document/service/';
    this.viewName = 'view.serviceDocuments';

    this.AbstractDocumentsController();
}