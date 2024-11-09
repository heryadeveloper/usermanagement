const { siswaService } = require("../service");
const catchAsync = require("../utils/catchAsync");
const expectationFailed = require("../utils/errorExpectationFailed");
const responseInfo = require("../utils/responseInfo");

const dataKenaikanKelas = catchAsync(async(req, res) => {
    const updateKenaikanKelas = await siswaService.naikKelas(req);

    if (updateKenaikanKelas.responseData != null) {
        res.send(responseInfo('SUccess Update Data Kenaikan', updateKenaikanKelas));
    } else {
        res.send(expectationFailed('Something wrong when updating data', null));
    }
})


module.exports = {
    dataKenaikanKelas,
}