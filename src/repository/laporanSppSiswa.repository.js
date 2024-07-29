const moment = require('moment');
const db = require('../db/models');

async function getDataSpp(bulan_bayar, tahun_bayar, kelas, page, pageSize){
    try {
        const totalCount = await db.laporan_spp_siswa.count({
            where:{
                bulan_bayar, tahun_bayar, kelas
            },
            raw: true,
        });

        const offset = (page - 1) * pageSize;
        const responseData = await db.laporan_spp_siswa.findAll({
            where:{
                bulan_bayar,
                tahun_bayar,
                kelas,
            },
            order:[['tanggal_bayar','ASC']],
            offset: offset,
            limit: pageSize,
            raw: true,
        });

        // Format tanggal_bayar
        const formattedData = responseData.map(record => {
            const formattedDate = moment(record.tanggal_bayar).format('DD-MM-YYYY');
            return { ...record, tanggal_bayar: formattedDate };
        });

        return{
            totalCount: totalCount,
            responseData: formattedData,
        }
    } catch (error) {
        console.error('Error when get data spp: ', error);
        throw error;
    }
}

module.exports = {
    getDataSpp,
}