function AbstractDocumentView() {
    AbstractCardView.call(this);
    this.rowTemplate = '';
    this.headTemplate = '';

    this.buildTemplate = function (data) {
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();

        data.table = this.generateTable(data);
        html += this.addData(this.template, data) + '</div>';

        return html;
    };

    this.generateTable = function (data) {
        var result = '<div class="table subtable"><ul><button class="add_button"></button><button class="delete_button"></button></ul>';
        result += this.addData(this.headTemplate, data);

        if (data.rows) {
            for (var i = 0; i < data.rows.length; i++) {
                result += this.addData(this.rowTemplate, data.rows[i]);
            }
        }

        result += '</div>';

        return result;
    }
}
