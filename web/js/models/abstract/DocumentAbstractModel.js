function DocumentAbstractModel() {
    AbstractCardModel.call(this);

    this.DocumentAbstractModel = function (object) {
        this.AbstractCardModel(object);
    };

    this.saveDataToCollection = function () {
        var container = kernel.getServiceContainer().get('container.collection');

        for (var key in this.collectionFields) {
            if (this.data[this.collectionFields[key].id]) {
                container.addDataRow(key, this.data[this.collectionFields[key].id], this.data[this.collectionFields[key].name]);
            }

            if (this.data['rows'][0][this.collectionFields[key].id]) {
                for (var i = 0; i < this.data['rows'].length; i++) {
                    container.addDataRow(key, this.data['rows'][i][this.collectionFields[key].id], this.data['rows'][i][this.collectionFields[key].name]);
                }
            }
        }
    };
}