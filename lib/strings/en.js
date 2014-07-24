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
        configuration: 'GRASSHOPPER NOT PROPERLY CONFIGURED. SEE DOCS ABOUT CONFIGURATION.',
        missing_credentials: 'Authorization credentials not provided.',
        missing_parent: 'This operation requires a "parent" to be supplied.',
        user_privileges_exceeded: 'User does not have enough privileges.',
        missing_token: 'Authentication token not provided.',
        invalid_username: 'Your username was invalid.',
        username_too_short: 'Your username is too short.',
        user_privileges_exceeded_role: 'You do not have the permissions to change your role.',
        username_duplicate: 'Different user with the same username already exists.',
        invalid_content_type: 'The content type referenced is invalid.',
        user_password_too_short: 'Password must be at least 6 characters.',
        password_cannot_be_empty: 'Password, when supplied, cannot be empty.',
        missing_identity: 'Cannot create user without at least 1 identity',
        duplicate_username: 'This username is already in use.',
        missing_field_identity_basic_username: 'username is required.',
        content_validation: '"<%= label %>" is not valid. Please check your validation rules and try again.',
        db_connection_error: 'Mongoose default connection error',
        config_missing_google_identities: 'Cannot Generate URL: Your ghapi config does not have a identities.google object.',
        config_missing_google_appId: 'Cannot Generate URL: You need a google app id on your ghapi config.',
        config_missing_google_secret: 'Cannot Generate URL: You need a google secret on your ghapi config.',
        config_missing_google_redirectUrl: 'Cannot Generate URL: You need a google redirectUrl on your ghapi config.',
        config_missing_google_scopes_array: 'Cannot Generate URL: You need a google scopes array on your ghapi config.',
        config_missing_oauth_callback: 'Cannot Generate URL: You need a oauthCallback on your ghapi config.',
        config_invalid_google_redirectUrl_mismatch: 'Google redirect URL mismatch, ensure that your redirectUrl is configured in Grasshopper and Google correctly.',
        types_empty_fields: 'All content types have to contain at least one field.'
    },
    notice: {
        db_connected: 'Connection made to mongo database.',
        db_disconnected: 'Database connection disconnected'
    }
};

module.exports = en;