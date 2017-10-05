function MeterDocumentView() {
    AbstractDocumentView.call(this);
    this.template = '<compose type=template path=js/templates/Document/MeterDocumentTemplate.html>';
    this.rowTemplate = '<compose type=template path=js/templates/Document/MeterDocumentRowTemplate.html>';
    this.headTemplate = '<compose type=template path=js/templates/Document/MeterDocumentHeadTemplate.html>';
}