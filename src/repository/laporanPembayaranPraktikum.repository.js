const db = require('../db/models');

async function dataPembayaranPraktikum(bulan_bayar, tahun_bayar, kelas, page, pageSize){
    try {
        const totalCount = await db.laporan_praktikum_siswa.count({
            where: {
                bulan_bayar, tahun_bayar, kelas
            },
            raw: true,
        });

        const offset = (page - 1) * pageSize;
        const responseData = await db.laporan_praktikum_siswa.findAll({
            where: {
                bulan_bayar, tahun_bayar, kelas
            },
            offset: offset,
            limit: pageSize,
            raw: true,
        });
        return{
            totalCount: totalCount,
            responseData,
        }
    } catch (error) {
        console.error('Error get data', error);
        throw error;
    }
}

module.exports = {
    dataPembayaranPraktikum,
}