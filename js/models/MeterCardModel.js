function MeterCardModel(object) {
    AbstractModel.call(this);
    this.baseUrl = '/api/v1.0/meter/';

    this.setId = function (id) {
        this.url = this.baseUrl + id;
    };

    this.AbstractModel(object);
}