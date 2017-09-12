function MainView() {
    AbstractView.call(this);
    this.template = '<div><ul class="menu"><li class="menu_element"><p>Справочники</p><ul class="submenu"><li class="submenu_element consumer_dictionary_button"><p>Потребители</p></li><li class="submenu_element ground_dictionary_button"><p>Участки</p></li><li class="submenu_element meters_dictionary_button"><p>Счетчики</p></li><li class="submenu_element services_dictionary_button"><p>Усуги</p></li></ul></li><li class="menu_element"><p>Документы</p></li><li class="menu_element"><p>Отчеты</p></li></ul></div>';

    this.buildTemplate = function () {
        return this.template;
    };
}