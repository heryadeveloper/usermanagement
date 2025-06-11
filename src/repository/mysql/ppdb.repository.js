const { where } = require('sequelize');
const db = require('../../db/modelsmysql/');
const moment = require('moment-timezone');
const logger = require('../../config/logger');


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
           // Tangkap error spesifik duplicate entry
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error(`Duplicate Entry: ${error.sqlMessage}`);
            }
            throw error; // Lempar error lainnya
            }
    }

async function deleteDataPpdb(id, nisn) {
    try {
        const deletePpdb = await db.ppdb_smknu.destroy({
            where: {
                id,
                nisn
            }
        })
        return deletePpdb;
    } catch (error) {
        logger.error('delete data ppdb error');
    }
}

async function updateNoUrutAfterDelete() {
    try {
        const queryUpdate = `
            UPDATE ppdb_smknu AS t
            JOIN (
                SELECT id, @rownum := @rownum + 1 AS new_urut
                FROM ppdb_smknu, (SELECT @rownum := 0) r
                ORDER BY id
            ) AS src ON t.id = src.id
            SET t.no_urut = src.new_urut
        `;

        const responseData = await db.sequelize.query(queryUpdate, {
            type: db.Sequelize.QueryTypes.UPDATE,
        });

        return responseData;
    } catch (error) {
        console.error("Error updating no_urut:", error);
        throw error;
    }
}

module.exports = {
    insertPpdbSiswaSmkNu,
    deleteDataPpdb,
    updateNoUrutAfterDelete
}