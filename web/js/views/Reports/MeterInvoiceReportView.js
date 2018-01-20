function MeterInvoiceReportView() {
    AbstractCardView.call(this);

    this.buildTemplate = function (data) {
        var id = data.currentId;
        data = data.result;
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        if (data.id === undefined) {
            alert('Квитанция с таким номером не найдена');
        }

        html += '<div class="reportSheet"><li><ul><table><tr><td class="noprint">Номер квитанции&nbsp;<input class="meter-invoice" name="id" value="';
        html += id + '">&nbsp;&nbsp;<button class="submit">Сформировать</button></td></tr>';

        if (data.id === undefined) {
            html += '</table></div>';

            return html;
        }

        html += '<tr><td><table border="1" cellspacing="0">';

        html += '</table></td></tr>';
        html += '</table></div>';

        return html;
    }
}