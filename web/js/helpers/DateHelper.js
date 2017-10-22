function DateHelper() {
    this.getFirstDayOfMonth = function (date) {
        var newDate = new Date(date.getFullYear(), date.getMonth(), 1);

        return this.getDateFormatInput(newDate);
    };
    this.getLastDayOfMonth = function (date) {
        var newDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        return this.getDateFormatInput(newDate);
    };
    this.getDateFormatInput = function (date) {
        return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    }
}