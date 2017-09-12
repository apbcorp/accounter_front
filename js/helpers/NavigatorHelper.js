function NavigatorHelper() {
    this.goTo = function (url) {
        url = kernel.getServiceContainer().get('helper.url').getDomain(document.location.href) + url;
        history.pushState(null, null, url);

        kernel.navigate();
    }
}