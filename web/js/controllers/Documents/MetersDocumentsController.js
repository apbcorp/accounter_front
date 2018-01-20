function MetersDocumentsController() {
    AbstractDocumentsController.call(this);
    this.model = new MetersDocumentsModel(this);
    this.cardPath = '/document/meters/';
    this.viewName = 'view.metersDocuments';
    this.apiPath = '/document/meter/';

    this.AbstractDocumentsController();
}