function MeterCardController() {
    AbstractCardController.call(this);
    this.model = new MeterCardModel(this);
    this.viewName = 'view.meterCard';

    this.AbstractCardController();
}