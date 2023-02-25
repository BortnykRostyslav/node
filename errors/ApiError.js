const {BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, CONFLICT, SERVER_ERROR} = require("./errors.codes");

class ApiError extends Error{
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}
class BadRequest extends Error{
    constructor(message) {
        super(message);
        this.status = BAD_REQUEST;
    }
}
class Unauthorized extends Error{
    constructor(message) {
        super(message);
        this.status = UNAUTHORIZED;
    }
}
class Forbidden extends Error{
    constructor(message) {
        super(message);
        this.status = FORBIDDEN;
    }
}
class NotFound extends Error{
    constructor(message) {
        super(message);
        this.status = NOT_FOUND;
    }
}
class Conflict extends Error{
    constructor(message) {
        super(message);
        this.status = CONFLICT;
    }
}

class ServerError extends Error{
    constructor(message) {
        super(message);
        this.status = SERVER_ERROR;
    }
}

module.exports = {
    ApiError,
    BadRequest,
    Unauthorized,
    Forbidden,
    NotFound,
    Conflict,

    ServerError
}