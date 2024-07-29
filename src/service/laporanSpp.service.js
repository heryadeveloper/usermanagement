const { laporanSppSiswaRepository } = require("../repository");

async function getDataSpp(req){
    try {
        const { bulan_bayar, tahun_bayar, kelas, page, pageSize } = req.query;
        const getDataSppTransaksi =  laporanSppSiswaRepository.getDataSpp(bulan_bayar, tahun_bayar, kelas, page, pageSize);
        return getDataSppTransaksi
    } catch (error) {
        console.error('Error in service get data spp', error);
        throw error;
    }
}

module.exports = {
    getDataSpp,
}