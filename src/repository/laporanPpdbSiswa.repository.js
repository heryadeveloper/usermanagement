const db = require('../db/models');

async function dataPembayaranPpdb(bulan_bayar, tahun_bayar, kelas, page, pageSize){
    try {
        const totalCount = await db.laporan_ppdb_siswa.count({
            where:{
                bulan_bayar, tahun_bayar, kelas
            },
            raw: true,
        });

        const offset = (page - 1) * pageSize;
        const responseData = await db.laporan_ppdb_siswa.findAll({
            where: {
                bulan_bayar, tahun_bayar, kelas
            },
            offset: offset,
            limit: pageSize,
            raw: true,
        });
        console.log('total count ppdb', totalCount);
        console.log('response data ppdb', responseData);
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
    dataPembayaranPpdb
}