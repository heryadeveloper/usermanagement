const { laporanPpdbSiswaRepository } = require("../repository");

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

module.exports = {
    getDataPpdb,
}