function MeterServiceDocumentView() {
    AbstractDocumentView.call(this);
    this.template = '<compose type=template path=js/templates/Document/MeterServiceDocumentTemplate.html>';
    this.rowTemplate = '<compose type=template path=js/templates/Document/MeterServiceDocumentRowTemplate.html>';
    this.headTemplate = '<compose type=template path=js/templates/Document/MeterServiceDocumentHeadTemplate.html>';
}