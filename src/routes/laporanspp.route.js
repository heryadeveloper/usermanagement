const express = require('express');
const validate = require('../middleware/validate');
const { laporanSppController, laporanPraktikumController } = require('../controller');
const { laporanSppSiswaValidation, laporanBayarPraktikumValidation } = require('../utils');

const router = express.Router();

const routes = [
    { path: '/spp', method: 'get', handler: laporanSppController.getDataSpp},
    { path: '/sppByNisn', method: 'get', handler: laporanSppController.getDataSppByNisn},
    { path: '/bulanKosong', method: 'get', handler: laporanSppController.getBulanBelumBayar},
    { path: '/addPembayaranSpp', method: 'post', validation: laporanSppSiswaValidation.inputPembayaran, handler: laporanSppController.inputPembayaran},
    { path: '/gethistoryBayarSppNew', method: 'get', handler: laporanSppController.getDataHistoryPembayaranSpp},
    { path: '/getJenisBayar', method: 'get', handler: laporanSppController.getJenisPembayaran},
    { path: '/addJenisPembayaran', method: 'post', validation: laporanSppSiswaValidation.inputJenisPembayaran, handler: laporanSppController.insertJenisPembayaran},
    { path: '/getAllJenisPembayaran', method: 'get', handler: laporanSppController.getJenisPembayaranAll},
    { path: '/updateJenisPembayaran', method: 'put', validation: laporanSppSiswaValidation.inputJenisPembayaran, handler: laporanPraktikumController.updateJenisPayment},
    { path: '/rekapdataspp', method: 'get', handler: laporanSppController.getRekapPembayaranSpp},
    { path: '/getJenisPembayaran', method: 'get', handler: laporanSppController.getJeninsPembayaranForNominal}
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