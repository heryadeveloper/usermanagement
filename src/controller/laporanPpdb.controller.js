const { laporanPpdbService } = require("../service");
const catchAsync = require("../utils/catchAsync");
const expectationFailed = require("../utils/errorExpectationFailed");
const responseInfo = require("../utils/responseInfo");

const getDataPpdb = catchAsync(async(req, res) => {
    const getDataPpdb = await laporanPpdbService.getDataPpdb(req);
    if (getDataPpdb) {
        res.send(responseInfo('Success get data ppdb', getDataPpdb));
    } else {
        res.send(expectationFailed('Something Error', null));
    }
})

module.exports ={
    getDataPpdb,
}