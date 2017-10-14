function TableView() {
    this.template = [
        '<div class="sheet"><li>',
        '',
        '<ul><button class="add_button"></button><button class="edit_button"></button><button class="delete_button"></button></ul>',
        '<ul><div class="table">',
        '</div></ul>',
        '</li><div>'
    ];

    this.buildTemplate = function (data) {
        var html = data.isSubview === undefined || data.isSubview === false ? this.template[0] : this.template[1];

        if (data.hideButtons === undefined || data.hideButtons === false) {
            html += this.template[2];
        }

        html += this.template[3];
        html += kernel.getServiceContainer().get('view.tableHead').buildTemplate(data.columns, data.orderBy, data.orderType);

        for (var i = 0; i < data.data.result.length; i++) {
            html += kernel.getServiceContainer().get('view.tableRow').buildTemplate(data.data.result[i], Object.keys(data.columns));
        }

        html += this.template[4];

        html += kernel.getServiceContainer().get('view.tablePaginator').buildTemplate(data.data) + this.template[5];

        return html;
    };
}