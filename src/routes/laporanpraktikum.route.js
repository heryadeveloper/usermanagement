const express = require('express');
const validate = require('../middleware/validate');
const { laporanPraktikumController } = require('../controller');
const { laporanBayarPraktikumValidation } = require('../utils');
const { dataValidation } = require('../validation/index');

const router = express.Router();

const routes = [
    { path: '/dataBayar', method: 'get', handler: laporanPraktikumController.getDataBayarPraktikum},
    { path: '/historyBayarPraktikum', method:'get', handler: laporanPraktikumController.getHistoryPembayaranPraktikumByNisn},
    { path: '/addBayarPraktikum', method: 'post', validation: laporanBayarPraktikumValidation.inputBayarPraktikumSiswa, handler:laporanPraktikumController.addBayarPraktikum },
    { path: '/historyPraktikum', method: 'get', handler: laporanPraktikumController.getDataHistoryPembayaranPraktikumNew },
    { path: '/addPaymentInstruction', method: 'post', validation: dataValidation.addPaymentInstruction , handler: laporanPraktikumController.addPaymentSiswa},
    { path: '/historyPaymentSiswa', method: 'get', handler: laporanPraktikumController.getHistoryPaymentSiswa}
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