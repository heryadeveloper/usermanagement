const express = require('express');
const validate = require('../middleware/validate');
const { ppdbController } = require('../controller');
const { dataValidation } = require('../validation');

const router = express.Router();

const routes = [
    { path: '/registrasi', method: 'post', validation: dataValidation.registrationPpdb, handler: ppdbController.insertPpdb},
    { path: '/deleteDataPpdb', method: 'post', validation: dataValidation.deleteDataPpdb, handler: ppdbController.deleteDataPpdb}
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