const { dataIndukMysqlRepository } = require("../repository");
const { siswaService } = require("../service");
const catchAsync = require("../utils/catchAsync");
const expectationFailed = require("../utils/errorExpectationFailed");
const responseInfo = require("../utils/responseInfo");

const dataKenaikanKelas = catchAsync(async(req, res) => {
    const updateKenaikanKelas = await siswaService.naikKelas(req);

    if (updateKenaikanKelas.responseData != null) {
        res.send(responseInfo('SUccess Update Data Kenaikan', updateKenaikanKelas));
    } else {
        res.send(expectationFailed.expectationFailed('Something wrong when updating data', null));
    }
})

const dataGuru = catchAsync(async(req, res) => {
    const dataGuruList = await dataIndukMysqlRepository.getDataGuru();

    if (dataGuruList.length > 0) {
        res.send(responseInfo('Success get data guru', dataGuruList));
    } else {
        res.send(expectationFailed.expectationFailed('Something when wrong', null));
    }
})

module.exports = {
    dataKenaikanKelas,
    dataGuru
}