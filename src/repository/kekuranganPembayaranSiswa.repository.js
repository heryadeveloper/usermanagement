const db = require('../db/models');

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

module.exports = {
    insertTableKekuranganPembayaranSiswa,
}