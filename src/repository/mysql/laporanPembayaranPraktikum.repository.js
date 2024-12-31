const { raw } = require('body-parser');
const db = require('../../db/modelsmysql/');
const { format } = require('date-fns');
const moment = require('moment')

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
        console.error('Error get data', error);
        throw error;
    }
}

async function historyPembayaranPraktikumByNisn(kelas, nisn) {
    try {
        const historyPembayaranPraktikumByNisn = await db.laporan_praktikum_siswa.findAll({
            where:{
                kelas,
                nisn
            },
            attributes: ['bulan_bayar', 'nominal_bulan', 'tanggal_bayar', 'petugas_input'],
            raw: true,
        });
        const formattedHistory = historyPembayaranPraktikumByNisn.map(entry => {
            const formattedDate = format(new Date(entry.tanggal_bayar), 'dd-MM-yyyy');
            return {
                ...entry,
                tanggal_bayar: formattedDate
            };
        });

        return formattedHistory;
    } catch (error) {
        console.error('Error get data', error);
        throw error;
    }
}

async function sumPembayaranPraktikum(nisn){
    try {
        const totalNominalBulan = await db.laporan_praktikum_siswa.findAll({
            attributes: [[db.sequelize.fn('sum', db.sequelize.col('nominal_bulan')), 'totalNominalBulan']],
            where: {
                nisn: nisn
            }
        });
          // Extract the sum from the result
        const sum = totalNominalBulan[0].get('totalNominalBulan');
        return sum;
    } catch (error) {
        console.error('Error get data', error);
        throw error;
    }
}

async function dataJenisPembayaranPraktikum(kelas){
    try {
        const kelas_split = kelas.split(' ')[0];
        const jenisPembayaran = await db.jenis_pembayaran.findAll({
            where: {
                jenis_transaksi: 'Praktik',
                kelas: kelas_split,
            },
            attributes:['kode_pembayaran', 'nominal_bulan', 'nominal_total'],
            raw: true
        })

        return jenisPembayaran;
    } catch (error) {
        console.error('Error get data', error);
        throw error;
    }
}

async function getKodePembayaranParktikum(kelas){
    const kelas_split = kelas.split(' ')[0];

    const getKodeBayar = await db.jenis_pembayaran.findAll({
        where: {
            jenis_transaksi: 'Praktik',
            kelas: kelas_split,
        },
        attributes:['kode_pembayaran', 'nominal_bulan', 'nominal_total'],
        raw: true
    });
    return getKodeBayar;
}

async function insertPembayaranPraktikum(nama, kelas, nisn, bulan_bayar, tanggal_bayar,  kode_bayar, nominal_bulan, petugas_input, tahun_bayar){
    try {
        await db.laporan_praktikum_siswa.create({
            nama_siswa : nama,
            kelas,
            nisn,
            bulan_bayar,
            tanggal_bayar: new Date,
            kode_bayar,
            jenis_transaksi: 'Praktik',
            nominal_bulan,
            created_at : new Date,
            petugas_input,
            tahun_bayar
        });
    } catch (error) {
        console.error('Error when inserting data table laporan praktikum', error);
        throw error;
    }
}

async function getHistoryPembayaranNew(page, pageSize){
    try {
        const totalCount = await db.laporan_praktikum_siswa.count({
            raw:true,
        });

        const offset = (page - 1) * pageSize;
        const responseData = await db.laporan_praktikum_siswa.findAll({
            order:[['id','DESC']],
            offset: offset,
            limit: pageSize,
            raw: true,
        });
        // format tanggal bayar
        const formattedData = responseData.map(record => {
            const formattedData = moment(record.tanggal_bayar).format('DD-MM-YYYY');
            return { ...record, tanggal_bayar: formattedData};
        });

        return{
            totalCount: totalCount,
            responseData: formattedData,
        }
    } catch (error) {
        console.error('Error get data table laporan praktikum', error);
        throw error;
    }
}

async function insertPaymentSiswa(nama, kelas, nisn, bulan, tanggal_bayar, kode_bayar, jenis_transaksi, nominal, inputter){
    try {
        const insertPaymentSiswa = await db.payment_siswa.create({
            nama_siswa: nama,
            kelas,
            nisn,
            bulan_bayar: bulan,
            tanggal_bayar,
            kode_bayar,
            jenis_transaksi,
            nominal_bayar: nominal,
            created_ad: new Date(),
            inputter
        });
        return insertPaymentSiswa.get({ plain:true });
    } catch (error) {
        console.error('Error when inserting data into table payment-siswa', error);
        throw error;
    }

}

async function historyPaymentSiswaByNisn(kelas, nisn, jenis_transaksi) {
    try {
        const historyPembayaranPraktikumByNisn = await db.payment_siswa.findAll({
            where:{
                kelas,
                nisn,
                jenis_transaksi
            },
            attributes: ['bulan_bayar', 'nominal_bayar', 'tanggal_bayar', 'inputter'],
            raw: true,
        });
        const formattedHistory = historyPembayaranPraktikumByNisn.map(entry => {
            const formattedDate = format(new Date(entry.tanggal_bayar), 'dd-MM-yyyy');
            return {
                ...entry,
                tanggal_bayar: formattedDate
            };
        });

        return formattedHistory;
    } catch (error) {
        console.error('Error get data', error);
        throw error;
    }
}

async function dataJenisPembayaranPraktikumNew(kelas, jenis_transaksi, tahun_ajaran){
    try {
        const kelas_split = kelas.split(' ')[0];
        const jenisPembayaran = await db.jenis_pembayaran.findAll({
            where: {
                jenis_transaksi,
                kelas: kelas_split,
                tahun_ajaran
            },
            attributes:['kode_pembayaran', 'nominal_bulan', 'nominal_total'],
            raw: true
        })
        console.log('jenisPembayaran : ', jenisPembayaran);
        return jenisPembayaran;
    } catch (error) {
        console.error('Error get data', error);
        throw error;
    }
}

async function sumPaymentSiswa(nisn, jenis_transaksi){
    try {
        const query = `select sum(nominal_bayar) totalNominalBulan from payment_siswa ps where ps.nisn = :nisn and ps.jenis_transaksi = :jenis_transaksi`;
        const responseData = await db.sequelize.query(query, {
        replacements: {nisn, jenis_transaksi},
        type: db.Sequelize.QueryTypes.SELECT,
        });

        return responseData;
    } catch (error) {
        console.error('Error get data', error);
        throw error;
    }
}

async function updateJenisPayment (kode_pembayaran, jenis_transaksi, kelas, nominal_bulan, nominal_total, tahun_ajaran){
    try {
        const query = `update jenis_pembayaran a set a.jenis_transaksi = :jenis_transaksi, a.kelas = :kelas, a.nominal_bulan = :nominal_bulan, a.nominal_total = :nominal_total , a.tahun_ajaran = :tahun_ajaran
            where a.kode_pembayaran = :kode_pembayaran`;
        
        // eksekusi query update
            await db.sequelize.query(query, {
            replacements: {kode_pembayaran, jenis_transaksi, kelas, nominal_bulan, nominal_total, tahun_ajaran},
            type: db.Sequelize.QueryTypes.UPDATE,
        });

        // Query untuk mendapatkan data yang diperbarui
        const selectQuery = `
        SELECT *
        FROM jenis_pembayaran
        WHERE kode_pembayaran = :kode_pembayaran`;
        const updatedData = await db.sequelize.query(selectQuery, {
            replacements: { kode_pembayaran },
            type: db.Sequelize.QueryTypes.SELECT,
        });

        return updatedData;
    } catch (error) {
        console.error('Error update data', error);
        throw error;
    }
}

module.exports = {
    dataPembayaranPraktikum,
    historyPembayaranPraktikumByNisn,
    sumPembayaranPraktikum,
    dataJenisPembayaranPraktikum,
    getKodePembayaranParktikum,
    insertPembayaranPraktikum,
    getHistoryPembayaranNew,
    insertPaymentSiswa,
    historyPaymentSiswaByNisn, dataJenisPembayaranPraktikumNew,
    sumPaymentSiswa, updateJenisPayment
}