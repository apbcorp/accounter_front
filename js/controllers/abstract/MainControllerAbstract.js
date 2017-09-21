function MainControllerAbstract() {
    this.events = [];

    this.MainControllerAbstract = function () {
        this.onGetGroundDictionaryEvent = this.onGetGroundDictionary.bind(this);
        this.onGetMetersDictionaryEvent = this.onGetMetersDictionary.bind(this);
        this.onGetConsumerDictionaryEvent = this.onGetConsumerDictionary.bind(this);
        this.onGetServicesDictionaryEvent = this.onGetServicesDictionary.bind(this);
        this.onGetPayDocumentsEvent = this.onGetPayDocuments.bind(this);
        this.onGetAccuringDocumentsEvent = this.onGetAccurringDocuments.bind(this);
        this.onGetMetersDocumentsEvent = this.onGetMetersDocuments.bind(this);
        this.onGetTarifsDocumentsEvent = this.onGetTarifDocuments.bind(this);
        this.onGetMainReportEvent = this.onGetMainReport.bind(this);
        this.onGetMetersReportEvent = this.onGetMetersReport.bind(this);
        this.onGetBalanceReportEvent = this.onGetBalanceReport.bind(this);
        this.onGetSmsReportEvent = this.onGetSmsReport.bind(this);

        this.events.push({'selector': '.ground_dictionary_button', 'action': 'click', 'event': this.onGetGroundDictionaryEvent});
        this.events.push({'selector': '.services_dictionary_button', 'action': 'click', 'event': this.onGetServicesDictionaryEvent});
        this.events.push({'selector': '.meters_dictionary_button', 'action': 'click', 'event': this.onGetMetersDictionaryEvent});
        this.events.push({'selector': '.consumer_dictionary_button', 'action': 'click', 'event': this.onGetConsumerDictionaryEvent});
        this.events.push({'selector': '.pay_documents_button', 'action': 'click', 'event': this.onGetPayDocumentsEvent});
        this.events.push({'selector': '.accuring_documents_button', 'action': 'click', 'event': this.onGetAccuringDocumentsEvent});
        this.events.push({'selector': '.meters_documents_button', 'action': 'click', 'event': this.onGetMetersDocumentsEvent});
        this.events.push({'selector': '.tarifs_documents_button', 'action': 'click', 'event': this.onGetTarifsDocumentsEvent});
        this.events.push({'selector': '.main_report_button', 'action': 'click', 'event': this.onGetMainReportEvent});
        this.events.push({'selector': '.meters_report_button', 'action': 'click', 'event': this.onGetMetersReportEvent});
        this.events.push({'selector': '.balance_report_button', 'action': 'click', 'event': this.onGetBalanceReportEvent});
        this.events.push({'selector': '.sms_report_button', 'action': 'click', 'event': this.onGetSmsReportEvent});
    };

    this.onGetConsumerDictionary = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/dictionary/consumers.html');
    };

    this.onGetGroundDictionary = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/dictionary/grounds.html');
    };

    this.onGetMetersDictionary = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/dictionary/meters.html');
    };

    this.onGetServicesDictionary = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/dictionary/services.html');
    };

    this.onGetPayDocuments = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/document/pays.html');
    };

    this.onGetAccurringDocuments = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/document/accurring.html');
    };

    this.onGetMetersDocuments = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/document/meters.html');
    };

    this.onGetTarifDocuments = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/document/tarifs.html');
    };

    this.onGetMainReport = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/report/main.html');
    };

    this.onGetMetersReport = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/report/meters.html');
    };

    this.onGetBalanceReport = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/report/balance.html');
    };

    this.onGetSmsReport = function () {
        kernel.getServiceContainer().get('helper.navigator').goTo('/report/sms.html');
    };
}