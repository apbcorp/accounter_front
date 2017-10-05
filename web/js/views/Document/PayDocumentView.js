function PayDocumentView() {
    AbstractDocumentView.call(this);
    this.template = '<compose type=template path=js/templates/Document/PayDocumentTemplate.html>';
    this.rowTemplate = '<compose type=template path=js/templates/Document/PayDocumentRowTemplate.html>';
    this.headTemplate = '<compose type=template path=js/templates/Document/PayDocumentHeadTemplate.html>';
}