function TarifsDocumentView() {
    AbstractDocumentView.call(this);
    this.template = '<compose type=template path=js/templates/Document/TarifsDocumentTemplate.html>';
    this.rowTemplate = '<compose type=template path=js/templates/Document/TarifsDocumentRowTemplate.html>';
    this.headTemplate = '<compose type=template path=js/templates/Document/TarifsDocumentHeadTemplate.html>';
}