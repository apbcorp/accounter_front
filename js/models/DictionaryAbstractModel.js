function DictionaryAbstractModel() {
    AbstractModel.call(this);
    this.currentId = undefined;

    this.DictionaryAbstractModel = function (object) {
        this.AbstractModel(object);
    };

    this.appendDataToRequest = function (data) {
        for (var key in data) {
            this.requestData[key] = data[key];
        }
    };

    this.getDataForView = function () {
        var result = {
            'columns': this.dataNames,
            'data': this.data
        };
        if (this.getRequestData('order_by')) {
            result['orderBy'] = this.getRequestData('order_by');
        }
        if (this.getRequestData('order_type')) {
            result['orderType'] = this.getRequestData('order_type');
        }

        return result;
    };
}