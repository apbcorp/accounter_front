function GroundCardModel(object) {
    AbstractModel.call(this);
    this.baseUrl = '/api/v1.0/ground/';

    this.setId = function (id) {
        this.url = this.baseUrl + id;
    };

    this.AbstractModel(object);
}