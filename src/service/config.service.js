
async function getTahunAjaran(req){
    const {tahun} = req.query;
    let tahuns = tahun ? parseInt(tahun, 10) : new Date().getFullYear();

    if (isNaN(tahuns)) {
        // Jika `tahun` bukan angka yang valid, gunakan tahun saat ini.
        tahuns = new Date().getFullYear();
    }
    const schoolYearStart = tahuns;
    const schoolYearEnd = tahuns + 1;

    const responseInfo = {
        schoolYearStart,
        schoolYearEnd,
        tahunajaran: `${schoolYearStart}/${schoolYearEnd}`
    }

    return responseInfo;
}

module.exports = {
    getTahunAjaran,
}