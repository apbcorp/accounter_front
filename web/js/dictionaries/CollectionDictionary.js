var collections = {
    kontragentCollection: {
        type: 'static',
        data: {}
    },
    kontragentSupplyCollection: {
        type: 'dynamic',
        url: '/api/v1.0/dictionary/supply/kontragent',
        staticCollection: 'kontragentCollection',
        data: {}
    },
    groundCollection: {
        type: 'static',
        data: {}
    },
    groundSupplyCollection: {
        type: 'dynamic',
        url: '/api/v1.0/dictionary/supply/ground',
        staticCollection: 'groundCollection',
        data: {}
    },
    meterCollection: {
        type: 'static',
        data: {}
    },
    meterSupplyCollection: {
        type: 'dynamic',
        url: '/api/v1.0/dictionary/supply/meter',
        staticCollection: 'meterCollection',
        data: {}
    },
    meterTypesCollection: {
        type: 'static',
        data: {
            1: {name: 'Электричество'},
            2: {name: 'Вода'}
        }
    },
    meterDocumentSupplyCollection: {
        type: 'dynamic',
        url: '/api/v1.0/document/supply/meter',
        staticCollection: 'meterDocumentCollection',
        data: {}
    },
    meterDocumentCollection: {
        type: 'static',
        data: {}
    },
    serviceTypesCollection: {
        type: 'static',
        data: {
            1: {name: 'Член сообщества'},
            2: {name: 'Участок'}
        }
    },
    serviceSubtypesCollection: {
        type: 'static',
        data: {
            1: {name: 'Фиксированный'},
            2: {name: 'По общей площади'},
            3: {name: 'По счетчику (электричество)'},
            4: {name: 'По счетчику (вода)'},
            5: {name: 'По занимаемой площади'}
        }
    },
    serviceCollection: {
        type: 'static',
        data: {}
    },
    serviceSupplyCollection: {
        type: 'dynamic',
        url: '/api/v1.0/dictionary/supply/service',
        staticCollection: 'serviceCollection',
        data: {}
    }
};