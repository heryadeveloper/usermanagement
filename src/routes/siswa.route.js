const express = require('express');
const validate = require('../middleware/validate');
const { siswaController } = require('../controller');
const { path } = require('@hapi/joi/lib/errors');

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
    { path: '/listNamaSiswa', method: 'get', handler: siswaController.listNamaSiswa}
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