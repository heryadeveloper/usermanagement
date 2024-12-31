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

const dataNotFound = (message, data) => {
    return {
        status: 'Data Not Found',
        code: httpStatus.NOT_FOUND,
        message,
        data,
    };
};

module.exports = {
    expectationFailed,
    dataConflict,
    dataNotFound
};