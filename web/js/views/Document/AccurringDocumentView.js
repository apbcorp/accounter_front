function AccurringDocumentView() {
    AbstractDocumentView.call(this);
    this.template = '<compose type=template path=js/templates/Document/AccurringDocumentTemplate.html>';
    this.rowTemplate = '<compose type=template path=js/templates/Document/AccurringDocumentRowTemplate.html>';
    this.headTemplate = '<compose type=template path=js/templates/Document/AccurringDocumentHeadTemplate.html>';
}