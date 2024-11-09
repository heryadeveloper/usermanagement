const { Op } = require('sequelize');
const db = require('../../db/modelsmysql');
const {sequelize} = require('../../db/modelsmysql');

async function listRombel(){
    try {
        const listKelasAll = await db.data_induk.findAll({
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('rombel_saat_ini')), 'rombel_saat_ini'],
                'tahun_ajaran'
            ],
            group: ['rombel_saat_ini'],
            order: [['rombel_saat_ini', 'asc']],
            raw: true,
        });
        return listKelasAll;
    } catch (error) {
        console.error('Error When get data kelas');
        throw error;
    }
}

async function naikKelas(tahun_ajaran, rombel_saat_ini){
    try {
        await db.data_induk.update(
            {tahun_ajaran},
            {
                where:{
                    rombel_saat_ini
                }
            }
        )
    } catch (error) {
        console.error('Error when naik kelas');
        throw error;
    }
}

async function getListKelas(){
    try {
        const listKelasAll = await db.data_induk.findAll({
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('rombel_saat_ini')), 'rombel_saat_ini'],
            ],
            group: ['rombel_saat_ini'],
            order: [['rombel_saat_ini', 'asc']],
            raw: true,
        });
        return listKelasAll;
    } catch (error) {
        console.error('Error When get data kelas');
        throw error;
    }
}

async function getListKelasDet(tahun_ajaran){
    try {
        const listKelasDet = await db.data_induk.findAll({
            where : {
                tahun_ajaran
            },
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('rombel_saat_ini')), 'rombel_saat_ini'],
            ],
            group: ['rombel_saat_ini'],
            order: [['rombel_saat_ini', 'asc']],
            raw: true,
        });
        return listKelasDet;
    } catch (error) {
        console.error('Error When get data kelas');
        throw error;
    }
}

async function getNamaSiswa(tahun_masuk, kelas){
    try {
        const listNamaSiswa = await db.data_induk.findAll({
            where: {
                tahun_masuk, rombel_saat_ini : kelas
            },
            attributes: [
                'nama', 
                'nisn'
            ],
            raw: true,
        });
        return listNamaSiswa;
    } catch (error) {
        console.error('Error when get nama siswa');
        throw error;
    }
}

async function getListAllKelasXI(){
    try {
        const listKelas = await db.data_induk.findAll({
            where: {
                [Op.and]: [
                    {
                        rombel_saat_ini: {
                            [Op.like]: 'XI %'
                        }
                    },
                    {
                        rombel_saat_ini: {
                            [Op.notLike]: 'X %'
                        }
                    },
                    {
                        rombel_saat_ini: {
                            [Op.notLike]: 'XII%'
                        }
                    }
                ],
                tahun_ajaran: '2024'
            },
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('rombel_saat_ini')), 'rombel_saat_ini'],
            ],
            group: ['rombel_saat_ini'],
            raw: true,
        })
        return listKelas;
    } catch (error) {
        console.error('Error when proccessing get list', error);
        throw error;
    }
}

async function getListDataSiswa(rombel_saat_ini){
    try {
        const listSiswa = await db.data_induk.findAll({
            where:{
                rombel_saat_ini
            },
            attributes:['nama', 'nisn', 'rombel_saat_ini', 'penerima_kip', 'bulan_masuk', 'tahun_masuk'],
            order:[['nama','ASC']],
            raw: true,
            
        })
        return listSiswa;
    } catch (error) {
        console.error('Error while get data induk: ', error);
        throw error;
    }
}

async function getListAllKelasX(tahun_ajaran){
    try {
        const listKelas = await db.data_induk.findAll({
            where: {
                [Op.and]: [
                    {
                        rombel_saat_ini: {
                            [Op.like]: 'X %'
                        }
                    },
                    {
                        rombel_saat_ini: {
                            [Op.notLike]: 'XI%'
                        }
                    },
                    {
                        rombel_saat_ini: {
                            [Op.notLike]: 'XII%'
                        }
                    }
                ],
                tahun_ajaran: tahun_ajaran
            },
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('rombel_saat_ini')), 'rombel_saat_ini'],
            ],
            group: ['rombel_saat_ini'],
            raw: true,
        })
        return listKelas;
    } catch (error) {
        console.error('Error when proccessing get list', error);
        throw error;
    }
}


module.exports = {
    listRombel,
    naikKelas,
    getListKelas,
    getListKelasDet,
    getNamaSiswa,
    getListAllKelasXI,
    getListDataSiswa,
    getListAllKelasX
}