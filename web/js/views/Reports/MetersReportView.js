function MetersReportView() {
    AbstractCardView.call(this);

    this.buildTemplate = function (data) {
        data = data.result;
        var i = 0;
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        var dateStart = kernel.getServiceContainer().get('helper.date').getDateFormatInput(data.additionalInfo.dateStart.date);
        var dateEnd = kernel.getServiceContainer().get('helper.date').getDateFormatInput(data.additionalInfo.dateEnd.date);
        html += '<div class="reportSheet"><li><ul><table><tr><td class="noprint">Пероид с <input type="date" name="dateStart" value="';
        html += dateStart + '"> по <input type="date" name="dateEnd" value="';
        html += dateEnd + '">&nbsp;&nbsp;<button class="submit">Сформировать</button></td></tr><tr><td><table border="1" cellspacing="0"><tr>';

        var columns = ['№', 'ФИО', 'Л/с', 'Тип', 'Номер', 'На начало периода', 'На конец периода']

        for (i = 0; i < columns.length; i++) {
            html += '<td class="head1">' + columns[i] + '</td>'
        }

        html += '</tr>';

        html += this.showRows(data.result);

        html += '</table></td></tr>';
        html += '</table></div>';

        return html;
    };

    this.showRows = function (data) {
        result = '';

        var rowInfo = {};
        var elements = [];
        var i = 1;
        for (var fio in data) {
            rowInfo = this.getRowInfo(data[fio]);
            elements['fio'] = '<td rowspan="' + rowInfo.count + '">' + i + '</td><td rowspan="' + rowInfo.count + '">' + fio + '</td>';
            for (var account in data[fio]) {
                elements['account'] = '<td rowspan="' + rowInfo.data[account].count + '">' + account + '</td>';
                for (var type in data[fio][account]) {
                    elements['type'] = '<td rowspan="' + rowInfo.data[account].data[type].count + '">' + type + '</td>';
                    for (var number in data[fio][account][type]) {
                        result += '<tr>' + elements['fio'] + elements['account'] + elements['type'];
                        result += '<td>' + number + '</td><td>' + data[fio][account][type][number]['dataStart'] + '</td><td>' + data[fio][account][type][number]['dataEnd'] + '</td></tr>';

                        elements['fio'] = '';
                        elements['account'] = '';
                        elements['type'] = '';
                        i++;
                    }
                }
            }
        }

        return result;
    };

    this.getRowInfo = function (data) {
        var result = {count: 0, data: []};

        for (var account in data) {
            result.data[account] = {count: 0, data: []};
            for (var type in data[account]) {
                result.data[account].data[type] = {count: 0, data: []};
                for (var number in data[account][type]) {
                    result.data[account].data[type].count++;
                    result.data[account].count++;
                    result.count++;
                }
            }
        }

        return result;
    };
}