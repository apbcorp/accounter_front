function ConsumerCardView() {
    AbstractView.call(this);
    this.template = '<div class="sheet"><ul><button class="save_button"></button><button class="cancel_button"></button></ul><ul class="card_row"><li class="card_cell">{SURNAME_LANG}<input name="surname" value="{surname}"></li><li class="card_cell">{NAME_LANG}<input name="name" value="{name}"></li></ul><ul class="card_row"><li class="card_cell">{NAME2_LANG}<input name="name2" value="{name2}"></li><li class="card_cell">{PHONE_LANG}<input name="phone" value="{phone}"></li></ul><ul class="card_row"><li class="card_cell_full">{ADRESS_LANG}<input name="adress" value="{adress}" size="100"></li></ul></ul><div class="table_ground"></div></div>';

    this.buildTemplate = function (data) {
        var html = '<div>' + kernel.getServiceContainer().get('view.main').buildTemplate();
        html += this.addData(this.template, data) + '</div>';

        return html;
    };

    this.addData = function (template, data) {
        for (var key in data) {
            template = template.replace('{' + key + '}', data[key]);
        }

        template = this.addLangs(template);

        return template;
    };

    this.addLangs = function (template) {
        var matches = template.match(/{.*?}/g);

        if (!matches.length) {
            return template;
        }

        var key = '';
        for (var i = 0; i < matches.length; i++) {
            key = matches[i].replace('{', '').replace('}', '');
            if (/_LANG/.test(key)) {
                template = template.replace(matches[i], window[key] === undefined ? key : window[key]);
            } else {
                template = template.replace(matches[i], '');
            }
        }

        return template;
    };
}