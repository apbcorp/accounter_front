function MainReportView() {
    AbstractCardView.call(this);

    this.buildTemplate = function (data) {
        data = data.result;
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        var dateStart = kernel.getServiceContainer().get('helper.date').getDateFormatInput(data.additionalInfo.dateStart.date);
        var dateEnd = kernel.getServiceContainer().get('helper.date').getDateFormatInput(data.additionalInfo.dateEnd.date);
        html += '<div class="reportSheet"><li><ul><table><tr><td class="noprint">Пероид с <input type="date" name="dateStart" value="';
        html += dateStart + '"> по <input type="date" name="dateEnd" value="';
        html += dateEnd + '">&nbsp;&nbsp;<button class="submit">Сформировать</button></td></tr><tr><td><table border="1" cellspacing="0">';

        var columns = ['№', 'ФИО', 'Л/с', '№ кур', 'Ряд', 'Место', 'Площадь', 'Не относится к земле причала', 'Площадь общего пользования', 'Всего площадь'];
        var payColumns = [];

        for (var key in data.services) {
            columns.push(data.services[key]);
            payColumns.push(key);
        }

        var head = [{name: '', cols: 2}, {name: 'Адрес:', cols: 4}, {name: 'Площадь:', cols: 4}, {name: 'Платежи:', cols: columns.length - 10}];

        html += this.showColumns(head, columns);

        html += this.showData(data.result, payColumns);

        html += '</table></td></tr>';
        html += this.showCalcTables();
        html += this.showNames();
        html += '</table></div>';

        return html;
    };

    this.showCalcTables = function () {
        var result = '<tr><td align="center"><table border="1" cellspacing="0"><tr><td colspan="3" class="head1">Расчет платы за землю</td></tr>';
        result += '<tr><td class="head1">Сумма аренды</td><td class="head1">Общая площадь</td><td class="head1">Цена за 1м.кв.</td></tr>';
        result += '<tr><td class="head1">433405.44</td><td class="head1">33942</td><td class="head1">12.769</td></tr></table></td></tr>';

        result += '<tr><td align="center"><table border="1" cellspacing="0"><tr><td colspan="5" class="head1">Расчет коэффициента для взноса на содержание причала</td></tr>';
        result += '<tr><td class="head1" colspan="2">Занимаемая площадь</td><td class="head1"></td><td class="head1" rowspan="2">Сумма взноса на<br>содерж. причала</td><td class="head1" rowspan="2">Коэффициент</td></tr>';
        result += '<tr><td class="head1">наша</td><td class="head1">порт</td><td class="head1">всего</td></tr>';
        result += '<tr><td class="head1">23742</td><td class="head1">980.2</td><td class="head1">24722.2</td><td class="head1">999086</td><td class="head1">40.4125</td></tr></table></td></tr>';

        return result;
    };

    this.showNames = function () {
        var result = '<tr style="height: 50px"><td></td></tr><tr><td><table width="100%">';
        result += '<tr><td width="50%">Начальник причала №114 "Бугово"</td><td>А. В. Григоращенко</td></tr>';
        result += '<tr><td width="50%">Зам. начальник причала №114 "Бугово"</td><td>В. В. Белашевский</td></tr>';
        result += '<tr><td width="50%">Кассир причала №114 "Бугово"</td><td>Н. М. Артемьева</td></tr>';
        result += '<tr><td width="50%">Главный бухгалтер ОО "ВМСООРЛ"</td><td>В. В. Обозовская</td></tr>';
        result += '</table></td></tr>';

        return result;
    };

    this.showColumns = function (heads, columns) {
        var result = '<tr>';

        for (var i = 0; i < heads.length; i++) {
            if (heads[i].cols) {
                result += '<td colspan="' + heads[i].cols + '" class="head1">' + heads[i].name + '</td>';
            }
        }

        result += '</tr><tr>';

        for (var i = 0; i < columns.length; i++) {
            result += '<td>' + columns[i] + '</td>';
        }

        result += '</tr>';

        return result;
    };

    this.showData = function (reportData, payColumns) {
        var result = '';
        var j = 0;
        var n = 0;
        var cell = '';

        var tag = '';
        for (var i = 0; i < reportData.length; i++) {
            if (reportData[i].house.length > 1) {
                tag = '<td rowspan="' + reportData[i].house.length + '">';
            } else {
                tag = '<td>';
            }

            result += '<tr>' + tag + (i + 1) + '</td>' + tag + reportData[i].kontragent + '</td><' + tag + reportData[i].account + '</td>';
            result += '<td>' + reportData[i].house[0].number + '</td><td>' + reportData[i].house[0].line + '</td><td>' + reportData[i].house[0].groundNumber + '</td>';
            result += tag + reportData[i].area + '</td>' + tag + reportData[i].freeArea + '</td>' + tag + reportData[i].commonArea + '</td>' + tag + reportData[i].allArea + '</td>';

            for (j = 0; j < payColumns.length; j++) {
                cell = tag + '0.00</td>';
                for (n = 0; n < reportData[i].services.length; n++) {
                    if (payColumns[j] == reportData[i].services[n].id) {
                        cell = tag + reportData[i].services[n].sum + '</td>';

                        break;
                    }
                }

                result += cell;
            }

            if (reportData[i].house.length > 1) {
                for (j = 1; j < reportData[i].house.length; j++) {
                    result += '</tr><tr><td>' + reportData[i].house[j].number + '</td><td>' + reportData[i].house[j].line + '</td><td>' + reportData[i].house[j].groundNumber + '</td>';
                }
            }

            result += '</tr>'
        }

        return result;
    }
}