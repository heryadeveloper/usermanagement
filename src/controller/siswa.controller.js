const catchAsync = require('../utils/catchAsync');
const {siswaService} = require('../service');
const responseInfo = require('../utils/responseInfo');
const errorExpectationFailed = require('../utils/errorExpectationFailed');
const { dataIndukRepository, dataIndukMysqlRepository } = require('../repository');

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
    // const getAllKelas = await dataIndukMysqlRepository.getListAllKelasX();
    const getAllKelas = await siswaService.listKelasX(req);
    if (getAllKelas) {
        res.send(responseInfo('Success Get Data', getAllKelas));
    } else {
        res.send(errorExpectationFailed('Cannot Get Data', null));
    }
})

const getListAllKelasXI = catchAsync(async(req, res) => {
    const getAllKelasXI = await dataIndukMysqlRepository.getListAllKelasXI();
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
    // const getListKelas = await dataIndukRepository.getListAll();
    const getListKelas = await siswaService.getAllKelas(req);
    if (getListKelas) {
        res.send(responseInfo('Success Get Data', getListKelas));
    } else {
        res.send(errorExpectationFailed('Cannot Get Data', null));
    }
})

const getKelas = catchAsync(async(req, res) => {
    const getKelasAll = await dataIndukMysqlRepository.listRombel();
    if (getKelasAll) {
        res.send(responseInfo('Success Get Data', getKelasAll));
    } else {
        res.send(errorExpectationFailed('Cannot Get Data', null));
    }
})

const listKelas = catchAsync(async(req, res) => {
    const listKelass = await dataIndukMysqlRepository.getListKelas();
    if (listKelass) {
        res.send(responseInfo('Success Get Data', listKelass));
    } else {
        res.send(errorExpectationFailed('Data not found', null));
    }
})

const listKelasDet = catchAsync(async(req, res) => {
    const listKelasDet = await siswaService.getListKelasDet(req);
    if (listKelasDet) {
        res.send(responseInfo('Success Get Data Kelas', listKelasDet));
    } else {
        res.send(errorExpectationFailed('Data Not Found', null));
    }
})

const listNamaSiswa = catchAsync(async(req, res) => {
    const listNamaSiswa = await siswaService.getListNamaSiswa(req);
    if (listNamaSiswa) {
        res.send(responseInfo('Success Get Nama Siswa', listNamaSiswa));
    } else {
        res.send(errorExpectationFailed('Data Not Found', null));
    }
})
module.exports = {
    getDataSiswaInRombel,
    getListAllKelas,
    getListAllKelasXI,
    getListAllKelasXII,
    getListAll,
    getKelas,
    listKelas,
    listKelasDet,
    listNamaSiswa
}