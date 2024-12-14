const { ppdbService } = require("../service");
const catchAsync = require("../utils/catchAsync");
const responses = require('../utils/responseInfo');
const errorExpectationFailed = require('../utils/errorExpectationFailed');


const insertPpdb = catchAsync(async(req, res) => {
    try {
        const insertPpdbsmk = await ppdbService.insertPpdbSmknu(req);
        res.send(responses('Success Adding Data PPDB SMK : ', insertPpdbsmk));
    } catch (error) {
        console.error('Error in controller insertPpdb: ', error.message);

        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(409).send(errorExpectationFailed.dataConflict('Data Sudah Ada!', error.errors[0].value));
        }
          // Error lain
        console.error('Error in insertPpdb:', error);
        return res.status(500).json({ message: 'Internal server error!' });
    }
})

module.exports = {
    insertPpdb
}