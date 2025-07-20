
const express = require('express');
const { uploadController } = require('../controller');
const router = express.Router();
const upload = require('../middleware/multerconfig');

// ✅ gunakan upload.single('file') DI SINI
router.post('/uploadfile', upload.single('file'), uploadController.uploadFile);
router.get('/getFilePathDoc', uploadController.getFileDoc);

module.exports = router;
