const db = require('../../db/modelsmysql');

async function insertTableKekuranganPembayaranSiswa(nama, kelas, nisn, kode_pembayaran, jenis_pembayaran, kekurangan_pembayaran, petugas_input){
    try {
        await db.kekurangan_pembayaran_siswa.create({
            nama,
            kelas,
            nisn,
            kode_pembayaran,
            jenis_pembayaran,
            kekurangan_pembayaran,
            tanggal_terakhir_transaksi : new Date,
            petugas_input,
        });
    } catch (error) {
        console.error('Error when inserting data kekurangan pembayaran siswa', error);
        throw error;
    }
}

async function getDataKekuranganPembayaran(nisn, tahun_ajaran){
    try {
        const dataResult = `SELECT 
                    a.nama,
                    a.kelas,
                    a.kode_pembayaran,
                    MIN(a.kekurangan_pembayaran) AS min_kekurangan_pembayaran,
                    b.jenis_transaksi 
                FROM kekurangan_pembayaran_siswa a
                join jenis_pembayaran b
                on a.kode_pembayaran = b.kode_pembayaran 
                WHERE nisn = :nisn
                and b.tahun_ajaran = :tahun_ajaran
                GROUP BY nama, kelas, kode_pembayaran`;
        const responseData = await db.sequelize.query(dataResult, {
            replacements: {nisn, tahun_ajaran},
            type: db.Sequelize.QueryTypes.SELECT,
        })

        // Menjumlahkan nilai min_kekurangan_pembayaran
        const totalMinKekuranganPembayaran = responseData.reduce(
            (acc, curr) => acc + parseFloat(curr.min_kekurangan_pembayaran || 0), 
            0
        );

        return {
            detail: responseData,
            total: totalMinKekuranganPembayaran,
        };
    } catch (error) {
        console.error('Error when get data from table kekurangan', error);
        throw error;
    }
}

module.exports = {
    insertTableKekuranganPembayaranSiswa,
    getDataKekuranganPembayaran
}