function ServiceCardModel(object) {
    AbstractModel.call(this);
    this.baseUrl = '/api/v1.0/service/';

    this.setId = function (id) {
        this.url = this.baseUrl + id;
    };

    this.AbstractModel(object);
}