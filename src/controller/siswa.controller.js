const catchAsync = require('../utils/catchAsync');
const {siswaService} = require('../service');
const responseInfo = require('../utils/responseInfo');
const errorExpectationFailed = require('../utils/errorExpectationFailed');
const { dataIndukRepository } = require('../repository');

const getDataSiswaInRombel = catchAsync(async(req, res) => {
    const listSiswa =await siswaService.listSiswa(req);
    console.log('list siswa : ');
    if (listSiswa) {
        res.send(responseInfo('Success Get Data', listSiswa));
    }else{
        res.send(errorExpectationFailed('Cannot Get Data', null));
    }
})

const getListAllKelas = catchAsync(async(req, res) => {
    const getAllKelas = await dataIndukRepository.getListAllKelas();
    if (getAllKelas) {
        res.send(responseInfo('Success Get Data', getAllKelas));
    } else {
        res.send(errorExpectationFailed('Cannot Get Data', null));
    }
})

const getListAllKelasXI = catchAsync(async(req, res) => {
    const getAllKelasXI = await dataIndukRepository.getListAllKelasXI();
    if (getAllKelasXI) {
        res.send(responseInfo('Success Get Data', getAllKelasXI));
    } else {
        res.send(errorExpectationFailed('Cannot Get Data', null));
    }
})

const getListAllKelasXII = catchAsync(async(req, res) => {
    const getAllKelasXII = await dataIndukRepository.getListAllKelasXII();
    if (getAllKelasXII) {
        res.send(responseInfo('Success Get Data', getAllKelasXII));
    } else {
        res.send(errorExpectationFailed('Cannot Get Data', null));
    }
})

const getListAll = catchAsync(async(req, res) => {
    const getListKelas = await dataIndukRepository.getListAll();
    if (getListKelas) {
        res.send(responseInfo('Success Get Data', getListKelas));
    } else {
        res.send(errorExpectationFailed('Cannot Get Data', null));
    }
})

module.exports = {
    getDataSiswaInRombel,
    getListAllKelas,
    getListAllKelasXI,
    getListAllKelasXII,
    getListAll,
}