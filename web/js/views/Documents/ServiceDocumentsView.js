function ServiceDocumentsView() {
    AbstractDocumentsView.call(this);

    this.buildTemplate = function (data) {
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();

        var urlHelper = kernel.getServiceContainer().get('helper.url');
        for (var key in data.data.result) {
            data.data.result[key].doc = '<a href="' + urlHelper.getDomain(window.location.href) + '/report/invoice.html?id=' + data.data.result[key].id + '">' + data.columns.doc + '</a>';
            data.data.result[key].docSoc = '<a href="' + urlHelper.getDomain(window.location.href) + '/report/social_invoice.html?id=' + data.data.result[key].id + '">' + data.columns.docSoc + '</a>';
        }
        html += kernel.getServiceContainer().get('view.table').buildTemplate(data);
        html += '</div>';

        return html;
    };
}