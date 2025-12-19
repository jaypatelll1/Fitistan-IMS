const ERROR_STATUS_CODES = {
    INTERNAL_SERVER_ERROR: 500,
    UNAUTHORIZED: 401,
    RESOURCE_NOT_FOUND: 404,
    BAD_REQUEST: 400,
    FORBIDDEN: 403,
}

const ERROR_MESSAGES = {
    CREATE_DOMAIN_ALREADY_EXISTS_ERROR: () => `Subdomain & Domain already exists`,
    DOMAIN_NOT_EXISTS_ERROR: () => `Domain doesn't exists. Please create domain first.`,
    SUBDOMAIN_ALREADY_EXISTS_ERROR: () => `Subdomain already exists. Please choose a different name.`,
    AFD_CREATE_DOMAIN_ERROR: (message) => `AFD failed to create custom domain - ${message}`,
    AFD_LOGIN_ERROR: (info) => `AFD login failed - ${info}`,
    AFD_REQUEST_ERROR: (message) => `AFD request failed - ${message}`,
    AFD_GET_CUSTOM_DOMAIN_ERROR: (message) => `AFD fetch custom domain failed - ${message}`,
    AFD_GET_ROUTE_ERROR: (message) => `AFD fetch route details failed - ${message}`,
    AFD_ENDPOINT_ASSIGNMENT_ERROR: (message) => `AFD endpoint assignment failed - ${message}`,
    AFD_ENDPOINT_UNASSIGN_ERROR: (message) => `AFD failed to unassign endpoint - ${message}`,
    AFD_DNS_MAPPING_VALIDATION_ERROR: (message) => `AFD DNS mapping validation error - ${message}`,
    AFD_GET_TXT_RECORD_STATUS_ERROR: (message) => `AFD fetch txt record status failed - ${message}`,
    AFD_GET_SSL_STATUS_ERROR: (message) => `AFD fetch SSL status failed - ${message}`,
    AFD_DELETE_ENDPOINT_ERROR: (message) => `AFD delete endpoint failed - ${message}`,
    CREATE_DOMAIN_DATABASE_ERROR: (message) => `Database Error - Create custom domain failed - ${message}`,
    ASSIGNMENT_DOMAIN_DATABASE_ERROR: (message) => `Database Error - Domain assignment failed - ${message}`,
    AFD_DATABASE_CREATE_DOMAIN_ERROR: (message) => `Create domain database error and AFD delete domain failed - ${message}`,
    AFD_DATABASE_ASSIGNMENT_DOMAIN_ERROR: (message) => `Domain assignment database error and AFD unassignment failed - ${message}`,
    CNAME_STATUS_DATABASE_ERROR: (message) => `Database Error - Failed to store CNAME status - ${message}`,
    TXT_STATUS_DATABASE_ERROR: (message) => `Database Error - Failed to store TXT status - ${message}`,
    SSL_STATUS_DATABASE_ERROR: (message) => `Database Error - Failed to store SSL status - ${message}`,
    ENDPOINT_ASSIGNMENT_STATUS_DATABASE_ERROR: (message) => `Database Error - Failed to store endpoint assignment status - ${message}`,
}

module.exports = {
    ERROR_STATUS_CODES,
    ERROR_MESSAGES
}
