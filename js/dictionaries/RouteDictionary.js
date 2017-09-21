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
    '/document/accurring\.html': 'controller.accurringDocuments',
    '/document/meters\.html': 'controller.metersDocuments',
    '/document/tarifs\.html': 'controller.tarifsDocuments',
    '/report/main\.html': 'controller.mainReport',
    '/report/meters\.html': 'controller.metersReport',
    '/report/balance\.html': 'controller.balanceReport',
    '/report/sms\.html': 'controller.smsReport'
};

LOGIN_ROUTE = '/login.html';