const { laporanSppService } = require("../service");
const catchAsync = require("../utils/catchAsync");
const expectationFailed = require("../utils/errorExpectationFailed");
const responseInfo = require("../utils/responseInfo");

const getDataSpp = catchAsync(async(req, res) => {
    const getData = await laporanSppService.getDataSpp(req);
    if (getData) {
        res.send(responseInfo('Success get data spp', getData));
    } else {
        res.send(expectationFailed('Something Error', null));
    }
})

module.exports = {
    getDataSpp,
}