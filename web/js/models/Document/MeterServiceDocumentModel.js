function MeterServiceDocumentModel(params) {
    DocumentAbstractModel.call(this);
    this.baseUrl = '/api/v1.0/document/meter_service';
    this.groundId = 0;
    this.meterList = undefined;
    this.meterListUrl = '/api/v1.0/dictionary/meter_by_ground/';

    this.MeterServiceDocumentModel = function (object) {
        var date = new Date();

        this.groundId = 0;
        this.defaultData.date = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);

        this.DocumentAbstractModel(object);
    };

    this.isValidData = function (data) {
        var validator = kernel.getServiceContainer().get('service.validator');
        var validationData = [
            {data: data.date, type: VALIDATION_TYPE_DATE, fieldName: DOCUMENT_DATE_LANG},
            {data: data.groundId, type: VALIDATION_TYPE_OBJECT_ID, fieldName: KONTRAGENT_ID_LANG},
            {data: data.rows, type: VALIDATION_TYPE_NOT_EMPTY_ARRAY, fieldName: SHEET_LANG},
            {data: data.rows, type: VALIDATION_TYPE_TABLE_ROWS, fieldName: '', subvalidation: [
                {data: 'serviceId', type: VALIDATION_TYPE_OBJECT_ID, fieldName: SERVICE_NAME_LANG},
                {data: 'meterId', type: VALIDATION_TYPE_OBJECT_ID, fieldName: METER_NUMBER_LANG},
                {data: 'date', type: VALIDATION_TYPE_DATE, fieldName: PERIOD_LANG},
                {data: 'startData', type: VALIDATION_TYPE_FLOAT, fieldName: START_VALUE_LANG},
                {data: 'endData', type: VALIDATION_TYPE_FLOAT, fieldName: END_VALUE_LANG},
                {data: 'price', type: VALIDATION_TYPE_FLOAT, fieldName: TARIF_LANG},
                {data: 'sum', type: VALIDATION_TYPE_FLOAT, fieldName: SUM_LANG}
            ]}
        ];

        var isValid = validator.validate(validationData);
        this.errors = isValid ? '' : validator.getErrors();

        return isValid;
    };

    this.fillMeterList = function (id) {
        if (this.groundId == id) {
            return;
        }
        this.meterList = undefined;
        var requester = kernel.getServiceContainer().get('requester.ajax2');
        requester.setUrl(this.meterListUrl + id);
        requester.setData({});
        requester.setMethod(HTTP_METHOD_GET);
        requester.setSuccess(this.setMeterList.bind(this));
        requester.request();
    };

    this.setMeterList = function (data) {
        data = data.result;

        if (data && data[0].groundId) {
            this.groundId = data[0].groundId;
        }
        
        this.meterList = [];
        for (var i = 0; i < data.length; i++) {
            this.meterList[data[i].id] = data[i].number + '(' + data[i].type + ')';
        }

        var rows = $('.table_row');
        var list = '';
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].childNodes[2].childNodes[0].dataset.id == 'null') {
                continue;
            }

            list = this.generateMeterList(rows[i].childNodes[2].childNodes[0].dataset.id);
            rows[i].childNodes[2].childNodes[0].innerHTML = list;
        }
    };

    this.generateMeterList = function (id) {
        var result = '';
        var list = this.meterList;
        for (var key in list) {
            result += '<option value="' + key + '"' + (key == id ? ' selected' : '') + '>' + list[key] + '</option>';
        }

        return result;
    };

    this.fillRow = function (date, meterId, serviceId) {
        var requester = kernel.getServiceContainer().get('requester.ajax');
        requester.setUrl('/api/v1.0/document/fill_meter_service_row');
        requester.setData({date: date, meterId: meterId, serviceId:serviceId});
        requester.setMethod(HTTP_METHOD_GET);
        requester.setSuccess(this.setRowData.bind(this));
        requester.request();
    };

    this.fillAllRows = function (date, groundId) {
        var requester = kernel.getServiceContainer().get('requester.ajax');
        requester.setUrl('/api/v1.0/document/fill_meter_service');
        requester.setData({date: date, groundId: groundId});
        requester.setMethod(HTTP_METHOD_GET);
        requester.setSuccess(this.creator.onAutoFillComplete.bind(this.creator));
        requester.request();
    };

    this.setRowData = function (data) {
        data = data.result;

        var rows = $('.table_row');
        var sum = '';
        var row = '';
        var date = '';
        var meterId = '';
        var dateHelper = kernel.getServiceContainer().get('helper.date');

        for (var i = 0; i < rows.length; i++) {
            date = rows[i].childNodes[3].childNodes[0].value;
            meterId = parseInt(rows[i].childNodes[2].childNodes[0].value);
            sum = rows[i].childNodes[7].childNodes[0].value;

            if (dateHelper.isEqualDate(date, data.date) && meterId == data.meterId && !sum) {
                row = rows[i];
            }
        }

        if (!row) {
            return;
        }

        row.childNodes[4].childNodes[0].value = data.startData;
        row.childNodes[5].childNodes[0].value = data.endData;
        row.childNodes[6].childNodes[0].value = data.price;
        row.childNodes[7].childNodes[0].value = data.sum;
    };

    this.MeterServiceDocumentModel(params);
}