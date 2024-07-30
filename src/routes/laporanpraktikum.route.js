const express = require('express');
const validate = require('../middleware/validate');
const { laporanPraktikumController } = require('../controller');

const router = express.Router();

const routes = [
    { path: '/dataBayar', method: 'get', handler: laporanPraktikumController.getDataBayarPraktikum},
];

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