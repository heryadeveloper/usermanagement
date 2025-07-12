const { loggers, Logger } = require("winston");
const logger = require("../../config/logger");
const db = require('../../db/modelsmysql');

async function dataKelas(kelas, nisn, tahun_ajaran) {
    try {
        const query = `
            SELECT * FROM smknutulis.data_kelas dkx
            WHERE dkx.kelas = :kelas
            AND  dkx.tahun_ajaran = :tahun_ajaran
            AND (:nisn IS NULL OR dkx.nisn = :nisn)
        `;

        const result = await db.sequelize.query(query, {
        replacements: {
            kelas ,
            tahun_ajaran,
            nisn: nisn ?? null },
        type: db.Sequelize.QueryTypes.SELECT
        });

        return result;

    } catch (error) {
        logger.error('Something error when get data');
    }
}

async function promoteSiswaOrKelas(kelasLama, kelasBaru, tahunAjaranBaru, nisn) {
    try {

        let sql = `
            INSERT INTO smknutulis.data_kelas 
            (nama, nisn, kelas, tahun_ajaran, input_date, updated_date, flag_naik_kelas)
            SELECT
            nama, nisn, :kelasBaru, :tahunAjaranBaru, SYSDATE(), SYSDATE(), 1
            from smknutulis.data_kelas
            where 1=1
        `;

        // adding filter berdasarkan nisn atau kelaslama
        if (nisn){
            sql += ` AND nisn = :nisn`;
        }

        if (kelasLama) {
            sql += ` AND kelas = :kelasLama`;
        }

        // hindari duplikasi
        sql += `
            AND NOT EXISTS (
            SELECT 1 FROM smknutulis.data_kelas d2
            where d2.nisn = smknutulis.data_kelas.nisn
            and d2.kelas = :kelasBaru
            and d2.tahun_ajaran = :tahunAjaranBaru
            );
        `;

        await db.sequelize.query(sql, {
            replacements: {
                kelasBaru,
                tahunAjaranBaru,
                nisn,
                kelasLama
            },
            type: db.Sequelize.QueryTypes.INSERT
        });

        logger.info('Promosi Berhasil');
        return {
            responseData: 'Success Update Data Kenaikan kelas'
        }
    } catch (error) {
        logger.error('Something error when inserting promote siswa');
    }
}

module.exports = {
    dataKelas,
    promoteSiswaOrKelas
}