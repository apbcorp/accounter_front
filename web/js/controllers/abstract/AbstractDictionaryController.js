function AbstractDictionaryController() {
    MainControllerAbstract.call(this);
    this.model = null;
    this.cardPath = undefined;
    this.viewName = undefined;

    this.AbstractDictionaryController = function () {
        this.onAddRecordEvent = this.onAddRecord.bind(this);
        this.onEditRecordEvent = this.onEditRecord.bind(this);
        this.onDeleteRecordEvent = this.onDeleteRecord.bind(this);
        this.onSelectRecordEvent = this.onSelectRecord.bind(this);
        this.onSortRecordsEvent = this.onSortRecords.bind(this);
        this.onFilterRecordsEvent = this.onFilterRecords.bind(this);
        this.onClearFilterRecordsEvent = this.onClearFilters.bind(this);

        this.events.push({'selector': '.add_button', 'action': 'click', 'event': this.onAddRecordEvent});
        this.events.push({'selector': '.edit_button', 'action': 'click', 'event': this.onEditRecordEvent});
        this.events.push({'selector': '.delete_button', 'action': 'click', 'event': this.onDeleteRecordEvent});
        this.events.push({'selector': '.table_row', 'action': 'click', 'event': this.onSelectRecordEvent});
        this.events.push({'selector': '.table_row', 'action': 'dblclick', 'event': this.onEditRecordEvent});
        this.events.push({'selector': '.column_head', 'action': 'click', 'event': this.onSortRecordsEvent});
        this.events.push({'selector': '.filter_button', 'action': 'click', 'event': this.onFilterRecordsEvent});
        this.events.push({'selector': '.clear_filter_button', 'action': 'click', 'event': this.onClearFilterRecordsEvent});

        this.MainControllerAbstract();
    };

    this.init = function () {
        this.model.appendDataToRequest(kernel.getServiceContainer().get('helper.url').getUrlParamsObject(document.location.href));

        this.model.refresh();
    };

    this.onRefreshComplete = function (data) {
        var view = kernel.getServiceContainer().get(this.viewName);
        view.render(data);

        $('.paginator-button').on('click', this.pageChanged.bind(this));

        var eventContainer = kernel.getServiceContainer().get('container.event');
        eventContainer.setEvents(this.events);
    };

    this.onSortRecords = function (event) {
        var urlHelper = kernel.getServiceContainer().get('helper.url');
        this.model.appendDataToRequest({
            'order_by': event.currentTarget.dataset.name,
            'order_type': this.model.getRequestData('order_by') !== event.currentTarget.dataset.name
                ? 'desc'
                : this.model.getRequestData('order_type') === 'desc'
                ? 'asc'
                : 'desc'
        });

        kernel.getServiceContainer().get('helper.navigator').goTo(
            urlHelper.buildUrl(
                urlHelper.getCurrentUrlWithoutDomain(document.location.href),
                this.model.getRequestData()
            )
        );
    };

    this.onAddRecord = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo(this.cardPath + 'new.html')
    };

    this.onEditRecord = function (event) {
        var id = 0;
        if (event.currentTarget.class == 'table_row') {
            this.onSelectRecord(event);
            id = event.currentTarget.childNodes[0].innerHTML;
        } else {
            id = this.model.currentId;
        }

        if (this.model.currentId === undefined) {
            return;
        }

        kernel.getServiceContainer().get('helper.navigator').goTo(this.cardPath + id + '.html')
    };

    this.onDeleteRecord = function () {
        if (this.model.currentId === undefined) {
            return;
        }

        this.model.delete(this.cardPath + 'delete/' + this.model.currentId);
    };

    this.onSelectRecord = function (event) {
        if (this.model.currentId !== undefined) {
            var activeRow = $('.table_row[data-id="' + this.model.currentId + '"]');
            if (activeRow.length) {
                activeRow[0].classList.remove('active');
            }
        }
        this.model.currentId = event.currentTarget.dataset.id;

        event.currentTarget.classList.add('active');
    };

    this.pageChanged = function (event) {
        var urlHelper = kernel.getServiceContainer().get('helper.url');
        this.model.appendDataToRequest({
            'page': event.currentTarget.dataset.page
        });

        kernel.getServiceContainer().get('helper.navigator').goTo(
            urlHelper.buildUrl(
                urlHelper.getCurrentUrlWithoutDomain(document.location.href),
                this.model.getRequestData()
            )
        );
    };

    this.onFilterRecords = function () {
        var urlHelper = kernel.getServiceContainer().get('helper.url');
        var elements = $('input');

        var data = [];
        for (var i = 0; i < elements.length; i++) {
            data['filter[' + elements[i].name + ']'] = elements[i].value;
        }

        this.model.appendDataToRequest(data);

        kernel.getServiceContainer().get('helper.navigator').goTo(
            urlHelper.buildUrl(
                urlHelper.getCurrentUrlWithoutDomain(document.location.href),
                this.model.getRequestData()
            )
        );
    };

    this.onClearFilters = function () {
        var elements = $('input');

        for (var i = 0; i < elements.length; i++) {
            elements[i].value = '';
        }

        for (var key in this.model.filters) {
            this.model.filters[key].value = '';
        }
    }
}