function TableRowView() {
    this.template = [
        '<ul class="table_row" data-id="{id}">',
        '<li>',
        '</li>',
        '</ul>'
    ];

    this.buildTemplate = function (data, order) {
        var html = this.template[0].replace('{id}', data.id);

        for (var i = 0; i < order.length; i++) {
            html += this.template[1] + data[order[i]] + this.template[2];
        }

        html += this.template[3];

        return html;
    };
}