function ConsumerCardController() {
    AbstractCardController.call(this);
    this.model = new ConsumerCardModel(this);
    this.viewName = 'view.consumerCard';

    this.AbstractCardController();
}