function TableHeadView() {
    this.template = [
        '<ul class="table_head">',
        '<li class="column_head" data-name="{name}">',
        '<li class="column_head" data-name="{name}"><img class="order_image" src="/img/downarrow.png">',
        '<li class="column_head" data-name="{name}"><img class="order_image" src="/img/uparrow.png">',
        '</li>',
        '</ul>'
    ];

    this.buildTemplate = function (data, orderBy, orderType) {
        var html = this.template[0];
        var template = '';

        for (var key in data) {
            if (key === orderBy) {
                template = orderType === 'asc' ? this.template[2] : this.template[3];
            } else {
                template = this.template[1];
            }

            html += template.replace('{name}', key) + data[key] + this.template[4];
        }

        html += this.template[5];

        return html;
    };
}