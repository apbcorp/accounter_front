function PayDocumentsController() {
    AbstractDocumentsController.call(this);
    this.model = new PayDocumentsModel(this);
    this.cardPath = '/document/pays/';
    this.viewName = 'view.paysDocuments';

    this.AbstractDocumentsController();
}
