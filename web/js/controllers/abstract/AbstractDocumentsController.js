function AbstractDocumentsController() {
    AbstractDictionaryController.call(this);
    this.apiPath = '';

    this.onDeleteRecord = function () {
        if (this.model.currentId === undefined) {
            return;
        }

        this.model.delete(this.apiPath + 'delete/' + this.model.currentId);
    };

    this.AbstractDocumentsController = function () {
        this.AbstractDictionaryController()
    }
}