function MainView() {
    AbstractView.call(this);
    this.template = '<compose type=template path=js/templates/MainTemplate.html>';

    this.buildTemplate = function () {
        return this.template;
    };
}