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

        if (data.filters) {
            html += this.showFilters(data.filters);
        }

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

    this.showFilters = function (filterList) {
        if (!Object.keys(filterList).length) {
            return '';
        }

        var result = '';
        for (key in filterList) {
            if (filterList[key].type == 'period') {
                if (!filterList[key].valueStart || !filterList[key].valueEnd) {
                    var date = new Date();
                    var dateHelper = kernel.getServiceContainer().get('helper.date');
                }
                
                var dateStart = filterList[key].periodStart ? filterList[key].periodStart : dateHelper.getFirstDayOfMonth(date);
                var dateEnd = filterList[key].periodEnd ? filterList[key].periodEnd : dateHelper.getLastDayOfMonth(date);
                result += '<ul>' + filterList[key].name + '&nbsp;<input type="date" name="' + key + 'Start" value="' + dateStart + '">&nbsp;<input type="date" name="' + key + 'End" value="' + dateEnd + '"></ul>';
            }
        }

        result += '<ul><button class="filter_button">Фильтровать</button>&nbsp;<button class="clear_filter_button">Очистить</button></ul>'

        return result;
    }
}