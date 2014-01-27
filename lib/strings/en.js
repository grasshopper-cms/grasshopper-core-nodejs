var en = {
    codes : {
        success : 200,
        bad_request : 400,
        unauthorized : 401,
        forbidden : 403,
        not_found : 404,
        timeout : 408,
        server_error : 500,
        service_unavailable : 503
    },
    defaultErrors: {
        400: 'Bad Request',
        401: 'Unauthorized.',
        403: 'Forbidden.',
        404: 'Resource could not be found.',
        408: 'Service Timeout',
        500: 'Server Error.',
        503: 'Service Unavailable.'
    },
    errors : {
        missing_credentials: 'Authorization credentials not provided.',
        missing_parent: 'This operation requires a "parent" to be supplied.',
        user_privileges_exceeded: 'User does not have enough privileges.',
        missing_token: 'Authentication token not provided.',
        invalid_login: 'Your login was invalid.'
    }
};

module.exports = en;