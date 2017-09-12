function ServiceCardView() {
    AbstractView.call(this);
    this.template = '';

    this.buildTemplate = function (data) {
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        html += '</div>';

        return html;
    };
}