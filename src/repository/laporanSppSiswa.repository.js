const moment = require('moment');
const db = require('../db/models');
const { raw } = require('body-parser');

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

async function getDataSppByNisn(nisn) {
    try {
        const subqueryAllMonths = `
            SELECT 'Januari' AS bulan, 1 as urutan_bulan UNION
            SELECT 'Februari' AS bulan, 2 as urutan_bulan UNION
            SELECT 'Maret' AS bulan, 3 as urutan_bulan UNION
            SELECT 'April' AS bulan, 4 as urutan_bulan UNION
            SELECT 'Mei' AS bulan, 5 as urutan_bulan UNION
            SELECT 'Juni' AS bulan, 6 as urutan_bulan UNION
            SELECT 'Juli' AS bulan, 7 as urutan_bulan UNION
            SELECT 'Agustus' AS bulan, 8 as urutan_bulan UNION
            SELECT 'September' AS bulan, 9 as urutan_bulan UNION
            SELECT 'Oktober' AS bulan, 10 as urutan_bulan UNION
            SELECT 'November' AS bulan, 11 as urutan_bulan UNION
            SELECT 'Desember' AS bulan, 12 as urutan_bulan
        `;

        const query = `
            SELECT 
                all_months.bulan, 
                COALESCE(paid_months.nominal_bulan, 0) AS nominal,
                paid_months.tahun_bayar,
                to_char(paid_months.tanggal_bayar, 'DD Mon YYYY') AS tanggal_bayar,
                paid_months.petugas_input
            FROM (${subqueryAllMonths}) AS all_months
            LEFT JOIN (
                SELECT 
                    bulan_bayar, 
                    nominal_bulan, 
                    tahun_bayar, 
                    tanggal_bayar, 
                    petugas_input
                FROM laporan_spp_siswa
                WHERE nisn = :nisn
            ) AS paid_months
            ON all_months.bulan = paid_months.bulan_bayar
            WHERE COALESCE(paid_months.nominal_bulan, 0) != 0
            ORDER BY all_months.urutan_bulan;
        `;

        const responseData = await db.sequelize.query(query, {
            replacements: { nisn },
            type: db.Sequelize.QueryTypes.SELECT,
        });
        console.log('response dari query: ', responseData);

        return responseData;

    } catch (error) {
        console.error('Error when getting data SPP: ', error);
        throw error;
    }
}

async function getBulanBelumBayar(nisn, kelas, tahunAjaranBaru) {
    try {
        const subqueryAllMonths = `
        SELECT 'Juli' AS bulan, 7 AS urutan_bulan UNION
        SELECT 'Agustus' AS bulan, 8 AS urutan_bulan UNION
        SELECT 'September' AS bulan, 9 AS urutan_bulan UNION
        SELECT 'Oktober' AS bulan, 10 AS urutan_bulan UNION
        SELECT 'November' AS bulan, 11 AS urutan_bulan UNION
        SELECT 'Desember' AS bulan, 12 AS urutan_bulan UNION
        SELECT 'Januari' AS bulan, 1 AS urutan_bulan UNION
        SELECT 'Februari' AS bulan, 2 AS urutan_bulan UNION
        SELECT 'Maret' AS bulan, 3 AS urutan_bulan UNION
        SELECT 'April' AS bulan, 4 AS urutan_bulan UNION
        SELECT 'Mei' AS bulan, 5 AS urutan_bulan UNION
        SELECT 'Juni' AS bulan, 6 AS urutan_bulan
        `;

        const query = `
        WITH all_months AS (
            ${subqueryAllMonths}
        ),
        all_periods AS (
            SELECT 
                bulan, 
                CASE 
                    WHEN urutan_bulan >= 7 THEN :tahun_ajaran
                    ELSE :tahun_ajaran + 1
                END AS tahun_ajaran,
                urutan_bulan
            FROM all_months
        )
        SELECT 
            ap.bulan, 
            ap.tahun_ajaran 
        FROM all_periods ap
        LEFT JOIN (
            SELECT bulan_bayar, CAST(tahun_bayar AS INTEGER) AS tahun_bayar
            FROM laporan_spp_siswa
            WHERE kelas = :kelas AND nisn = :nisn
        ) lss
        ON ap.bulan = lss.bulan_bayar AND ap.tahun_ajaran = lss.tahun_bayar
        WHERE lss.bulan_bayar IS NULL
        ORDER BY ap.tahun_ajaran, ap.urutan_bulan;
        `;

        const responseData = await db.sequelize.query(query, {
            replacements: { nisn, kelas, tahun_ajaran: tahunAjaranBaru },
            type: db.Sequelize.QueryTypes.SELECT
        });

        return responseData;
    } catch (error) {
        console.error('Error when getting remaining months:', error);
        throw error;
    }
}

// step input pembayaran
async function getKodePembayaran(kelas){
    const kelas_split = kelas.split(' ')[0];

    const getKodeBayar = await db.jenis_pembayaran.findAll({
        where: {
            jenis_transaksi: 'SPP',
            kelas: kelas_split,
        },
        attributes:['kode_pembayaran', 'nominal_bulan', 'nominal_total'],
        raw: true
    });
    return getKodeBayar;
}

async function insertPembayaranSpp(nama, kelas, nisn, kode_bayar, nominal, bulan_bayar, petugas_input, tahun_ajaran){
    try {
        await db.laporan_spp_siswa.create({
            nama_siswa: nama,
            kelas,
            nisn,
            bulan_bayar,
            tanggal_bayar: new Date,
            kode_bayar,
            jenis_transaksi: 'SPP',
            nominal_bulan: nominal,
            created_at: new Date,
            petugas_input,
            tahun_bayar: tahun_ajaran
        });
    } catch (error) {
        console.error('Error when inserting data table laporan spp ', error);
        throw error;
    }
}

async function getDataKekurangan(nisn, kode_bayar){
    try {
        const dataKekurangan = await db.kekurangan_pembayaran_siswa.findAll({
            where: {
                nisn,
                kode_pembayaran: kode_bayar,
            },
            attributes: [[db.sequelize.fn('MIN', db.sequelize.col('kekurangan_pembayaran')), 'nilai_terkecil']],
            raw: true
        });
        return dataKekurangan;
    } catch (error) {
        console.error('Error when get data kekurangan', error);
        throw error;
    }
}

async function getCountKekuranganPembayaranSiswa(nisn, kode_bayar){
    try {
        const getCountKekurangan = await db.kekurangan_pembayaran_siswa.count({
            where: {
                nisn,
                kode_pembayaran: kode_bayar,
            },
        });
        return getCountKekurangan;
    } catch (error) {
        console.error('Error when get count data', error);
        throw error;
    }
}

async function getDataKekuaranganPemasukan(kode_pembayaran){
    try {
        const dataKekuranganPemasukan = await db.data_keuangan_sekolah_kelas.findOne({
            where:{kode_pembayaran},
            order: [['created_date', 'DESC']],
        });
        return dataKekuranganPemasukan;
    } catch (error) {
        console.error('Error getting data from table', error);
        throw error;
    }
}

async function updateDataKekuranganPemasukan(kelas, kode_pembayaran, jenis_pembayaran, uang_masuk, kekurangan_pemasukan){
    try {
        const kelas_split = kelas.split(' ')[0];

        const existingData = await db.data_keuangan_sekolah_kelas.findOne({
            where: {
                kelas: kelas_split,
                kode_pembayaran: kode_pembayaran,
                jenis_pembayaran: jenis_pembayaran
            }
        });

        if (existingData) {
            const updatedData = await existingData.update({
                uang_masuk: uang_masuk,
                kekurangan_pemasukan: kekurangan_pemasukan,
                updated_date: new Date()
            });

            return updatedData.get({ plain: true });
        } else {
            throw new Error('Data not found');
        }
    } catch (error) {
        console.error('Error when updating data', error);
        throw error;
    }
}

async function validasiBulanBayar(nisn, bulan_bayar, tahun_ajaran){
    try {
        const countDataForValidasi = await db.laporan_spp_siswa.count({
            where: {
                nisn,
                bulan_bayar,
                tahun_bayar: tahun_ajaran,
            },
            raw: true,
        });
        return countDataForValidasi;
    } catch (error) {
        console.error('Error when get data validasi', error);
        throw error;
    }
}
// end step input pembayaran

async function nilaiKekuranganPembayaran(nisn){
    try {
        const query = `SELECT 
            (a.nominal_total - SUM(b.nominal_bulan)) AS perhitungan
        FROM 
            jenis_pembayaran a
        JOIN 
            laporan_spp_siswa b
        ON 
            a.kode_pembayaran = b.kode_bayar 
        WHERE 
            b.nisn = :nisn
        GROUP BY 
            a.nominal_total;`;
        
        const responseData = await db.sequelize.query(query, {
            replacements: {nisn},
            type: db.Sequelize.QueryTypes.SELECT,
        });

        return responseData;
    } catch (error) {
        console.error('Error get data nilai kekurangan pembayaran ', error);
        throw error;
    }
}

async function getHistoryPembayaranSppNew(page, pageSize){
    try {
        const totalCount = await db.laporan_spp_siswa.count({
            raw:true,
        });

        const offset = (page - 1) * pageSize;
        const responseData = await db.laporan_spp_siswa.findAll({
            order:[['id','DESC']],
            offset: offset,
            limit: pageSize,
            raw: true,
        });

        // format tanggal bayar
        const formattedData = responseData.map(record => {
            const formattedData = moment(record.tanggal_bayar).format('DD-MM-YYYY');
            return { ...record, tanggal_bayar: formattedData};
        })
        return{
            totalCount: totalCount,
            responseData: formattedData,
        }
    } catch (error) {
        console.error('Error get data table laporan praktikum', error);
        throw error;
    }
}
module.exports = {
    getDataSpp,
    getDataSppByNisn,
    getBulanBelumBayar,
    getKodePembayaran,
    insertPembayaranSpp,
    getDataKekurangan,
    getCountKekuranganPembayaranSiswa,
    getDataKekuaranganPemasukan,
    updateDataKekuranganPemasukan,
    validasiBulanBayar,
    nilaiKekuranganPembayaran,
    getHistoryPembayaranSppNew
}