
async function getTahunAjaran(){
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // getMonth() returns 0 for January, 1 for February, ..., 6 for July, etc.
    const currentYear = currentDate.getFullYear();

    let schoolYearStart;
    let schoolYearEnd;

     // Determine the school year
    if (currentMonth >= 6) { // 6 is July
        schoolYearStart = currentYear;
        schoolYearEnd = currentYear + 1;
    } else {
        schoolYearStart = currentYear - 1;
        schoolYearEnd = currentYear;
    }
    const responseInfo = {
        schoolYearStart,
        schoolYearEnd
    }

    return responseInfo;
}

module.exports = {
    getTahunAjaran,
}