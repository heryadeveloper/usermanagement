const { laporanPraktikumService } = require("../service");
const catchAsync = require("../utils/catchAsync");
const expectationFailed = require("../utils/errorExpectationFailed");
const responseInfo = require("../utils/responseInfo");

const getDataBayarPraktikum = catchAsync(async(req, res) => {
    const getDataBayar = await laporanPraktikumService.dataPemasukanPraktikum(req);
    if (getDataBayar) {
        res.send(responseInfo('Success Get Data Bayar Praktikum', getDataBayar));
    } else {
        res.send(expectationFailed('Something Error in this action', null));
    }
})

const getHistoryPembayaranPraktikumByNisn = catchAsync(async(req, res) => {
    const getHistoryPembayaranPraktikumByNisn = await laporanPraktikumService.historyPembayaranPraktikumByNisn(req);
    if (getHistoryPembayaranPraktikumByNisn) {
        res.send(responseInfo('Success get data history', getHistoryPembayaranPraktikumByNisn));
    }else {
        res.send(expectationFailed('Something error', null));
    }
})

const addBayarPraktikum = catchAsync(async(req, res) => {
    const inputBayarPraktikum = await laporanPraktikumService.insertPembayaranPraktikum(req);
    if (inputBayarPraktikum) {
        res.send(responseInfo('Success Bayar Praktikum', inputBayarPraktikum));
    }else {
        res.send(expectationFailed('Something error', null));
    }
})

const getDataHistoryPembayaranPraktikumNew = catchAsync(async(req, res) => {
    const getHistory = await laporanPraktikumService.getHistoryPembayaranNew(req);
    if (getHistory) {
        res.send(responseInfo('Success Get Data History', getHistory));
    } else {
        res.send(expectationFailed('Something error', null));
    }
})

module.exports = {
    getDataBayarPraktikum,
    getHistoryPembayaranPraktikumByNisn,
    addBayarPraktikum,
    getDataHistoryPembayaranPraktikumNew
}