function TablePaginatorView() {
    this.buildTemplate = function (data) {
        if (data.pageCount == 1) {
            return '';
        }

        var startPage = data.page - 1 > 0 ? data.page - 1 : 1;
        var endPage = startPage + 5 < data.pageCount ? startPage + 5 : data.pageCount;
        var result = '<ul>';

        for (var i = startPage; i <= endPage; i++) {
            result += '<button class="paginator-button' + (data.page == i ? ' active' : '') + '" data-page="' + i + '">' + i + '</button>';
        }

        result += '</ul>';

        return result;
    };
}
