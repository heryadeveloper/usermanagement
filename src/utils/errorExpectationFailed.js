const httpStatus = require("http-status")

const expectationFailed = (message, data) => {
    return {
        status: 'Expectation Failed',
        code: httpStatus.EXPECTATION_FAILED,
        message,
        data,
    };
};

const dataConflict = (message, data) => {
    return {
        status: 'Data Conflict',
        code: httpStatus.CONFLICT,
        message,
        data,
    };
};

module.exports = {
    expectationFailed,
    dataConflict
};