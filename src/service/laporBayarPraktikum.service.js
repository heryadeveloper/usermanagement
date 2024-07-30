const { laporanPembayaranPraktikumRepository } = require("../repository");

async function dataPemasukanPraktikum(req){
    try {
        const {bulan_bayar, tahun_bayar, kelas, page, pageSize} = req.query;
        const dataPemasukanPraktik = await laporanPembayaranPraktikumRepository.dataPembayaranPraktikum(bulan_bayar, tahun_bayar, kelas, page, pageSize);
        return dataPemasukanPraktik;
    } catch (error) {
        console.error('error service get data pemasukan praktikum', error);
        throw error;
    }
}

module.exports = {
    dataPemasukanPraktikum,
}