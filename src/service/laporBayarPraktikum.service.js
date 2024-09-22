const { laporanPembayaranPraktikumRepository, laporanSppSiswaRepository, kekuranganPembayaranRepository } = require("../repository");

async function dataPemasukanPraktikum(req){
    try {
        const {bulan_bayar, tahun_bayar, kelas, page, pageSize} = req.query;
        const dataPemasukanPraktik = await laporanPembayaranPraktikumRepository.dataPembayaranPraktikum(bulan_bayar, tahun_bayar, kelas, page, pageSize);
        return dataPemasukanPraktik;
    } catch (error) {
        console.error('error service get data pemasukan praktikum', error);
        throw error;
    }
}

async function historyPembayaranPraktikumByNisn(req){
    try {
        const {kelas, nisn} = req.query;
        const historyPembayaranPraktikumByNisn = await laporanPembayaranPraktikumRepository.historyPembayaranPraktikumByNisn(kelas, nisn);

        // perhitungan kekurangan
        const jenispmebayaran = await laporanPembayaranPraktikumRepository.dataJenisPembayaranPraktikum(kelas);
        console.log('nominal : ', jenispmebayaran[0].nominal_total);

        const sumTotalHasPaid = await laporanPembayaranPraktikumRepository.sumPembayaranPraktikum(nisn);
    
        const kekurangan = jenispmebayaran[0].nominal_total - sumTotalHasPaid;
    
        const data = kekurangan;
        return {
            result: historyPembayaranPraktikumByNisn,
            kekurangan: data
        };
    } catch (error) {
        console.error('error service get data pemasukan praktikum', error);
        throw error;
    }
}

async function insertPembayaranPraktikum(req){
    const {nama, nisn, kelas, nominal, periode, petugas_input, tahun_ajaran, tanggal_bayar, bulan} = req.body;
    try {
        console.log('date baru : ', new Date);
        const findDataPraktikum = await laporanPembayaranPraktikumRepository.getKodePembayaranParktikum(kelas);
        const kode_bayar_praktikum = findDataPraktikum[0].kode_pembayaran;
        console.log('kode bayar', kode_bayar_praktikum);

        const dataKurangBayar = await laporanSppSiswaRepository.getDataKekurangan(nisn, kode_bayar_praktikum);
        console.log('data kekurangan praktikum', dataKurangBayar);

        const countDataPembayaranPraktikum = await laporanSppSiswaRepository.getCountKekuranganPembayaranSiswa(nisn, kode_bayar_praktikum);

        // insert table laporan_bayar_praktikum
        await laporanPembayaranPraktikumRepository.insertPembayaranPraktikum(nama, kelas, nisn, bulan, tanggal_bayar, kode_bayar_praktikum, nominal, petugas_input, tahun_ajaran);
        
        if (countDataPembayaranPraktikum === 0){
            const perhitungan_kekurangan = findDataPraktikum[0].nominal_total - nominal;
            await kekuranganPembayaranRepository.insertTableKekuranganPembayaranSiswa(nama, kelas, nisn, kode_bayar_praktikum, 'Praktik', perhitungan_kekurangan, petugas_input);
        }else {
            const nominal_akhir = dataKurangBayar[0].nilai_terkecil;
            const perhitunganNominalAkhir = nominal_akhir - nominal;
            await kekuranganPembayaranRepository.insertTableKekuranganPembayaranSiswa(nama, kelas, nisn, kode_bayar_praktikum, 'Praktik', perhitunganNominalAkhir, petugas_input);
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

async function getHistoryPembayaranNew(req){
    try {
        const {page, pageSize} = req.query;
        const dataHistoryPembayaranNew = await laporanPembayaranPraktikumRepository.getHistoryPembayaranNew(page, pageSize);
        return dataHistoryPembayaranNew;
    } catch (error) {
        console.error('error in service method get history pembayaran new', error)
        throw error;
    }
}

module.exports = {
    dataPemasukanPraktikum,
    historyPembayaranPraktikumByNisn,
    insertPembayaranPraktikum,
    getHistoryPembayaranNew
}