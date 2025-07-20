const path = require("path");
const fs = require('fs');
const { uploadDocRepository } = require("../repository");
const catchAsync = require("../utils/catchAsync");
const { uploadService } = require("../service");
const responseInfo = require("../utils/responseInfo");
const errorExpectation = require("../utils/errorExpectationFailed");

const uploadFile = async(req, res) => {
    console.log('req.file:', req.file); // pastikan file terbaca
    try {
        const { nama, jenis } = req.body;

        if (!req.file) {
            return res.status(400).send({ error: 'No file uploaded' });
        }

        if (!nama || !jenis) {
            return res.status(400).send({ error: 'Nama dan jenis harus diisi' });
        }

        const now = new Date();
        const tanggal = `${String(now.getDate()).padStart(2, '0')}${String(now.getMonth() + 1).padStart(2, '0')}${now.getFullYear()}`;
        const tahun = now.getFullYear();
        console.log('tahun: ', tahun);
        const uploadPath = path.join(__dirname, '../../public/upload', nama, jenis);

        // Buat folder jika belum ada
        fs.mkdirSync(uploadPath, { recursive: true });

        const oldPath = req.file.path;
        const newPath = path.join(uploadPath, req.file.filename);
        const fileName = req.file.filename;
        const filePath = `upload/${nama}/${jenis}/${fileName}`;

        fs.rename(oldPath, newPath, async (err) => {
            if (err) {
                console.error('Gagal memindahkan file:', err);
                return res.status(500).send({ error: 'Gagal memindahkan file' });
            }

            try {
                await uploadDocRepository.uploadDoc(fileName, filePath, nama, jenis, tahun);
                res.status(200).send({ message: 'Upload berhasil', filename: fileName });
            } catch (error) {
                console.error('DB Error:', error);
                fs.unlinkSync(newPath); // hapus file jika DB gagal
                res.status(500).send({ error: 'Gagal menyimpan ke database' });
            }
        });
    } catch (err) {
        console.error('Unexpected Error:', err);
        res.status(500).send({ error: 'Unexpected server error' });
    }
};

const getFileDoc = catchAsync(async(req, res) => {
    const getPathDoc = await uploadService.getDataDoc(req);
    if (getPathDoc) {
        res.send(responseInfo('Success Get Path Doc', getPathDoc));
    }else{
        res.send(errorExpectation.expectationFailed('Cannot Get Data', null));
    }
}) 

module.exports = {
    uploadFile,
    getFileDoc
};
