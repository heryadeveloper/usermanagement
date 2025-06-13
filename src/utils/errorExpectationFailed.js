const httpStatus = require("http-status");
const { HttpError } = require("./ApiError");

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

const expectationFailedError = (message, data) => {
    throw new HttpError(httpStatus.EXPECTATION_FAILED, "Expectation Failed", message, data);
};

const dataConflictError = (message, data) => {
    throw new HttpError(httpStatus.CONFLICT, "Data Conflict", message, data);
};

const dataNotFoundError = (message, data) => {
    throw new HttpError(httpStatus.NOT_FOUND, "Data Not Found", message, data);
};

module.exports = {
    expectationFailed,
    dataConflict,
    dataNotFound,
    expectationFailedError,
    dataConflictError,
    dataNotFoundError
};