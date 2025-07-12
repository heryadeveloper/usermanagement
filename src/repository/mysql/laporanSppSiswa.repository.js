const moment = require('moment');
const db = require('../../db/modelsmysql');
const {sequelize} = require('../../db/modelsmysql');
const { QueryTypes } = require('sequelize');
const { raw } = require('body-parser');
const logger = require('../../config/logger');

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
            limit: parseInt(pageSize, 10),
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

// async function getDataSppByNisn(nisn, kelas) {
//     try {
//         const subqueryAllMonths = `
//             SELECT 'Januari' AS bulan, 1 as urutan_bulan UNION
//             SELECT 'Februari' AS bulan, 2 as urutan_bulan UNION
//             SELECT 'Maret' AS bulan, 3 as urutan_bulan UNION
//             SELECT 'April' AS bulan, 4 as urutan_bulan UNION
//             SELECT 'Mei' AS bulan, 5 as urutan_bulan UNION
//             SELECT 'Juni' AS bulan, 6 as urutan_bulan UNION
//             SELECT 'Juli' AS bulan, 7 as urutan_bulan UNION
//             SELECT 'Agustus' AS bulan, 8 as urutan_bulan UNION
//             SELECT 'September' AS bulan, 9 as urutan_bulan UNION
//             SELECT 'Oktober' AS bulan, 10 as urutan_bulan UNION
//             SELECT 'November' AS bulan, 11 as urutan_bulan UNION
//             SELECT 'Desember' AS bulan, 12 as urutan_bulan
//         `;

//         const query = `
//             SELECT 
//                 all_months.bulan, 
//                 COALESCE(paid_months.nominal_bulan, 0) AS nominal,
//                 paid_months.tahun_bayar,
//                 date_format(paid_months.tanggal_bayar, '%d %M %Y') AS tanggal_bayar,
//                 paid_months.petugas_input
//             FROM (${subqueryAllMonths}) AS all_months
//             LEFT JOIN (
//                 SELECT 
//                     bulan_bayar, 
//                     nominal_bulan, 
//                     tahun_bayar, 
//                     tanggal_bayar, 
//                     petugas_input
//                 FROM laporan_spp_siswa
//                 WHERE nisn = :nisn
//                 and tahun_bayar not in ('N')
//                 and kelas = :kelas
//             ) AS paid_months
//             ON all_months.bulan = paid_months.bulan_bayar
//             WHERE COALESCE(paid_months.nominal_bulan, 0) != 0
//             ORDER BY all_months.urutan_bulan;
//         `;

//         const responseData = await db.sequelize.query(query, {
//             replacements: { nisn, kelas },
//             type: QueryTypes.SELECT,
//         });
//         console.log('response dari query: ', responseData);

//         return responseData;

//     } catch (error) {
//         console.error('Error when getting data SPP: ', error);
//         throw error;
//     }
// }

async function getDataSppByNisn(nisn, kode_bayar){
    try {
        const response = await db.payment_siswa.findAll({
            where:{
                nisn,
                kode_bayar
            },
            order:[['urut_bulan','ASC']],
            raw: true,
        });
        return response;
    } catch (error) {
        logger.error('Error when getting data : ', error);
        throw error;
    }
}

async function getBulanBelumBayar(nisn, kelas, tahunAjaranBaru) {
    try {
        const subqueryAllMonths = `
        SELECT 'Juli' AS bulan, 1 AS urut_bulan UNION
        SELECT 'Agustus' AS bulan, 2 AS urut_bulan UNION
        SELECT 'September' AS bulan, 3 AS urut_bulan UNION
        SELECT 'Oktober' AS bulan, 4 AS urut_bulan UNION
        SELECT 'November' AS bulan, 5 AS urut_bulan UNION
        SELECT 'Desember' AS bulan, 6 AS urut_bulan UNION
        SELECT 'Januari' AS bulan, 7 AS urut_bulan UNION
        SELECT 'Februari' AS bulan, 8 AS urut_bulan UNION
        SELECT 'Maret' AS bulan, 9 AS urut_bulan UNION
        SELECT 'April' AS bulan, 10 AS urut_bulan UNION
        SELECT 'Mei' AS bulan,11 AS urut_bulan UNION
        SELECT 'Juni' AS bulan, 12 AS urut_bulan
        `;

        const query = `
        WITH all_months AS (
            ${subqueryAllMonths}
        ),
        all_periods AS (
            SELECT 
                bulan, 
                CASE 
                    WHEN urut_bulan < 7 THEN :tahun_ajaran
                    ELSE :tahun_ajaran + 1
                END AS tahun_ajaran,
                urut_bulan
            FROM all_months
        )
        SELECT b.urut_bulan, b.bulan, b.tahun_ajaran
        FROM all_periods b
        LEFT JOIN payment_siswa ps
            ON ps.urut_bulan = b.urut_bulan
            AND ps.nisn = :nisn
            AND ps.kelas = :kelas
        WHERE ps.urut_bulan IS NULL;
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
async function getKodePembayaran(kelas, tahun_ajaran){
    const kelas_split = kelas.split(' ')[0];

    const getKodeBayar = await db.jenis_pembayaran.findAll({
        where: {
            jenis_transaksi: 'SPP',
            kelas: kelas_split,
            tahun_ajaran: tahun_ajaran
        },
        attributes:['jenis_transaksi','kode_pembayaran', 'nominal_bulan', 'nominal_total'],
        raw: true
    });
    return getKodeBayar;
}

async function insertPaymentSiswa(nama, kelas, nisn, kode_bayar, jenis_transaksi, nominal, bulan_bayar, petugas_input, tanggal_bayar, tahun_ajaran, urut_bulan){
    try {
        await db.payment_siswa.create({
            nama_siswa: nama,
            kelas,
            nisn,
            bulan_bayar,
            tanggal_bayar,
            kode_bayar,
            jenis_transaksi,
            nominal_bayar: nominal,
            created_at: new Date,
            inputter: petugas_input,
            tahun_bayar: tahun_ajaran,
            urut_bulan
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
        const dataKekuranganPemasukan = await db.data_keuangan_skolah_kelas.findOne({
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

        const existingData = await db.data_keuangan_skolah_kelas.findOne({
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

async function nilaiKekuranganPembayaran(nisn, kelas, jenis_transaksi){
    try {
        console.log(nisn, kelas, jenis_transaksi);
        const query = `select 
                    jp.nominal_bulan,
                    jp.kode_pembayaran,
                    jp.nominal_total,
                    ps.nama_siswa,
                    (jp.nominal_total - SUM(ps.nominal_bayar)) as perhitungan_bayar
                    from payment_siswa ps 
                    join jenis_pembayaran jp 
                    on ps.jenis_transaksi = jp.jenis_transaksi
                    and jp.kelas  = left(ps.kelas, LOCATE(' ', ps.kelas) - 1)
                    and jp.kode_pembayaran = ps.kode_bayar
                    where ps.nisn = :nisn
                    and ps.jenis_transaksi = :jenis_transaksi
                    and ps.kelas = :kelas`
                    ;
                                
        const responseData = await db.sequelize.query(query, {
            replacements: {nisn, kelas, jenis_transaksi},
            type: db.Sequelize.QueryTypes.SELECT,
        });
        console.log(responseData);
        return responseData;
    } catch (error) {
        console.error('Error get data nilai kekurangan pembayaran ', error);
        throw error;
    }
}

async function getHistoryPembayaranSppNew(page, pageSize){
    try {
        // Validasi parameter
        if (isNaN(page) || page < 1) {
            throw new Error("Parameter 'page' harus berupa angka positif.");
        }
        const pageSizeNumeric = Number(pageSize);
        if (isNaN(pageSizeNumeric) || pageSizeNumeric < 1) {
            throw new Error("Parameter 'pageSize' harus berupa angka positif.");
        }

        const totalCount = await db.laporan_spp_siswa.count({
            raw:true,
        });

        const offset = (page - 1) * pageSizeNumeric;

        const responseData = await db.laporan_spp_siswa.findAll({
            order:[['id','DESC']],
            offset: offset,
            limit: pageSizeNumeric,
            raw: true,
        });

        const formattedData = responseData.map((record) => ({
            ...record,
            tanggal_bayar: record.tanggal_bayar 
                ? moment(record.tanggal_bayar).format('DD-MM-YYYY') 
                : null, // Handle null or undefined values
        }));

        return{
            totalCount: totalCount,
            responseData: formattedData,
        }
    } catch (error) {
        console.error('Error get data table laporan praktikum', error);
        throw error;
    }
}

async function jenisPembayaran(tahun_ajaran){
    try {
        const query = `select * from jenis_pembayaran jp 
            where jp.tahun_ajaran = :tahun_ajaran
            and jp.jenis_transaksi not in ('SPP') `;
                                
        const responseData = await db.sequelize.query(query, {
            replacements: {tahun_ajaran},
            type: db.Sequelize.QueryTypes.SELECT,
        });

        return responseData;
    } catch (error) {
        console.error('Error get data nilai kekurangan pembayaran ', error);
        throw error;
    }
}

async function jenisPembayaranPaymentUsingJenisTransaksi(tahun_ajaran, jenis_transaksi) {
    try {
        const query =   `select * from jenis_pembayaran jp
                        where jp.tahun_ajaran = :tahun_ajaran
                        and jp.jenis_transaksi = :jenis_transaksi
                        and jp.jenis_transaksi not in ('SPP')`;
        const responseData = await db.sequelize.query(query, {
            replacements: {tahun_ajaran, jenis_transaksi},
            type: db.Sequelize.QueryTypes.SELECT,
        });

        return responseData;
    } catch (error) {
        console.error('Error get payment ', error);
        throw error;
    }
}

async function insertJenisPembayaran(kode_pembayaran, jenis_transaksi, kelas, nominal_bulan, nominal_total, tahun_ajaran) {
    try {
        const data = await db.jenis_pembayaran.create({
            kode_pembayaran,
            jenis_transaksi,
            kelas,
            nominal_bulan,
            nominal_total,
            created_at: new Date,
            tahun_ajaran
        });
        return data.get({ plain:true });
    } catch (error) {
        console.error('Error when inserting data table laporan spp ', error);
        throw error;
    }
}

async function getJenisPembayaranAll() {
    try {
        const query = `select * from jenis_pembayaran jp`;
                                
        const responseData = await db.sequelize.query(query, {
            type: db.Sequelize.QueryTypes.SELECT,
        });

        return responseData;
    } catch (error) {
        console.error('Error when get all jenis pembayaran', error);
        throw error;
    }
}

async function getRekapPembayaranSpp(kelas){
    try {
        const query = `  select
                            lss.nama_siswa,
                            lss.kelas,
                            lss.nominal_bulan,
                            lss.bulan_bayar ,
                            jp.nominal_total
                            from laporan_spp_siswa lss 
                            join jenis_pembayaran jp 
                                on lss.kode_bayar = jp.kode_pembayaran
                        where lss.kelas =:kelas
                        order by lss.nama_siswa asc`;
        const result = await db.sequelize.query(query, {
            replacements: {kelas},
            type: db.Sequelize.QueryTypes.SELECT,
        });

        // Kelompokkan data per siswa
        const siswaMap = new Map();
        
        result.forEach(item => {
            if (!siswaMap.has(item.nama_siswa)) {
                siswaMap.set(item.nama_siswa, {
                    nama: item.nama_siswa,
                    kelas: item.kelas,
                    pembayaran: {
                        JULI: 0,
                        AGUST: 0,
                        SEPT: 0,
                        OKTO: 0,
                        NOPE: 0,
                        DESE: 0,
                        JANU: 0,
                        FEBRU: 0,
                        MAR: 0,
                        APRIL: 0,
                        MEI: 0,
                        JUNI: 0
                    },
                    sasaran: item.nominal_total,
                    capaian: 0,
                    kekurangan: 0,
                    rowColor: 'red'
                });
            }
            
            const siswaData = siswaMap.get(item.nama_siswa);
            const bulanKey = getBulanKey(item.bulan_bayar);
            
            if (bulanKey) {
                siswaData.pembayaran[bulanKey] = item.nominal_bulan;
                siswaData.capaian += item.nominal_bulan;
            }
        });

        // Hitung kekurangan dan tentukan warna untuk setiap siswa
        const formattedData = Array.from(siswaMap.values()).map(siswa => {
            siswa.kekurangan = siswa.sasaran - siswa.capaian;
            siswa.rowColor = siswa.capaian >= siswa.kekurangan ? 'green' : 'red';
            return siswa;
        });
        return formattedData;

    } catch (error) {
        console.error('Error: ', error);
        throw error;
    }
}

async function getRekapPembayaranPraktik(kelas){
    try {
        const query = `select
                            lss.nama_siswa,
                            lss.kelas,
                            lss.nominal_bulan,
                            lss.bulan_bayar ,
                            jp.nominal_total
                            from laporan_praktikum_siswa lss
                            join jenis_pembayaran jp
                                on lss.kode_bayar = jp.kode_pembayaran
                        where lss.kelas =:kelas
                        order by lss.nama_siswa asc`;
        const result = await db.sequelize.query(query, {
            replacements: {kelas},
            type: db.Sequelize.QueryTypes.SELECT,
        });

        // Kelompokkan data per siswa
        const siswaMap = new Map();
        
        result.forEach(item => {
            if (!siswaMap.has(item.nama_siswa)) {
                siswaMap.set(item.nama_siswa, {
                    nama: item.nama_siswa,
                    kelas: item.kelas,
                    pembayaran: {
                        JULI: 0,
                        AGUST: 0,
                        SEPT: 0,
                        OKTO: 0,
                        NOPE: 0,
                        DESE: 0,
                        JANU: 0,
                        FEBRU: 0,
                        MAR: 0,
                        APRIL: 0,
                        MEI: 0,
                        JUNI: 0
                    },
                    sasaran: item.nominal_total,
                    capaian: 0,
                    kekurangan: 0,
                    rowColor: 'red'
                });
            }
            
            const siswaData = siswaMap.get(item.nama_siswa);
            const bulanKey = getBulanKey(item.bulan_bayar);
            
            if (bulanKey) {
                siswaData.pembayaran[bulanKey] = item.nominal_bulan;
                siswaData.capaian += item.nominal_bulan;
            }
        });

        // Hitung kekurangan dan tentukan warna untuk setiap siswa
        const formattedData = Array.from(siswaMap.values()).map(siswa => {
            siswa.kekurangan = siswa.sasaran - siswa.capaian;
            siswa.rowColor = siswa.capaian >= siswa.kekurangan ? 'green' : 'red';
            return siswa;
        });
        return formattedData;


    } catch (error) {
        console.error('Error: ', error);
        throw error;
    }
}


// Helper function untuk mengkonversi nama bulan ke key yang diinginkan
function getBulanKey(bulan) {
    const bulanMap = {
        'Juli': 'JULI',
        'Agustus': 'AGUST',
        'September': 'SEPT',
        'Oktober': 'OKTO',
        'November': 'NOPE',
        'Desember': 'DESE',
        'Januari': 'JANU',
        'Februari': 'FEBRU',
        'Maret': 'MAR',
        'April': 'APRIL',
        'Mei': 'MEI',
        'Juni': 'JUNI'
    };
    return bulanMap[bulan];
}

async function getJeninsPembayaranForNominal(kelas, tahun_ajaran){
    try {
        const query = ` select
                            jp.jenis_transaksi,
                            jp.kode_pembayaran 
                            from jenis_pembayaran jp 
                            where jp.kelas =:kelas
                            and jp.tahun_ajaran =:tahun_ajaran`;
        const result = await db.sequelize.query(query, {
            replacements: {kelas, tahun_ajaran},
            type: db.Sequelize.QueryTypes.SELECT,
        })

        return result;
    } catch (error) {
        console.error('Error: ', error);
        throw error;

    }
}
module.exports = {
    getDataSpp,
    getDataSppByNisn,
    getBulanBelumBayar,
    getKodePembayaran,
    insertPaymentSiswa,
    getDataKekurangan,
    getCountKekuranganPembayaranSiswa,
    getDataKekuaranganPemasukan,
    updateDataKekuranganPemasukan,
    validasiBulanBayar,
    nilaiKekuranganPembayaran,
    getHistoryPembayaranSppNew,
    jenisPembayaran,
    jenisPembayaranPaymentUsingJenisTransaksi,
    insertJenisPembayaran,
    getJenisPembayaranAll,
    getRekapPembayaranSpp,
    getRekapPembayaranPraktik,
    getJeninsPembayaranForNominal
}