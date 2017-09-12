function GroundCardView() {
    AbstractView.call(this);
    this.template = '';

    this.buildTemplate = function (data) {
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        html += this.template;
        html += '</div>';

        return html;
    };
}