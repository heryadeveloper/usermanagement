const Joi = require("@hapi/joi");

const inputPembayaran = {
    body: Joi.object().keys({
        nama: Joi.string(),
        nisn: Joi.string(),
        kelas: Joi.string().required(),
        nominal: Joi.string(),
        periode: Joi.string(),
        petugas_input: Joi.string(),
        tahun_ajaran: Joi.string(),
        tanggal_bayar: Joi.date(),
        bulan: Joi.array().items(
            Joi.object().keys({
                bulan_bayar: Joi.string().required(),
                nominal_bayar: Joi.number().required(),
                tahun_ajaran: Joi.string().required(),
            })
        ),
    }),
};

module.exports = {
    inputPembayaran,
}