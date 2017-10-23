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
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    };
    this.isEqualDate = function (date1, date2) {
        date1 = new Date(date1);
        date2 = new Date(date2);

        return date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate();
    };
    this.isEqualPeriodMonth = function (date1, date2) {
        date1 = new Date(date1);
        date2 = new Date(date2);

        return date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth();
    }
}