function LoginView() {
    AbstractView.call(this);
    this.template = '<compose type=template path=js/templates/LoginTemplate.html>';

    this.buildTemplate = function () {
        return this.template;
    };
}