const express = require('express');
const validate = require('../middleware/validate');
const { configController } = require('../controller');

const router = express.Router();

const routes = [
    { path: '/tahunajaran', method: 'get', handler: configController.getTahunAjaran},
]

routes.forEach(route => {
    const { path, method, validation, handler } = route;
    let middleware = null;
    if (validation) {
        middleware = validate(validation);
    }

    if (middleware) {
        router.route(path)[method](middleware, handler);
    }else{
        router.route(path)[method](handler);
    }
})

module.exports = router;