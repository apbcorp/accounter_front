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
    '/dictionary/consumer/(.*)\.html': 'controller.consumerCard'
};

LOGIN_ROUTE = '/login.html';