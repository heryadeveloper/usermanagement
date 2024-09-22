const { dataIndukRepository } = require("../repository");

async function listSiswa(req){
    const {rombel_saat_ini} = req.query;
    try {
        const listSiswaService = await dataIndukRepository.getListDataSiswa(rombel_saat_ini);
        console.info('list siswa service : ', listSiswaService);
        return listSiswaService;
    } catch (error) {
        console.error('Error in listSiswa: ', error);
        throw error;
    }
}

async function listKelas(){
    try {
        const listKelasAll = await dataIndukRepository.getKelasAll();
        return listKelasAll;
    } catch (error) {
        console.error('Error in service list kelas: ', error);
        throw error;
    }
}

module.exports = {
    listSiswa,
    listKelas,
}