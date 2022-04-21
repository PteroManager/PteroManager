/**
 * @typedef enableTwoFactorAuth
 * 
 * @property {string} code The Two Factor Authentication Code
 */
exports.enableTwoFactorAuth = {
    code: String
}

/**
 * @typedef disableTwoFactorAuth
 * 
 * @property {string} password The Password
 */
exports.disableTwoFactorAuth = {
    password: String
}

/**
 * @typedef updateAccountEmail
 * 
 * @property {string} email The Email
 * @property {string} password The Password
 */
exports.updateAccountEmail = {
    email: String,
    password: String
}

/**
 * @typedef updateAccountPassword
 * 
 * @property {string} oldPassword The Old Password
 * @property {string} newPassword The New Password
 */
exports.updateAccountPassword = {
    oldPassword: String,
    newPassword: String
}

/**
 * @typedef createAPIKey
 * 
 * @property {string} name The API Key Name
 * @property {string} description The API Key Description
 * @property {Array<string>} allowd_ips The Allowed IPs
 */
exports.createAPIKey = {
    name: String,
    description: String,
    allowed_ips: Array
}

/**
 * @typedef deleteAPIKey
 * 
 * @property {string} identifier The API Key Identifier
 */
exports.deleteAPIKey = {
    identifier: String
}