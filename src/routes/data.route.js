const express = require('express');
const validate = require('../middleware/validate');
const { configController, dataController } = require('../controller');
const { dataValidation } = require('../validation');

const router = express.Router();

const routes = [
    { path: '/kenaikanKelas', method: 'post', validation: dataValidation.updateKenaikanKelas, handler: dataController.dataKenaikanKelas},
    { path: '/listGuru', method: 'get', handler: dataController.dataGuru},
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