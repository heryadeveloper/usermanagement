const Joi = require("@hapi/joi");

const updateKenaikanKelas = {
    body: Joi.object().keys({
        tahun_ajaran: Joi.string().required(),
        rombel_saat_ini: Joi.string().required(),
    })
}

const addPaymentInstruction = {
    body: Joi.object().keys({
        nama: Joi.string().required(),
        kelas: Joi.string().required(),
        nisn: Joi.string().required(),
        bulan_bayar: Joi.string().required(),
        kode_bayar: Joi.string().required(),
        jenis_transaksi: Joi.string().required(),
        nominal: Joi.number().required(),
        inputter: Joi.string().required(),
        tahun_ajaran: Joi.string().required(),
    })
}

const registrationPpdb = {
    body: Joi.object().keys({
        nama_lengkap: Joi.string().required(),
        tanggal_pendaftaran: Joi.date(),
        nisn: Joi.string().required(),
        asal_sekolah: Joi.string(),
        tahun_kelulusan: Joi.number().required(),
        nik: Joi.string(),
        tempat_lahir: Joi.string(),
        tanggal_lahir: Joi.date(),
        jenis_kelamin: Joi.number(),
        agama: Joi.number(),
        alamat: Joi.string(),
        rt: Joi.string(),
        rw: Joi.string(),
        desa_kelurahan: Joi.string(),
        kecamatan: Joi.string(),
        kabupaten: Joi.string(),
        kode_pos: Joi.string(),
        email: Joi.string(),
        no_wa: Joi.string(),
        nama_ayah: Joi.string(),
        pekerjaan_ayah: Joi.string(),
        nama_ibu: Joi.string(),
        pekerjaan_ibu: Joi.string(),
        nama_wali: Joi.string(),
        pekerjaan_wali: Joi.string(),
        no_hp_orang_tua: Joi.string(),
        program_jurusan_yang_diminati: Joi.string()
    })
}

module.exports = {
    updateKenaikanKelas,
    addPaymentInstruction,
    registrationPpdb
}