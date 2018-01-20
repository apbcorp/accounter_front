function BalanceReportView() {
    AbstractCardView.call(this);

    this.buildTemplate = function (data) {
        data = data.result;
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        var dateStart = kernel.getServiceContainer().get('helper.date').getDateFormatInput(data.additionalInfo.dateStart.date);
        var dateEnd = kernel.getServiceContainer().get('helper.date').getDateFormatInput(data.additionalInfo.dateEnd.date);
        html += '<div class="reportSheet"><li><ul><table><tr><td class="noprint">Пероид с <input type="date" name="dateStart" value="';
        html += dateStart + '"> по <input type="date" name="dateEnd" value="';
        html += dateEnd + '">&nbsp;&nbsp;<button class="submit">Сформировать</button></td></tr><tr><td><table border="1" cellspacing="0"><tr>';

        var columns = ['№', 'ФИО', 'Л/с', 'Услуга', 'На начало периода', 'Начисленнло', 'Оплаченно', 'На конец периода'];

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
                for (var service in data[fio][account]) {
                    result += '<tr>' + elements['fio'] + elements['account'];
                    result += '<td>' + service + '</td><td>' + data[fio][account][service]['startData'] + '</td><td>' + data[fio][account][service]['out'] + '</td><td>' + data[fio][account][service]['in'] + '</td><td>' + data[fio][account][service]['endData'] + '</td></tr>';

                    elements['fio'] = '';
                    elements['account'] = '';
                    i++;
                }
            }
        }

        return result;
    };

    this.getRowInfo = function (data) {
        var result = {count: 0, data: []};

        for (var account in data) {
            result.data[account] = {count: 0, data: []};
            for (var service in data[account]) {
                result.data[account].count++;
                result.count++;
            }
        }

        return result;
    };
}