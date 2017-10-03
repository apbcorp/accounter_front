var collections = {
    kontragentCollection: {
        type: 'static',
        data: {}
    },
    kontragentSupplyCollection: {
        type: 'dynamic',
        url: '/api/v1.0/supply/dictionary/kontragent',
        staticCollection: 'kontragentCollection',
        data: {}
    },
    groundCollection: {
        type: 'static',
        data: {}
    },
    groundSupplyCollection: {
        type: 'dynamic',
        url: '/api/v1.0/supply/dictionary/ground',
        staticCollection: 'groundCollection',
        data: {}
    },
    meterTypesCollection: {
        type: 'static',
        data: {
            1: 'Электричество',
            2: 'Газ'
        }
    },
    serviceTypesCollection: {
        type: 'static',
        data: {
            1: 'Член сообщества',
            2: 'Участок'
        }
    },
    serviceSubtypesCollection: {
        type: 'static',
        data: {
            1: 'Фиксированный',
            2: 'По площади',
            3: 'По счетчику (электричество)',
            4: 'По счетчику (газ)'
        }
    }
};