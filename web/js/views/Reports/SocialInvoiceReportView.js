function SocialInvoiceReportView() {
    AbstractCardView.call(this);

    this.buildTemplate = function (data) {
        data = data.result;
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        var id = 1;
        if (data.id === undefined) {
            alert('Квитанция с таким номером не найдена');
        } else {
            id = data.id;
        }

        html += '<div class="reportSheet"><li><ul><table><tr><td class="noprint">Номер квитанции&nbsp;<input name="id" value="';
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