function ValidatorService() {
    this.errors = '';

    this.validate = function (data, clearErrors) {
        if (clearErrors !== false) {
            this.errors = '';
        }

        for (var i = 0; i < data.length; i++) {
            switch (data[i].type) {
                case VALIDATION_TYPE_STRING:
                    this.validateString(data[i].data, data[i].fieldName);
                    break;
                case VALIDATION_TYPE_OBJECT_ID:
                    this.validateObjectId(data[i].data, data[i].fieldName);
                    break;
                case VALIDATION_TYPE_PHONE:
                    this.validatePhone(data[i].data, data[i].fieldName);
                    break;
                case VALIDATION_TYPE_FLOAT:
                    this.validateFloat(data[i].data, data[i].fieldName);
                    break;
                case VALIDATION_TYPE_DATE:
                    this.validateDate(data[i].data, data[i].fieldName);
                    break;
                case VALIDATION_TYPE_NOT_EMPTY_ARRAY:
                    this.validateNotEmptyArray(data[i].data, data[i].fieldName);
                    break;
                case VALIDATION_TYPE_TABLE_ROWS:
                    for (var j = 0; j < data[i].data.length; j++) {
                        var subData = data[i].subvalidation;

                        for (var n = 0; n < subData.length; n++) {
                            subData[n].data = data[i].data[j][subData[n].data];
                            subData[n].fieldName = subData[n].fieldName + ' (строка ' + (j + 1) + ')';
                        }

                        this.validate(subData, false);
                    }
                    break;
            }
        }

        return !this.errors;
    };

    this.getErrors = function () {
        return this.errors;
    };

    this.validateNotEmptyArray = function (data, fieldName) {
        if (!data || !data.length) {
            this.errors += fieldName + ' не может быть пустой\n';
        }
    };

    this.validateDate = function (data, fieldName) {
        if (!data) {
            this.errors += 'Поле ' + fieldName + ' не может быть пустым\n';
            return;
        }

        if (!data instanceof Date) {
            data = new Date().parse(date);
        }

        if (!data instanceof Date && !data.getMonth()) {
            this.errors += 'Поле ' + fieldName + ' должно содержать дату\n';
        }
    };

    this.validateString = function (data, fieldName) {
        if (!data) {
            this.errors += 'Поле ' + fieldName + ' не может быть пустым\n';
            return;
        }
        if (data.length > 255) {
            this.errors += 'Поле ' + fieldName + ' слишком длинное\n';
        }
    };

    this.validateObjectId = function (data, fieldName) {
        if (!data) {
            this.errors += 'Поле ' + fieldName + ' не может быть пустым\n';
        }
    };

    this.validatePhone = function (data, fieldName) {
        if (!data) {
            this.errors += 'Поле ' + fieldName + ' не может быть пустым\n';
            return;
        }
        if (data.length != 13 || !/\+\d{12}/.test(data)) {
            this.errors += 'Поле ' + fieldName + ' должно начинаться с символа "+" и содержать 12 цифр\n';
        }
    };

    this.validateFloat = function (data, fieldName) {
        if (!data) {
            return;
        }

        if (!/^\w{0}\d*[\.,\,]\d*\w{0}$/.test(data) && !/^\w{0}\d*\w{0}$/.test(data)) {
            this.errors += 'Поле ' + fieldName + ' может содержать только цифры и знаки "." или ","\n';
        }
    };
}