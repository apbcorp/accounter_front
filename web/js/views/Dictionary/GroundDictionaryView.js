function GroundDictionaryView() {
    AbstractDictionaryView.call(this);
    this.buildTemplate = function (data) {
        for (var i = 0; i < data.data.result.length; i++) {
            var rows = data.data.result[i].rows;
            var number = [];
            var line = [];
            var ground = [];

            if (!rows) {
                data.data.result[i].number = '';
                data.data.result[i].line = '';
                data.data.result[i].groundNumber = '';

                continue;
            }

            if (rows.length == 1) {
                data.data.result[i].number = data.data.result[i].rows[0].number;
                data.data.result[i].line = data.data.result[i].rows[0].line;
                data.data.result[i].groundNumber = data.data.result[i].rows[0].groundNumber;

                continue;
            }

            for (var j = 0; j < rows.length; j++) {
                number.push(rows[j].number);
                line.push(rows[j].line);
                ground.push(rows[j].groundNumber);
            }

            data.data.result[i].number = number.join('<br>');
            data.data.result[i].line = line.join('<br>');
            data.data.result[i].groundNumber = ground.join('<br>');
        }

        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        html += kernel.getServiceContainer().get('view.table').buildTemplate(data);
        html += '</div>';

        return html;
    }
}