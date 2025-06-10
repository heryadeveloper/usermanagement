const logger = require("../config/logger");
const { laporanPpdbSiswaRepository, ppdbSmknuRepository } = require("../repository");

async function getDataPpdb(req){
    try {
        const { bulan_bayar, tahun_bayar, kelas, page, pageSize } = req.query;
        const getDataPpdbTransaksi = laporanPpdbSiswaRepository.dataPembayaranPpdb(bulan_bayar, tahun_bayar, kelas, page, pageSize);
        return getDataPpdbTransaksi;
    } catch (error) {
        console.error('Error in service get data ppdb', error);
        throw error;
    }
}

async function deleteDataPpdb(req) {
    try {
        logger.info('processing delete data ppdb in service');
        const {id, nisn} = req.body;
        const dataDelete = await ppdbSmknuRepository.deleteDataPpdb(id, nisn);
        return dataDelete;
    } catch (error) {
        logger.error('Delete ppdb error in service');
    }
}

module.exports = {
    getDataPpdb,
    deleteDataPpdb
}