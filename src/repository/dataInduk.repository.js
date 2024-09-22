
const db = require('../db/models');
const {sequelize} = require('../db/models');
const {Sequelize, Op} = require('sequelize');

async function getListDataSiswa(rombel_saat_ini){
    try {
        const listSiswa = await db.data_induk.findAll({
            where:{
                rombel_saat_ini
            },
            attributes:['nama', 'nisn', 'rombel_saat_ini', 'penerima_kip', 'bulan_masuk', 'tahun_ajaran'],
            order:[['nama','ASC']],
            raw: true,
            
        })
        return listSiswa;
    } catch (error) {
        console.error('Error while get data induk: ', error);
        throw error;
    }
}

async function getListAllKelas(){
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
                ]
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
                ]
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

async function getListAllKelasXII(){
    try {
        const listKelas = await db.data_induk.findAll({
            where: {
                [Op.and]: [
                    {
                        rombel_saat_ini: {
                            [Op.like]: 'XII %'
                        }
                    },
                    {
                        rombel_saat_ini: {
                            [Op.notLike]: 'X %'
                        }
                    },
                    {
                        rombel_saat_ini: {
                            [Op.notLike]: 'XI %'
                        }
                    }
                ]
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

async function getListAll(){
    try {
        const listKelas = await db.data_induk.findAll({
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('rombel_saat_ini')), 'rombel_saat_ini'],
                'nama','nisn'
            ],
            group: ['rombel_saat_ini', 'nama', 'nisn'],
            order: [['nama', 'asc']],
            raw: true,
        })
         // Transform data menjadi struktur yang diinginkan
        const data = listKelas.reduce((acc, item) => {
        // Cek apakah rombel_saat_ini sudah ada dalam akumulator
        let rombel = acc.find(r => r.rombel_saat_ini === item.rombel_saat_ini);
        if (!rombel) {
          // Jika tidak ada, tambahkan rombel baru dengan detail kosong
            rombel = { rombel_saat_ini: item.rombel_saat_ini, detail: [] };
            acc.push(rombel);
        }
        // Tambahkan detail ke rombel yang sesuai
        rombel.detail.push({ nama: item.nama, nisn: item.nisn });
        return acc;
        }, []);
        return data;
    } catch (error) {
        console.error('Error when proccessing get list', error);
        throw error;
    }
}

async function getKelasAll(){
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

module.exports = {
    getListDataSiswa,
    getListAllKelas,
    getListAllKelasXI,
    getListAllKelasXII,
    getListAll,
    getKelasAll
}