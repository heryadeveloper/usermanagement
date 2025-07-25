const { Http } = require("winston/lib/winston/transports");
const { laporanSppSiswaRepository, kekuranganPembayaranRepository, laporanSppMysqlRepository, kekuranganPembayaranMysqlRepository } = require("../repository");
const ApiError = require("../utils/ApiError");
const expectationFailed = require('../utils/errorExpectationFailed');
const httpStatus = require("http-status");
const logger = require("../config/logger");

async function getDataSpp(req){
    try {
        const { bulan_bayar, tahun_bayar, kelas, page, pageSize } = req.query;
        const getDataSppTransaksi =  laporanSppMysqlRepository.getDataSpp(bulan_bayar, tahun_bayar, kelas, page, pageSize);
        return getDataSppTransaksi
    } catch (error) {
        console.error('Error in service get data spp', error);
        throw error;
    }
}

async function getDataSppByNisn(req){
    try {
        const { nisn, kode_bayar} = req.query;
        console.log('payload: ', nisn);
        const getDataSppByNisns = await laporanSppMysqlRepository.getDataSppByNisn(nisn, kode_bayar);
        console.log('get data: ', getDataSppByNisns);
        let nilaiKekuranganSiswa = null;
        if (getDataSppByNisns) {
            nilaiKekuranganSiswa = await laporanSppMysqlRepository.nilaiKekuranganPembayaran(nisn, getDataSppByNisns[0].kelas, getDataSppByNisns[0].jenis_transaksi);
            console.log('data 1: ', nilaiKekuranganSiswa);
        }
        
        return {
            dataSpp: getDataSppByNisns,
            nilaiKekurangan: nilaiKekuranganSiswa,
        };
    } catch (error) {
        console.error('Error in service get data by nisn', error);
        throw error;
    }
}

async function getBulanBelumBayar(req){
    try {
        const { nisn, kelas, tahunAjaran} = req.query;
        const getDataBulan = laporanSppMysqlRepository.getBulanBelumBayar(nisn, kelas, tahunAjaran);
        return getDataBulan;
    } catch (error) {
        console.error('Error in service get data : ', error);
        throw error;
    }
}

async function inputPembayaran(req){
    const {nama, nisn, kelas, nominal, periode, petugas_input, tahun_ajaran, tanggal_bayar, bulan} = req.body;
    try {
        const findKodePembayaran = await laporanSppMysqlRepository.getKodePembayaran(kelas, tahun_ajaran);
        const kode_bayar = findKodePembayaran[0].kode_pembayaran;
        const jenis_transaksi = findKodePembayaran[0].jenis_transaksi;
        console.log('kode bayar ', kode_bayar);
        console.log('jenis transaksi ', jenis_transaksi);
        for(const datas of bulan){
            const {bulan_bayar, nominal_bayar, tahun_ajaran, urut_bulan} = datas;

             // validasi terlebih dahulu, jika bulan dan tahun ajaran sudah ada di DB langsung di tolak transaksinya.
            const validasiBulanBayar = await laporanSppMysqlRepository.validasiBulanBayar(nisn, bulan_bayar, tahun_ajaran);
            if (validasiBulanBayar !== 0) {
                throw new ApiError(httpStatus.CONFLICT, 'bulan is available in table');
            } else {
                const nominal = parseFloat(nominal_bayar);
                const dataKurangBayar = await laporanSppMysqlRepository.getDataKekurangan(nisn, kode_bayar);
            
                const countData = await laporanSppMysqlRepository.getCountKekuranganPembayaranSiswa(nisn, kode_bayar);
                // insert table bayar spp
                await laporanSppMysqlRepository.insertPaymentSiswa(nama, kelas, nisn, kode_bayar, jenis_transaksi, nominal_bayar, bulan_bayar, petugas_input, tanggal_bayar, tahun_ajaran, urut_bulan);
                if (countData === 0) {
                    const perhitungan = findKodePembayaran[0].nominal_total - nominal_bayar;
                    await kekuranganPembayaranMysqlRepository.insertTableKekuranganPembayaranSiswa(nama, kelas, nisn, kode_bayar, 'SPP', perhitungan, petugas_input);
                } else {
                    console.log('perhitungan bulan: ', bulan_bayar);
                    const nominal_akhir = dataKurangBayar[0].nilai_terkecil;
                    const perhitunganNominalAkhir = nominal_akhir - nominal_bayar;
                    await kekuranganPembayaranMysqlRepository.insertTableKekuranganPembayaranSiswa(nama, kelas, nisn, kode_bayar, 'SPP', perhitunganNominalAkhir, petugas_input);
                    
                    //get data keuangan sekolah
                    const getDataKeuanganSekolah = await laporanSppMysqlRepository.getDataKekuaranganPemasukan(kode_bayar);
                    const uang_sisa_kekurangan = parseFloat(getDataKeuanganSekolah.kekurangan_pemasukan);
                    const uang_masuk = parseFloat(getDataKeuanganSekolah.uang_masuk);
                    const perhitungan_sisa_kekurangan = uang_sisa_kekurangan - nominal;
                    const perhitungan_uang_masuk = uang_masuk + nominal;
                    await laporanSppMysqlRepository.updateDataKekuranganPemasukan(kelas, kode_bayar, 'SPP', perhitungan_uang_masuk, perhitungan_sisa_kekurangan);
                }
            }
        }
        return {
            nama,
            nisn,
            bulan
        };
    } catch (error) {
        console.error('Error in service input pembayaran', error);
        throw error;
    }
}

async function getHistoryPembayaranSppNew(req){
    try {
        const {page, pageSize} = req.query;
        const dataHistoryPembayaranSppNew = laporanSppMysqlRepository.getHistoryPembayaranSppNew(page, pageSize);
        return dataHistoryPembayaranSppNew;
    } catch (error) {
        console.error('Error in service method get history pembayaran new', error)
        throw error;
    }
}

async function getJenisPembayaran(req){
    const {tahun_ajaran} = req.query;
    try {
        const jenisPembayaran = laporanSppMysqlRepository.jenisPembayaran(tahun_ajaran);
        return jenisPembayaran;
    }catch (error){
        console.error('Error in service method get jenis pembayaran ', error);
        throw error;
    }
}

async function insertJenisPembayaran(req) {
    const {kode_pembayaran, jenis_transaksi, kelas, nominal_bulan, nominal_total, tahun_ajaran} = req.body;
    try {
        const data = await laporanSppMysqlRepository.insertJenisPembayaran(kode_pembayaran, jenis_transaksi, kelas, nominal_bulan, nominal_total, tahun_ajaran);
        return data;
    } catch (error) {
        console.error('Error in service when inserting data ', error);
        throw error;
    }
}

async function getJenisPembayaranAll() {
    try {
        const data = await laporanSppMysqlRepository.getJenisPembayaranAll();
        return data;
    } catch (error) {
        console.error('Error when get all jenis pembayaran ', error);
        throw error;
    }
}

async function getRekapPembayaranSpp(req){
    const {kelas, jenisPembayaran} = req.query;
    try {
        let data = null;
        if(jenisPembayaran === 'SPP'){
            data = await laporanSppMysqlRepository.getRekapPembayaranSpp(kelas);
        }else{
            console.log('Rule Payment Praktik');
            data = await laporanSppMysqlRepository.getRekapPembayaranPraktik(kelas);
        }
        return data;
    } catch (error) {
        console.error('error when get data rekap: ', error);
        throw error;
    }
}

async function getJeninsPembayaranForNominal(req) {
    const {kelas, tahun_ajaran} = req.query;
    try {
        data = await laporanSppMysqlRepository.getJeninsPembayaranForNominal(kelas, tahun_ajaran);
        return data;
    } catch (error) {
        console.error('error when get jenis pembayaran: ', error);
        throw error;
    }
    
}

module.exports = {
    getDataSpp,
    getDataSppByNisn,
    getBulanBelumBayar,
    inputPembayaran,
    getHistoryPembayaranSppNew,
    getJenisPembayaran,
    insertJenisPembayaran,
    getJenisPembayaranAll,
    getRekapPembayaranSpp,
    getJeninsPembayaranForNominal
}