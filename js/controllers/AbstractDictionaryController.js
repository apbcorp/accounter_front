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

        this.events.push({'selector': '.add_button', 'action': 'click', 'event': this.onAddRecordEvent});
        this.events.push({'selector': '.edit_button', 'action': 'click', 'event': this.onEditRecordEvent});
        this.events.push({'selector': '.delete_button', 'action': 'click', 'event': this.onDeleteRecordEvent});
        this.events.push({'selector': '.table_row', 'action': 'click', 'event': this.onSelectRecordEvent});
        this.events.push({'selector': '.table_row', 'action': 'dblclick', 'event': this.onEditRecordEvent});
        this.events.push({'selector': '.column_head', 'action': 'click', 'event': this.onSortRecordsEvent});


        this.MainControllerAbstract();
    };

    this.init = function () {
        this.model.appendDataToRequest(kernel.getServiceContainer().get('helper.url').getUrlParamsObject(document.location.href));

        this.model.refresh();
    };

    this.onRefreshComplete = function (data) {
        var view = kernel.getServiceContainer().get(this.viewName);
        view.render(data);

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
        alert('add');
    };

    this.onEditRecord = function (event) {
        if (event.currentTarget.class == 'table_row') {
            this.onSelectRecord(event);
        }

        if (this.model.currentId === undefined) {
            return;
        }

        kernel.getServiceContainer().get('helper.navigator').goTo(this.cardPath + this.model.currentId + '.html')
    };

    this.onDeleteRecord = function () {
        if (this.model.currentId === undefined) {
            return;
        }

        alert(this.model.currentId);
    };

    this.onSelectRecord = function (event) {
        if (this.model.currentId !== undefined) {
            $('.table_row[data-id="' + this.model.currentId + '"]')[0].classList.remove('active');
        }
        this.model.currentId = event.currentTarget.dataset.id;

        event.currentTarget.classList.add('active');
    };
}