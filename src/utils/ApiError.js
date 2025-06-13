class ApiError extends Error {
    constructor(statusCode, message, isOperational = true, stack = ''){
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.message = message;
        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

class HttpError extends Error {
    constructor(statusCode, statusText, message, data = null) {
        super(message);
        this.statusCode = statusCode;
        this.statusText = statusText;
        this.data = data;
    }
}

module.exports = {
    ApiError,
    HttpError
};