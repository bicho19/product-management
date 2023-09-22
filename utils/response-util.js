const HTTP_STATUS_CODE = Object.freeze({
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
});

exports.HTTP_STATUS_CODE = HTTP_STATUS_CODE;

/**
 * @desc    Send any success response
 *
 * @param   {object | array} results
 * @param  {string} message
 * @param   {number} statusCode
 */
exports.SuccessResponse = (results, message = 'OK', statusCode = HTTP_STATUS_CODE.OK) => {
    if (results) {
        return {
            statusCode: statusCode,
            data: results
        };
    } else
        return {
            statusCode: statusCode,
            message: message,
        };
};

/**
 * @desc    Send any error response
 *
 * @param   {string} message
 * @param   {number} statusCode
 */
exports.ErrorResponse = (statusCode, message) => {
    // List of common HTTP request code
    const commonHttpStatusCode = Object.values(HTTP_STATUS_CODE);
    if (commonHttpStatusCode.includes(statusCode)) {
        return {
            statusCode: statusCode,
            message: message,
        };
    } else {
        return {
            statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            message: message,
        };
    }
};