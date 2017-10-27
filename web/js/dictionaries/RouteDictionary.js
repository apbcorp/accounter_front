const ROUTES = {
    '/index\.html': 'controller.main',
    '/login\.html': 'controller.login',
    '/dictionary/consumers\.html': 'controller.consumerDictionary',
    '/dictionary/grounds\.html': 'controller.groundDictionary',
    '/dictionary/meters\.html': 'controller.meterDictionary',
    '/dictionary/services\.html': 'controller.serviceDictionary',
    '/dictionary/ground/(.*)\.html': 'controller.groundCard',
    '/dictionary/meter/(.*)\.html': 'controller.meterCard',
    '/dictionary/service/(.*)\.html': 'controller.serviceCard',
    '/dictionary/consumer/(.*)\.html': 'controller.consumerCard',
    '/document/pays\.html': 'controller.payDocuments',
    '/document/service\.html': 'controller.serviceDocuments',
    '/document/meter_service\.html': 'controller.meterServiceDocuments',
    '/document/meter_service/(.*)\.html': 'controller.meterServiceDocument',
    '/document/meters\.html': 'controller.metersDocuments',
    '/document/tarifs\.html': 'controller.tarifsDocuments',
    '/document/tarifs/(.*)\.html': 'controller.tarifsDocument',
    '/document/meters/(.*)\.html': 'controller.metersDocument',
    '/document/service/(.*)\.html': 'controller.serviceDocument',
    '/document/pays/(.*)\.html': 'controller.payDocument',
    '/report/main\.html': 'controller.mainReport',
    '/report/meters\.html': 'controller.metersReport',
    '/report/balance\.html': 'controller.balanceReport',
    '/report/sms\.html': 'controller.smsReport'
};

LOGIN_ROUTE = '/login.html';