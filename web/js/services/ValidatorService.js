function ValidatorService() {
    this.data = [];
    this.errors = '';

    this.setData = function (data) {
        this.data = data;
    };

    this.validate = function () {
        this.errors = '';

        for (var i = 0; i < this.data.length; i++) {
            switch (this.data[i].type) {
                case VALIDATION_TYPE_STRING:
                    this.validateString(this.data[i].data, this.data[i].fieldName);
                    break;
                case VALIDATION_TYPE_OBJECT_ID:
                    this.validateObjectId(this.data[i].data, this.data[i].fieldName);
                    break;
                case VALIDATION_TYPE_PHONE:
                    this.validatePhone(this.data[i].data, this.data[i].fieldName);
                    break;
                case VALIDATION_TYPE_FLOAT:
                    this.validateFloat(this.data[i].data, this.data[i].fieldName);
                    break;
            }
        }

        return !this.errors;
    };

    this.getErrors = function () {
        return this.errors;
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
        if (!/\d*[\.,\,]\d*/.test(data) && !/^\d+$/.test(data)) {
            this.errors += 'Поле ' + fieldName + ' может содержать только цифры и знаки "." или ","\n';
        }
    };
}