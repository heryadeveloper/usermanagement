const express = require('express');
const siswaRoute = require('./siswa.route');
const laporansppRoute = require('./laporanspp.route');

const router = express.Router();

router.use('/siswa', siswaRoute);
router.use('/datapembayaran', laporansppRoute);

module.exports = router;