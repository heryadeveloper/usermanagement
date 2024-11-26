const { ppdbService } = require("../service");
const catchAsync = require("../utils/catchAsync");
const responses = require('../utils/responseInfo');
const errorExpectationFailed = require('../utils/errorExpectationFailed');

const insertPpdb = catchAsync(async(req, res) => {
    const insertPpdbsmk = await ppdbService.insertPpdbSmknu(req);
    if(insertPpdbsmk){
        res.send(responses('Success Adding Data PPDB SMK : ', insertPpdbsmk));
    }else{
        res.send(errorExpectationFailed('Cannot Insert Data PPDB', null));
    }
})

module.exports = {
    insertPpdb
}