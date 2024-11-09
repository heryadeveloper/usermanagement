const Joi = require("@hapi/joi");

const updateKenaikanKelas = {
    body: Joi.object().keys({
        tahun_ajaran: Joi.string().required(),
        rombel_saat_ini: Joi.string().required(),
    })
}

module.exports = {
    updateKenaikanKelas
}