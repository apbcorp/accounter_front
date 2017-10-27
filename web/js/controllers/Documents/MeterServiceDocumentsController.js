function MeterServiceDocumentsController() {
    AbstractDocumentsController.call(this);
    this.model = new MeterServiceDocumentsModel(this);
    this.cardPath = '/document/meter_service/';
    this.viewName = 'view.meterServiceDocuments';

    this.AbstractDocumentsController();
}