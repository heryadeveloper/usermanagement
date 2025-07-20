const logger = require("../config/logger");
const { uploadDocRepository } = require("../repository");

async function getDataDoc(req) {
    const {tahun} = req.query;
    try {
        // const data = await uploadDocRepository.getDataDoc(nama, jenis, tahun);
        const data = await uploadDocRepository.getDataDocByYear(tahun);
        return data;
    } catch (error) {
        logger.error('Error Get Data Path Doc: ', error);
        throw error;
    }
}

module.exports = {
    getDataDoc
}