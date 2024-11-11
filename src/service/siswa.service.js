const { dataIndukRepository, dataIndukMysqlRepository } = require("../repository");

async function listSiswa(req){
    const {rombel_saat_ini} = req.query;
    try {
        // const listSiswaService = await dataIndukRepository.getListDataSiswa(rombel_saat_ini);
        const listSiswaService = await dataIndukMysqlRepository.getListDataSiswa(rombel_saat_ini);
        return listSiswaService;
    } catch (error) {
        console.error('Error in listSiswa: ', error);
        throw error;
    }
}

async function listKelas(){
    try {
        const listKelasAll = await dataIndukMysqlRepository.listRombel();
        return listKelasAll;
    } catch (error) {
        console.error('Error in service list kelas: ', error);
        throw error;
    }
}

async function naikKelas(req){
    const {tahun_ajaran, rombel_saat_ini} = req.body;
    try {
        await dataIndukMysqlRepository.naikKelas(tahun_ajaran, rombel_saat_ini);
        return {
            responseData: 'Success Update Data Kenaikan kelas'
        }
    } catch (error) {
        console.error('Error when update naik kelas: ', error);
        throw new Error("Error when update naik kelas");
    }
}

async function getListKelasDet(req){
    const {tahun_ajaran} = req.query;
    try {
        const data = await dataIndukMysqlRepository.getListKelasDet(tahun_ajaran);
        return data;
    } catch (error) {
        console.error('Error when get data kelas: ', error);
        throw new Error("Error when get data kelas");
    }
}

async function getListNamaSiswa(req){
    const {tahun_masuk, kelas} = req.query;
    try {
        const data = await dataIndukMysqlRepository.getNamaSiswa(tahun_masuk, kelas);
        return data;
    } catch (error) {
        console.error('Error when get nama: ', error);
        throw new Error('Error when get nama siswa');
    }
}

async function listKelasX(req) {
    const {tahun_ajaran} = req.query;
    try {
        const data = await dataIndukMysqlRepository.getListAllKelasX(tahun_ajaran);
        return data;
    } catch (error) {
        console.error('Error get list kelas : ', error);
        throw error;
    }
}

async function getAllKelas(req) {
    try {
        const {tahun_ajaran} = req.query;
        const data = await dataIndukMysqlRepository.getListAll(tahun_ajaran);
        return data;
    } catch (error) {
        console.error('Error get data kelas : ', error);
        throw error;
    }
}


module.exports = {
    listSiswa,
    listKelas,
    naikKelas,
    getListKelasDet,
    getListNamaSiswa,
    listKelasX,
    getAllKelas
}