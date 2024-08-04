const { configService } = require("../service");
const catchAsync = require("../utils/catchAsync");
const responseInfo = require("../utils/responseInfo");

const getTahunAjaran = catchAsync(async(req, res) =>{
    try {
        const tahunAjaran = await configService.getTahunAjaran();
        res.send(responseInfo('Success get data', tahunAjaran));
    } catch (error) {
        console.error('Error parsing data');
        throw error;
    }
})

module.exports = {
    getTahunAjaran,
}