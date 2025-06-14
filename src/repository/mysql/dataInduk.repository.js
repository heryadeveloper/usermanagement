const { Op, QueryTypes } = require('sequelize');
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

async function getNamaSiswa(tahun_ajaran, kelas){
    try {
        const listNamaSiswa = await db.data_induk.findAll({
            where: {
                tahun_ajaran, rombel_saat_ini : kelas
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

async function getListAll(tahun_ajaran){
    try {
        const listKelas = await db.data_induk.findAll({
            where:{
                tahun_ajaran
            },
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

async function getDataGuru(){
    try {
        const result = await db.sequelize.query(`
            SELECT 
            a.nama ,
            a.role_name ,
            b.alamat ,
            b.tahun_masuk, 
            b.sex jenis_kelamin,
            b.kode_guru
            FROM account_guru_karyawan a
            join data_guru_karyawan b on 
            a.id_role = b.id_role
            and a.kode_guru = b.kode_guru`,
            {
            type: QueryTypes.SELECT
        });
        return result;
    } catch (error) {
        console.error('Error when get data', error);
        throw error;
    }
}

async function getDataPpdb(nisn){
    try {
        const dataPpdb = await db.ppdb_smknu.findOne({
            where:{
                nisn
            },
            raw: true,
        });
        return dataPpdb;
    } catch (error) {
        console.error('Error when get proccesing data', error);
        throw error;
    }
}

async function getDataFormPpdb(nisn) {
    try {
        const dataFormPpdb = `
            select
                ps.id ,
                nama_lengkap ,
                nisn ,
                nik ,
                concat(tempat_lahir,', ' , DATE_FORMAT(tanggal_lahir, '%Y-%m-%d')) ttl,
                case
                    when jenis_kelamin = 0
                    then 'Perempuan'
                    else 'Laki-laki'
                end as jenis,
                a.agama,
                concat(ps.desa_kelurahan,' ',ps.rt,'/',ps.rw,', ', ps.kecamatan,', ', ps.kabupaten,' ', ps.kode_pos) alamat,
                ps.no_wa ,
                ps.email ,
                ps.asal_sekolah ,
                ps.tahun_kelulusan ,
                ps.nama_ayah ,
                ps.pekerjaan_ayah ,
                ps.nama_ibu ,
                ps.pekerjaan_ibu ,
                ps.nama_wali ,
                ps.pekerjaan_wali ,
                ps.no_hp_orang_tua,
                ps.program_jurusan_yang_diminati
                from ppdb_smknu ps
                join agama a 
                    on ps.agama = a.id_agama 
                where ps.nisn = :nisn`;
            const responseData = await db.sequelize.query(dataFormPpdb, {
                replacements: {nisn},
                type: db.Sequelize.QueryTypes.SELECT,
            });
            return {
                responseData
            };
    } catch (error) {
        console.error('Error get data');
        throw error;
    }
}

async function getDataSiswaPPDB() {
    try {
        const query = `select
            id,
            no_urut,
            tanggal_pendaftaran,
            nama_lengkap ,
            nisn,
            asal_sekolah ,
            no_wa
            from ppdb_smknu order by id`;
        const responseData = await db.sequelize.query(query, {
            type: db.Sequelize.QueryTypes.SELECT,
        });
        return responseData;
    } catch (error) {
        console.error('Error get data');
        throw error;
    }
}

async function getDataSiswaPPDBForGenerateExcel() {
    try {
        const query = `select *
            from ppdb_smknu order by id asc`;
        const responseData = await db.sequelize.query(query, {
            type: db.Sequelize.QueryTypes.SELECT,
        });
        return responseData;
    } catch (error) {
        console.error('Error get data');
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
    getListAllKelasX,
    getListAll,
    getDataGuru,
    getDataPpdb,
    getDataFormPpdb,
    getDataSiswaPPDB,
    getDataSiswaPPDBForGenerateExcel
}