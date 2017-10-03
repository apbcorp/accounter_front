function MeterCardView() {
    AbstractCardView.call(this);
    this.template = '<compose type=template path=js/templates/Card/MeterCardTemplate.html>';

    this.buildTemplate = function (data) {
        var container = kernel.getServiceContainer().get('container.collection');
        data['type'] = container.getDataForSelect('meterTypes', data['type']);
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        html += this.addData(this.template, data) + '</div>';

        return html;
    };
}