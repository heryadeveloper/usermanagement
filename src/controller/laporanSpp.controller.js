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

module.exports = {
    getDataSpp,
    getDataSppByNisn,
    getBulanBelumBayar,
    inputPembayaran,
    getDataHistoryPembayaranSpp,
    getJenisPembayaran
}