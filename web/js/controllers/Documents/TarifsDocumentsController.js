function TarifsDocumentsController() {
    AbstractDocumentsController.call(this);
    this.model = new TarifsDocumentsModel(this);
    this.cardPath = '/document/tarifs/';
    this.viewName = 'view.tarifsDocuments';

    this.AbstractDocumentsController();
}