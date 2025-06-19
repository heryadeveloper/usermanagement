const { ppdbService, laporanPpdbService } = require("../service");
const catchAsync = require("../utils/catchAsync");
const responses = require('../utils/responseInfo');
const errorExpectationFailed = require('../utils/errorExpectationFailed');
const logger = require("../config/logger");


const insertPpdb = catchAsync(async(req, res) => {
    try {
        const insertPpdbsmk = await ppdbService.insertPpdbSmknu(req);
        res.send(responses('Success Adding Data PPDB SMK : ', insertPpdbsmk));
    } catch (error) {
        console.error('Error in controller insertPpdb: ', error.message);
        logger.error('data: ', error.statusCode);
        if (error.statusCode === 409) {
            res.status(409).send(errorExpectationFailed.dataConflict('Data NISN Sudah Ada!', error.errors[0].value));
        }
          // Error lain
        console.error('Error in insertPpdb:', error);
        return res.status(500).json({ message: 'Internal server error!' });
    }
});

const deleteDataPpdb = catchAsync(async(req, res) => {
    try {
        logger.info('processing delete data ppdb in controller');
        const deleteDataPpdbController = await laporanPpdbService.deleteDataPpdb(req);
        res.send(responses('success delete data ppdb : ', deleteDataPpdbController));
    } catch (error) {
        logger.error('Error delete data ppdb in controller');
        return res.status(500).json(
            {
                message: 'Something Error'
            }
        )
    }
})

module.exports = {
    insertPpdb,
    deleteDataPpdb
}