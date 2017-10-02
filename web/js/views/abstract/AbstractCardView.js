function AbstractCardView() {
    AbstractView.call(this);

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