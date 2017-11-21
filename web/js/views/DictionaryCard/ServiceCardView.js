function ServiceCardView() {
    AbstractCardView.call(this);
    this.template = '<compose type=template path=js/templates/Card/ServiceCardTemplate.html>';

    this.buildTemplate = function (data) {
        var container = kernel.getServiceContainer().get('container.collection');
        data['type'] = container.getDataForSelect('serviceTypes', data['type']);
        data['subtype'] = container.getDataForSelect('serviceSubtypes', data['subtype']);
        data['periodType'] = container.getDataForSelect('servicePeriodTypes', data['periodType']);
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        html += this.addData(this.template, data) + '</div>';

        return html;
    };
}