function SelectBoxElement() {
    this.element = undefined;
    this.text = 'Введите информацию для поиска';
    this.failText = 'По вашему запросу ничего не найдено';

    this.generateActions = function () {
        this.onActivateSelectBoxEvent = this.onActivateSelectBox.bind(this);
        this.onBlurSelectBoxEvent = this.onBlurSelectBox.bind(this);
        this.onKeyPressSelectBoxEvent = this.onKeyPressSelectBox.bind(this);
        this.onGetDataSuccessEvent = this.onGetDataSuccess.bind(this);
        this.onSelectSelectBoxItemEvent = this.onSelectSelectBoxItem.bind(this);

        return [
            {'selector': '.selectbox > :input', 'action': 'focus', 'event': this.onActivateSelectBoxEvent},
            {'selector': '.selectbox > :input', 'action': 'keydown', 'event': this.onKeyPressSelectBoxEvent},
            {'selector': '.selectbox', 'action': 'blur', 'event': this.onBlurSelectBoxEvent}
        ];
    };

    this.onKeyPressSelectBox = function (event) {
        this.element = $(event.target.parentElement.childNodes[0])[0];
        if (this.element.value.length < 2) {
            return;
        }

        var container = kernel.getServiceContainer().get('container.collection');
        container.getDataBySupply(this.element.dataset.type, this.element.value, this.onGetDataSuccessEvent);
    };

    this.onGetDataSuccess = function () {
        var data = kernel.getServiceContainer().get('container.collection').getDataFromSupply(this.element.dataset.type);

        var html = data == {} ? this.failText : this.text;
        for (var key in data) {
            html += '<p class="selectbox-item" data-id="' + key + '">' + data[key].name + ' (' + key + ')</p>';
        }

        $(this.element)[0].nextSibling.innerHTML = html;
        $('.selectbox-item').bind('click', this.onSelectSelectBoxItemEvent);
    };

    this.onSelectSelectBoxItem = function (event) {
        this.element.dataset.id = event.target.dataset.id;
        var blurEvent = {target: this.element.parentElement};
        this.onBlurSelectBox(blurEvent);
    };

    this.onActivateSelectBox = function (event) {
        $(event.target.parentElement.childNodes[1]).removeClass();
        $(event.target.parentElement.childNodes[1]).addClass('selectbox-list');
        $(event.target.parentElement.childNodes[1])[0].innerHTML = this.text;

        this.element = $(event.target.parentElement.childNodes[0])[0];
        this.element.value = '';
    };

    this.onBlurSelectBox = function (event) {
        $(event.target.childNodes[1]).removeClass();
        $(event.target.childNodes[1]).addClass('selectbox-list-hide');

        var container = kernel.getServiceContainer().get('container.collection');
        var input = $(event.target.childNodes[0])[0];
        var collection = input.dataset.type;
        var id = input.dataset.id;

        input.value = container.getDataById(collection, id).name;

        this.afterOnBlur(event);
    };

    this.afterOnBlur = function (event) {

    };
}
