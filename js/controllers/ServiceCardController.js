function ServiceCardController() {
    AbstractCardController.call(this);
    this.model = new ServiceCardModel(this);
    this.viewName = 'view.serviceCard';

    this.AbstractCardController();
}