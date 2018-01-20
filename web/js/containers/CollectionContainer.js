function CollectionContainer() {
    this.data = collections;
    this.event = undefined;
    this.thisCollection = undefined;

    this.getDataById = function (collectionName, id) {
        var name = collectionName + 'Collection';
        var collection = this.data[name];

        return collection.data[id];
    };

    this.getDataForSelect = function (collectionName, id) {
        var name = collectionName + 'Collection';
        var collection = this.data[name];
        var result = '';

        for (var key in collection.data) {
            result += '<option value="' + key + '"' + (key == id ? ' selected' : '') + '>' + collection.data[key].name + '</option>'
        }

        return result;
    };

    this.getDataBySupply = function (collectionName, searchString, event) {
        this.event = event;

        var data = searchString instanceof Object ? searchString : {search: searchString};

        var name = collectionName + 'SupplyCollection';
        this.thisCollection = this.data[name];
        this.thisCollection.data = {};
        var requester = kernel.getServiceContainer().get('requester.ajax');
        requester.setUrl(this.thisCollection.url);
        requester.setData(data);
        requester.setMethod(HTTP_METHOD_GET);
        requester.setSuccess(this.onGetDataSuccess.bind(this));
        requester.request();
    };

    this.onGetDataSuccess = function (data) {
        var staticCollection = this.data[this.thisCollection.staticCollection];
        var params = {};

        for (var i = 0; i < data.result.length; i++) {
            if (!this.thisCollection.data[data.result[i].id]) {
                this.thisCollection.data[data.result[i].id] = this.getEmptyRecord();
            }

            if (!staticCollection.data[data.result[i].id]) {
                staticCollection.data[data.result[i].id] = this.getEmptyRecord();
            }

            this.thisCollection.data[data.result[i].id].name = data.result[i].name;
            staticCollection.data[data.result[i].id].name = data.result[i].name;

            params = data.result[i].additionalParams ? data.result[i].additionalParams : {};

            for (var key in params) {
                this.thisCollection.data[data.result[i].id].params[key] = params[key];
                staticCollection.data[data.result[i].id].params[key] = params[key];
            }
        }

        this.event();
    };

    this.getDataFromSupply = function (collectionName) {
        var name = collectionName + 'SupplyCollection';
        var collection = this.data[name];

        return collection.data;
    };

    this.addDataRow = function (collectionName, id, value) {
        var name = collectionName + 'Collection';
        var collection = this.data[name];

        if (!collection.data[id]) {
            collection.data[id] = this.getEmptyRecord();
        }

        collection.data[id].name = value;
    };

    this.getEmptyRecord = function () {
        return {name: '', params: {}};
    };
}
