function TableView() {
    this.template = [
        '<div class="sheet"><li><ul><button class="add_button"></button><button class="edit_button"></button><button class="delete_button"></button></ul><ul><div class="table">',
        '</div></ul></li></div>'
    ];

    this.buildTemplate = function (data) {
        var html = this.template[0];
        html += kernel.getServiceContainer().get('view.tableHead').buildTemplate(data.columns, data.orderBy, data.orderType);

        for (var i = 0; i < data.data.length; i++) {
            html += kernel.getServiceContainer().get('view.tableRow').buildTemplate(data.data[i], Object.keys(data.columns));
        }

        html += this.template[1];

        return html;
    };
}