function TablePaginatorView() {
    this.buildTemplate = function (data) {
        if (data.pageCount < 2 || data.pageCount === undefined) {
            return '';
        }

        var startPage = data.page - 2 > 0 ? data.page - 2 : 1;
        var endPage = startPage + 5 <= data.pageCount ? startPage + 5 : data.pageCount;
        var result = '<ul>';

        if (data.page != 1) {
            result += '<button class="paginator-button" data-page="1">&lt;&lt;</button>';
            result += '<button class="paginator-button" data-page="' + (data.page - 1) + '">&lt;</button>';
        }
        for (var i = startPage; i <= endPage; i++) {
            result += '<button class="paginator-button' + (data.page == i ? ' active' : '') + '" data-page="' + i + '">' + i + '</button>';
        }
        if (data.page != data.pageCount) {
            result += '<button class="paginator-button" data-page="' + (data.page + 1) + '">&gt;</button>';
            result += '<button class="paginator-button" data-page="' + data.pageCount + '">&gt;&gt;</button>';
        }

        result += '</ul>';

        return result;
    };
}
