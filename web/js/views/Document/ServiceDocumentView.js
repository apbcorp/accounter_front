function ServiceDocumentView() {
    AbstractDocumentView.call(this);
    this.template = '<compose type=template path=js/templates/Document/ServiceDocumentTemplate.html>';
    this.rowTemplate = '<compose type=template path=js/templates/Document/ServiceDocumentRowTemplate.html>';
    this.headTemplate = '<compose type=template path=js/templates/Document/ServiceDocumentHeadTemplate.html>';
}