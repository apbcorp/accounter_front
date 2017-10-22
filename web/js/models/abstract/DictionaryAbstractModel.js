function DictionaryAbstractModel() {
    AbstractModel.call(this);
    this.currentId = undefined;

    this.DictionaryAbstractModel = function (object) {
        this.AbstractModel(object);
    };

    this.getDataForView = function () {
        var result = {
            'columns': this.dataNames,
            'filters': this.fillFilters(),
            'data': this.isEmpty(this.data) ? this.defaultData : this.data
        };
        if (this.getRequestData('order_by')) {
            result['orderBy'] = this.getRequestData('order_by');
        }
        if (this.getRequestData('order_type')) {
            result['orderType'] = this.getRequestData('order_type');
        }

        return result;
    };

    this.fillFilters = function () {
        if (!Object.keys(this.filters).length) {
            return {};
        }
        
        if (this.filters.period) {
            if (this.getRequestData('filter[periodStart]') && this.filters.period) {
                this.filters.period['periodStart'] = this.getRequestData('filter[periodStart]');
            } else {
                this.filters.period['periodStart'] = '';
            }

            if (this.getRequestData('filter[periodEnd]') && this.filters.period) {
                this.filters.period['periodEnd'] = this.getRequestData('filter[periodEnd]');
            } else {
                this.filters.period['periodEnd'] = '';
            }
        }

        for (var key in this.filters) {
            var data = this.getRequestData('filter[' + key + ']');
            if (data) {
                this.filters[key].value = data;
            }
        }

        return this.filters;
    }
}