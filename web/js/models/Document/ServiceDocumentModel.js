function ServiceDocumentModel(params) {
    DocumentAbstractModel.call(this);
    this.baseUrl = '/api/v1.0/document/service_document';
    this.groundList = undefined;
    this.groundListUrl = '/api/v1.0/dictionary/ground_by_kontragent/';

    this.ServiceDocumentModel = function (object) {
        var date = new Date();

        this.defaultData.date = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        
        this.DocumentAbstractModel(object);
    };

    this.isValidData = function (data) {
        var validator = kernel.getServiceContainer().get('service.validator');
        var validationData = [
            {data: data.date, type: VALIDATION_TYPE_DATE, fieldName: DOCUMENT_DATE_LANG},
            {data: data.kontragentId, type: VALIDATION_TYPE_OBJECT_ID, fieldName: KONTRAGENT_ID_LANG},
            {data: data.rows, type: VALIDATION_TYPE_NOT_EMPTY_ARRAY, fieldName: SHEET_LANG},
            {data: data.rows, type: VALIDATION_TYPE_TABLE_ROWS, fieldName: '', subvalidation: [
                {data: 'serviceId', type: VALIDATION_TYPE_OBJECT_ID, fieldName: SERVICE_NAME_LANG},
                {data: 'date', type: VALIDATION_TYPE_DATE, fieldName: PERIOD_LANG},
                {data: 'count', type: VALIDATION_TYPE_FLOAT, fieldName: SERVICE_CALC_BASE_LANG},
                {data: 'price', type: VALIDATION_TYPE_FLOAT, fieldName: TARIF_LANG},
                {data: 'sum', type: VALIDATION_TYPE_FLOAT, fieldName: SUM_LANG}
            ]}
        ];

        var isValid = validator.validate(validationData);
        this.errors = isValid ? '' : validator.getErrors();

        return isValid;
    };

    this.fillGroundList = function (id) {
        this.groundList = undefined;
        var requester = kernel.getServiceContainer().get('requester.ajax2');
        requester.setUrl(this.groundListUrl + id);
        requester.setData({});
        requester.setMethod(HTTP_METHOD_GET);
        requester.setSuccess(this.setGroundList.bind(this));
        requester.request();
    };

    this.setGroundList = function (data) {
        data = data.result;

        this.groundList = [];
        for (var i = 0; i < data.length; i++) {
            this.groundList[data[i].id] = data[0].accNumber;
        }

        var rows = $('.table_row');
        var list = '';
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].childNodes[2].childNodes[0].dataset.id == 'null') {
                continue;
            }

            list = this.generateGroundList(rows[i].childNodes[2].childNodes[0].dataset.id);
            rows[i].childNodes[2].childNodes[0].innerHTML = list;
        }
    };

    this.generateGroundList = function (id) {
        var result = '';
        var list = this.groundList;
        for (var key in list) {
            result += '<option value="' + key + '"' + (key == id ? ' selected' : '') + '>' + list[key] + '</option>';
        }

        return result;
    };

    this.fillRow = function (date, kontragentId, groundId, serviceId) {
        var requester = kernel.getServiceContainer().get('requester.ajax');
        requester.setUrl('/api/v1.0/document/fill_service_row');
        requester.setData({date: date, groundId: groundId, serviceId:serviceId});
        requester.setMethod(HTTP_METHOD_GET);
        requester.setSuccess(this.setRowData.bind(this));
        requester.request();
    };

    this.fillAllRows = function (date, kontragentId) {
        var requester = kernel.getServiceContainer().get('requester.ajax');
        requester.setUrl('/api/v1.0/document/fill_service');
        requester.setData({date: date, kontragentId: kontragentId});
        requester.setMethod(HTTP_METHOD_GET);
        requester.setSuccess(this.creator.onAutoFillComplete.bind(this.creator));
        requester.request();
    };

    this.setRowData = function (data) {
        data = data.result;

        var rows = $('.table_row');
        var rowService = '';
        var sum = '';
        var row = '';
        var date = '';
        var dateHelper = kernel.getServiceContainer().get('helper.date');

        for (var i = 0; i < rows.length; i++) {
            rowService = parseInt(rows[i].childNodes[1].childNodes[0].childNodes[0].dataset.id);
            date = rows[i].childNodes[3].childNodes[0].value;
            sum = rows[i].childNodes[6].childNodes[0].value;

            if (rowService == data.serviceId && dateHelper.isEqualDate(date, data.date.date) && !sum) {
                if (!data.groundId) {
                    row = rows[i];
                } else {
                    if (rows[i].childNodes[2].childNodes[0].value == data.groundId) {
                        row = rows[i];
                    }
                }
            }
        }

        if (!row) {
            return;
        }

        row.childNodes[2].childNodes[0].value = data.groundId;
        row.childNodes[4].childNodes[0].value = data.count;
        row.childNodes[5].childNodes[0].value = data.price;
        row.childNodes[6].childNodes[0].value = data.sum;
    };

    this.ServiceDocumentModel(params);
}