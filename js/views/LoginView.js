function LoginView() {
    AbstractView.call(this);
    this.template = '<table align="center" style="padding-top: 100px;"><tr><td><table><tr><td>Имя пользователя</td><td><input name="login"></td></tr><tr><td>Пароль</td><td><input type="password" name="password"></td></tr></table></td></tr><tr class="login_error"><td>Ввведна неверная комбинация имени и пароля</td></tr><tr><td><center><button class="login_button">Вход</button></center></td></tr></table>';

    this.buildTemplate = function () {
        return this.template;
    };
}