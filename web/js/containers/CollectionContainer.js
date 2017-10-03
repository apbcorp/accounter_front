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
            result += '<option value="' + key + '"' + (key == id ? ' selected' : '') + '>' + collection.data[key] + '</option>'
        }

        return result;
    };

    this.getDataBySupply = function (collectionName, searchString, event) {
        this.event = event;
        var name = collectionName + 'SupplyCollection';
        this.thisCollection = this.data[name];
        this.thisCollection.data = {};
        var requester = kernel.getServiceContainer().get('requester.ajax');
        requester.setUrl(this.thisCollection.url);
        requester.setData({search: searchString});
        requester.setMethod(HTTP_METHOD_GET);
        requester.setSuccess(this.onGetDataSuccess.bind(this));
        requester.request();
    };

    this.onGetDataSuccess = function (data) {
        var staticCollection = this.data[this.thisCollection.staticCollection];

        for (var i = 0; i < data.result.length; i++) {
            this.thisCollection.data[data.result[i].id] = data.result[i].name;
            staticCollection.data[data.result[i].id] = data.result[i].name;
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

        collection.data[id] = value;
    }
}
