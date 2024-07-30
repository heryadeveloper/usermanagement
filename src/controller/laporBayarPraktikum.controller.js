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

module.exports = {
    getDataBayarPraktikum,
}