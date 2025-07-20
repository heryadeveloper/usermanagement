const db = require('../../db/modelsmysql');

async function uploadDoc(nama_file, path, nama, jenis, tahun){
    try {
        await db.upload_doc.create({
            nama_file,
            path,
            created_at: new Date(),
            nama,
            jenis,
            tahun
        });
    } catch (error) {
        console.error('Error when upload data');
        throw error;
    }
}

async function getDataDoc(nama, jenis, tahun) {
    try {
        const data = await db.upload_doc.findOne({
            where: {
                nama,
                jenis,
                tahun
            },
            raw: true
        });

        return data;
    } catch (error) {
        console.error('Error get Data Path Doc');
        throw error;
    }
    
}

async function getDataDocByYear(tahun) {
    try {
        const data = await db.upload_doc.findAll({
            where: {
                tahun
            },
            raw: true
        });

        return data;
    } catch (error) {
        console.error('Error get Data Path Doc');
        throw error;
    }
    
}

module.exports = {
    uploadDoc,
    getDataDoc,
    getDataDocByYear
}