const { laporanPembayaranPraktikumRepository, laporanSppSiswaRepository, kekuranganPembayaranRepository, laporanPraktikumSiswaMysqlRepository, laporanSppMysqlRepository, kekuranganPembayaranMysqlRepository } = require("../repository");

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
        const historyPembayaranPraktikumByNisn = await laporanPraktikumSiswaMysqlRepository.historyPembayaranPraktikumByNisn(kelas, nisn);

        // perhitungan kekurangan
        const jenispmebayaran = await laporanPraktikumSiswaMysqlRepository.dataJenisPembayaranPraktikum(kelas);
        console.log('nominal : ', jenispmebayaran[0].nominal_total);

        const sumTotalHasPaid = await laporanPraktikumSiswaMysqlRepository.sumPembayaranPraktikum(nisn);
    
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
        const findDataPraktikum = await laporanPraktikumSiswaMysqlRepository.getKodePembayaranParktikum(kelas);
        const kode_bayar_praktikum = findDataPraktikum[0].kode_pembayaran;
        console.log('kode bayar', kode_bayar_praktikum);

        const dataKurangBayar = await laporanSppMysqlRepository.getDataKekurangan(nisn, kode_bayar_praktikum);
        console.log('data kekurangan praktikum', dataKurangBayar);

        const countDataPembayaranPraktikum = await laporanSppMysqlRepository.getCountKekuranganPembayaranSiswa(nisn, kode_bayar_praktikum);

        // insert table laporan_bayar_praktikum
        await laporanPraktikumSiswaMysqlRepository.insertPembayaranPraktikum(nama, kelas, nisn, bulan, tanggal_bayar, kode_bayar_praktikum, nominal, petugas_input, tahun_ajaran);
        
        if (countDataPembayaranPraktikum === 0){
            const perhitungan_kekurangan = findDataPraktikum[0].nominal_total - nominal;
            await kekuranganPembayaranMysqlRepository.insertTableKekuranganPembayaranSiswa(nama, kelas, nisn, kode_bayar_praktikum, 'Praktik', perhitungan_kekurangan, petugas_input);
        }else {
            const nominal_akhir = dataKurangBayar[0].nilai_terkecil;
            const perhitunganNominalAkhir = nominal_akhir - nominal;
            await kekuranganPembayaranMysqlRepository.insertTableKekuranganPembayaranSiswa(nama, kelas, nisn, kode_bayar_praktikum, 'Praktik', perhitunganNominalAkhir, petugas_input);
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

async function insertPaymentSiswa(req) {
    const {nama, kelas, nisn, bulan_bayar, tanggal_bayar, kode_bayar, jenis_transaksi, nominal, inputter, tahun_ajaran} = req.body;
    try {
        const findKodePembayaran = await laporanSppMysqlRepository.jenisPembayaranPaymentUsingJenisTransaksi(tahun_ajaran, jenis_transaksi);
        const kdbayar = findKodePembayaran[0].kode_pembayaran;
        
        const dataKurangBayar = await laporanSppMysqlRepository.getDataKekurangan(nisn, kdbayar);

        const countDataPembayaranPraktikum = await laporanSppMysqlRepository.getCountKekuranganPembayaranSiswa(nisn, kdbayar);

        // insert table laporan_bayar_praktikum
        await laporanPraktikumSiswaMysqlRepository.insertPaymentSiswa(nama, kelas, nisn, bulan_bayar, tanggal_bayar, kode_bayar, jenis_transaksi, nominal, inputter);

        if (countDataPembayaranPraktikum === 0) {
            const perhitungan_kekurangan = findKodePembayaran[0].nominal_total;
            const nominal_akhir_input = perhitungan_kekurangan - nominal;
            await kekuranganPembayaranMysqlRepository.insertTableKekuranganPembayaranSiswa(nama, kelas, nisn, kode_bayar, jenis_transaksi, nominal_akhir_input, inputter);
        } else {
            const nominal_akhir = dataKurangBayar[0].nilai_terkecil;
            const perhitunganNominalAkhir = nominal_akhir - nominal;
            await kekuranganPembayaranMysqlRepository.insertTableKekuranganPembayaranSiswa(nama, kelas, nisn, kode_bayar, jenis_transaksi, perhitunganNominalAkhir, inputter);
        }

        return {
            nama,
            nisn,
            bulan_bayar
        };
    } catch (error) {
        console.error('Error in service input pembayaran', error);
        throw error;
    }
    
}

async function historyPaymentSiswaByNisn(req){
    try {
        const {kelas, nisn, jenis_transaksi, tahun_ajaran} = req.query;
        const historyPembayaranPraktikumByNisn = await laporanPraktikumSiswaMysqlRepository.historyPaymentSiswaByNisn(kelas, nisn, jenis_transaksi);

        // perhitungan kekurangan
        const jenispmebayaran = await laporanPraktikumSiswaMysqlRepository.dataJenisPembayaranPraktikumNew(kelas, jenis_transaksi, tahun_ajaran);
        console.log('jenis pembayaran: ', jenispmebayaran);
        if (jenispmebayaran.length > 0) {
            const sumTotalHasPaid = await laporanPraktikumSiswaMysqlRepository.sumPaymentSiswa(nisn, jenis_transaksi);
            console.log('sum total has paid: ', sumTotalHasPaid);
            const kekurangan = jenispmebayaran[0].nominal_total - sumTotalHasPaid[0].totalNominalBulan;
        
            const data = kekurangan;
            return {
                result: historyPembayaranPraktikumByNisn,
                kekurangan: data
            };
        }else{
            return {
                result: historyPembayaranPraktikumByNisn,
                kekurangan: 0
            }
        }
    } catch (error) {
        console.error('error service get data pemasukan praktikum', error);
        throw error;
    }
}

async function updateJenisPayment(req) {
    try {
        const {kode_pembayaran, jenis_transaksi, kelas,nominal_bulan, nominal_total, tahun_ajaran} = req.body;
        const updateJenisPayments = await laporanPraktikumSiswaMysqlRepository.updateJenisPayment(kode_pembayaran, jenis_transaksi, kelas, nominal_bulan, nominal_total, tahun_ajaran);
        return updateJenisPayments;
    } catch (error) {
        console.error('Error update jenis payment', error);
        throw error;
    }
}


module.exports = {
    dataPemasukanPraktikum,
    historyPembayaranPraktikumByNisn,
    insertPembayaranPraktikum,
    getHistoryPembayaranNew,
    insertPaymentSiswa,
    historyPaymentSiswaByNisn,
    updateJenisPayment
}