const db = require('../../db/modelsmysql/');
const moment = require('moment-timezone');


async function insertPpdbSiswaSmkNu(nama_lengkap, tanggal_pendaftaran, nisn, asal_sekolah, tahun_kelulusan,
	nik, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, alamat, rt, rw, desa_kelurahan,
	kecamatan, kabupaten, kode_pos, email, no_wa, nama_ayah, pekerjaan_ayah, nama_ibu, pekerjaan_ibu,
	nama_wali, pekerjaan_wali, no_hp_orang_tua, program_jurusan_yang_diminati){
        try {
            const tanggal_pendaftaran_new = moment(tanggal_pendaftaran).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
            const tanggal_lahir_new = moment(tanggal_lahir).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
            const insertPpdb = await db.ppdb_smknu.create({
                nama_lengkap,
                tanggal_pendaftaran: tanggal_pendaftaran_new,
                nisn,
                asal_sekolah,
                tahun_kelulusan,
                nik,
                tempat_lahir,
                tanggal_lahir : tanggal_lahir_new,
                jenis_kelamin,
                agama,
                alamat,
                rt,
                rw,
                desa_kelurahan,
                kecamatan,
                kabupaten,
                kode_pos,
                email,
                no_wa,
                nama_ayah,
                pekerjaan_ayah,
                nama_ibu,
                pekerjaan_ibu,
                nama_wali,
                pekerjaan_wali,
                no_hp_orang_tua,
                program_jurusan_yang_diminati
            });
            return insertPpdb.get({ plain:true });
        } catch (error) {
            console.error('Error when insert data ppdb siswa baru ', error);
        }
    }

module.exports = {
    insertPpdbSiswaSmkNu
}