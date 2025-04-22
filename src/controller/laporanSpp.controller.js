const { laporanSppService } = require("../service");
const catchAsync = require("../utils/catchAsync");
const expectationFailed = require("../utils/errorExpectationFailed");
const responseInfo = require("../utils/responseInfo");

const getDataSpp = catchAsync(async(req, res) => {
    const getData = await laporanSppService.getDataSpp(req);
    if (getData) {
        res.send(responseInfo('Success get data spp', getData));
    } else {
        res.send(expectationFailed.expectationFailed('Something Error', null));
    }
})

const getDataSppByNisn = catchAsync(async(req, res) => {
    const getData = await laporanSppService.getDataSppByNisn(req);
    if (getData) {
        res.send(responseInfo('Success get data spp', getData));
    } else {
        res.send(expectationFailed.expectationFailed('Something Error', null));
    }
})

const getBulanBelumBayar = catchAsync(async(req, res) => {
    const getData = await laporanSppService.getBulanBelumBayar(req);
    if (getData) {
        res.send(responseInfo('Success get data spp', getData));
    } else {
        res.send(expectationFailed.expectationFailed('Something Error', null));
    }
})

const inputPembayaran = catchAsync(async(req, res) => {
    const inputBayar = await laporanSppService.inputPembayaran(req);
    if (inputBayar) {
        res.send(responseInfo('Success Transaksi Pembayaran', inputBayar));
    } else {
        res.send(expectationFailed.expectationFailed('Something Error', null));
    }
})

const getDataHistoryPembayaranSpp = catchAsync(async(req, res) => {
    const getHistory = await laporanSppService.getHistoryPembayaranSppNew(req);
    if (getHistory) {
        res.send(responseInfo('Success Get Data History', getHistory));
    } else {
        res.send(expectationFailed.expectationFailed('Something Error', null));
    }
})

const getJenisPembayaran = catchAsync(async(req, res) => {
    try {
        const jenisbayar = await laporanSppService.getJenisPembayaran(req);
        if (jenisbayar) {
            res.send(responseInfo('Success Get Jenis Pembayaran', jenisbayar))
        } else {
            res.send(expectationFailed.expectationFailed('Something Error', null));
        }
    } catch (error) {
        res.send(errorExpectationFailed('Data not Found', null));
    }
})

const insertJenisPembayaran = catchAsync(async(req, res) => {
    try {
        const insertJenisPembayaran = await laporanSppService.insertJenisPembayaran(req);
        if (insertJenisPembayaran) {
            res.send(responseInfo('Success Insert Jenis Pembayaran', insertJenisPembayaran));
        } else {
            res.send(expectationFailed.expectationFailed('Something Error', null));
        }
    }catch (error){
        res.send(errorExpectationFailed('Data Not Found', null));
    }
})

const getJenisPembayaranAll = catchAsync(async(req, res) => {
    try {
        const dataJenisPembayaranAll = await laporanSppService.getJenisPembayaranAll();
        if (dataJenisPembayaranAll) {
            res.send(responseInfo('Success get jenis pembayaran', dataJenisPembayaranAll));
        } else {
            res.send(errorExpectationFailed('Data Not Found in table', null));
        }
    } catch (error) {
        res.send(errorExpectationFailed('Data not found', null));
    }
})

const getRekapPembayaranSpp = catchAsync(async(req, res) => {
    try {
        const rekapPembayaranSpp = await laporanSppService.getRekapPembayaranSpp(req);
        if (rekapPembayaranSpp) {
            res.send(responseInfo('Success Get Data Rekap', rekapPembayaranSpp));
        } else {
            res.send(expectationFailed.expectationFailed('Something Error', null));
        }
    } catch (error) {
        res.send(errorExpectationFailed('Data Not Found', null));
    }
});

const getJeninsPembayaranForNominal = catchAsync(async(req, res) => {
    try {
        const dataJenisPembayaran = await laporanSppService.getJeninsPembayaranForNominal(req);
        if (dataJenisPembayaran) {
            res.send(responseInfo('Success Get Jenis Pembayaran', dataJenisPembayaran));
        } else {
            res.send(expectationFailed('Data Not Found', null));
        }
    } catch (error) {
        res.send(errorExpectationFailed('Internal Service Error', null));
    }
})

module.exports = {
    getDataSpp,
    getDataSppByNisn,
    getBulanBelumBayar,
    inputPembayaran,
    getDataHistoryPembayaranSpp,
    getJenisPembayaran,
    insertJenisPembayaran,
    getJenisPembayaranAll,
    getRekapPembayaranSpp,
    getJeninsPembayaranForNominal
}