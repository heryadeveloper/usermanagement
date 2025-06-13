class DataConflictError extends Error {
    constructor(message, errors = []) {
        super(message);
        this.statusCode = 409;
        this.statusText = 'Conflict';
        this.errors = errors;
    }
}

module.exports = { DataConflictError };
