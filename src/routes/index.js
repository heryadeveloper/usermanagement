const express = require('express');
const siswaRoute = require('./siswa.route');
const laporansppRoute = require('./laporanspp.route');
const laporanPraktikumRoute = require('./laporanpraktikum.route');
const laporanPpdbRoute = require('./laporanppdb.route');
const confifRoute = require('./config.route');
const router = express.Router();

router.use('/siswa', siswaRoute);
router.use('/datapembayaran', laporansppRoute);
router.use('/datapembayaran/praktikum', laporanPraktikumRoute);
router.use('/datapembayaran/ppdb', laporanPpdbRoute);
router.use('/config', confifRoute);

module.exports = router;