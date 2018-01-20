function AbstractDocumentController() {
    AbstractCardController.call(this);

    this.AbstractDocumentController = function () {
        this.onAddRowEvent = this.onAddRow.bind(this);
        this.onDeleteRowEvent = this.onDeleteRow.bind(this);

        this.events.push({'selector': '.add_row_button', 'action': 'click', 'event': this.onAddRowEvent});
        this.events.push({'selector': '.delete_row_button', 'action': 'click', 'event': this.onDeleteRowEvent});

        this.AbstractCardController();
    };

    this.init = function (params) {
        this.model.requestData = {};
        if (params === undefined || params[0] === undefined || params[0] == 'new') {
            this.onRefreshComplete(this.model.defaultData);
            this.model.setId(0);

            return;
        }

        this.model.setId(params[0]);

        this.model.refresh();
    };

    this.onAddRow = function () {
        var view = kernel.getServiceContainer().get(this.viewName);
        var html = $(view.addData(view.rowTemplate, {}))[0];

        $('.subtable')[0].append(html);

        var eventContainer = kernel.getServiceContainer().get('container.event');
        eventContainer.setEvents(this.events);
    };

    this.onDeleteRow = function () {
        var elements = $('[name=checker]');
        var result = [];
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].checked) {
                result.push(elements[i]);
            }
        }

        if (!result.length) {
            alert('Нечего удалять. Пожалуйста, выделите строки.')

            return;
        }

        for (i = 0; i < result.length; i++) {
            result[i].parentElement.parentElement.remove()
        }
    };

    this.onAutoFill = function () {
        alert(1);
    };

    this.onAutoFillComplete = function () {

    };
}