function GroundCardController() {
    AbstractCardController.call(this);
    this.model = new GroundCardModel(this);
    this.viewName = 'view.groundCard';

    this.AbstractCardController();
}