// const path = require("path");
// const fs = require('fs');
// const multer = require("multer");

// const uploadDirectory = path.join(__dirname, '../../upload/');

// if (!fs.existsSync(uploadDirectory)) {
//     fs.mkdirSync(uploadDirectory);
// }

// const storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         // simpan sementara di folder temp
//     },
//     filename: function(req, file, cb){
//         const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + '_' + file.originalname)
//     }
// });

// const upload = multer({ storage: storage }).single('file');

// module.exports = upload;
const multer = require("multer");
const path = require("path");

// konfigurasi penyimpanan sementara
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../temp')); // folder sementara
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage });

module.exports = upload;
