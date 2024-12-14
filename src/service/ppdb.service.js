const { ppdbSmknuRepository } = require("../repository");

async function insertPpdbSmknu(req){
    const {
        nama_lengkap, tanggal_pendaftaran, nisn, asal_sekolah, tahun_kelulusan,
	nik, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, alamat, rt, rw, desa_kelurahan,
	kecamatan, kabupaten, kode_pos, email, no_wa, nama_ayah, pekerjaan_ayah, nama_ibu, pekerjaan_ibu,
	nama_wali, pekerjaan_wali, no_hp_orang_tua, program_jurusan_yang_diminati
    } = req.body;

    try {
        console.log('step service start -> insert data ppdb smk');
        const insertDataPpdbSmknu = await ppdbSmknuRepository.insertPpdbSiswaSmkNu(nama_lengkap, tanggal_pendaftaran, nisn, asal_sekolah, tahun_kelulusan,
            nik, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, alamat, rt, rw, desa_kelurahan,
            kecamatan, kabupaten, kode_pos, email, no_wa, nama_ayah, pekerjaan_ayah, nama_ibu, pekerjaan_ibu,
            nama_wali, pekerjaan_wali, no_hp_orang_tua, program_jurusan_yang_diminati);
        return insertDataPpdbSmknu;
    } catch (error) {
        console.error('Error in service insertPpdbSmknu : ', error);
        // Tangkap error spesifik duplicate entry
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error(`Duplicate Entry: ${error.sqlMessage}`);
        }
        throw error; // Lempar error lainnya
    }
}

module.exports = {
    insertPpdbSmknu
}