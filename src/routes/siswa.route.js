const express = require('express');
const validate = require('../middleware/validate');
const { siswaController } = require('../controller');
const { path } = require('@hapi/joi/lib/errors');
const { dataValidation } = require('../validation');

const router = express.Router();

const routes = [
    { path: '/listSiswa', method: 'get', handler: siswaController.getDataSiswaInRombel},
    { path: '/kelasX', method: 'get',  handler: siswaController.getListAllKelas},
    { path: '/kelasXi', method: 'get', handler: siswaController.getListAllKelasXI},
    { path: '/kelasXii', method: 'get', handler: siswaController.getListAllKelasXII},
    { path: '/allKelas', method: 'get', handler: siswaController.getListAll},
    { path: '/kelas', method: 'get', handler: siswaController.getKelas},
    { path: '/listKelas', method: 'get', handler: siswaController.listKelas},
    { path: '/listKelasTahunAjaran', method: 'get', handler: siswaController.listKelasDet},
    { path: '/listNamaSiswa', method: 'get', handler: siswaController.listNamaSiswa},
    { path: '/download-bukti', method: 'get', handler: siswaController.downloadPdf},
    { path: '/download-formulir-ppdb', method: 'get', handler: siswaController.downloadFormulirPpdb},
    { path: '/getDataSiswaPPDB', method: 'get', handler: siswaController.getDataSiswaPPDB},
    { path: '/generateExcel', method: 'get', handler: siswaController.generateExcel},
    { path: '/kekuranganPembayaran', method: 'get', handler: siswaController.getKekuranganPembayaranSiswa},
    { path: '/getDataKelas', method: 'get', handler: siswaController.getDataKelas},
    { path: '/promoteSiswa', method: 'post', validation: dataValidation.promotoSiswa, handler: siswaController.promotoSiswa}
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