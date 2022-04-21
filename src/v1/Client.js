const requests = require('../requests');
const constants = require('./Constants')
const APIKey = require('./Classes/APIKey');
const Collection = require('../Collection');

class Client {
    /**
     * Create A New Client
     * @param {string} host The url of the Pterodactyl Panel
     * @param {string} APIKey The APIKey of the Client
     */
    constructor(host, APIKey) {
        if (!host) {
            throw new Error('Host is required');
        }
        if (!APIKey) {
            throw new Error('APIKey is required');
        }

        if (typeof host !== 'string') throw new TypeError('Host must be a string');
        if (typeof APIKey !== 'string') throw new TypeError('APIKey must be a string');

        if (!host.startsWith('http://') && !host.startsWith('https://')) {
            host = `http://${host}`;
        }

        if (host.endsWith('/')) {
            host = host.substring(0, host.length - 1);
        }

        host += '/api/client'

        this.host = host;
        this.APIKey = APIKey;
    }

    /**
     * Get The Current Client's Account Details
     * @returns {Promise<Object>} The Account Details
     */
    getAccountDetails() {
        return new Promise((resolve, reject) => {
            requests(`${this.host}/account`, this.APIKey, 'GET', {}).then(res => {
                resolve(res.attributes)
            }).catch(err => {
                reject(throwError(err))
            })
        })
    }

    /**
     * Get The Current Client's Two Factor Authentication Details
     * @returns {Promise<Object>} The Two Factor Authentication Details
     */
    getTwoFactorAuthDetails() {
        return new Promise((resolve, reject) => {
            requests(`${this.host}/account/two-factor`, this.APIKey, 'GET', {}).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(throwError(err))
            })
        })
    }

    /**
     * Enable The Two Factor Authentication For The Current Client
     * @param {constants.enableTwoFactorAuth} data The data
     * @returns {Promise<Object>} The Two Factor Authentication Details
     */
    enableTwoFactorAuth(data) {
        if (!data) throw new Error('Data is required');
        if (typeof data !== 'object') throw new TypeError('Data must be an object');
        if (!data.code) throw new Error('Code is required');
        if (typeof data.code !== 'string') throw new TypeError('Code must be a string');
        return new Promise((resolve, reject) => {
            requests(`${this.host}/account/two-factor`, this.APIKey, 'POST', { code: data.code }).then(res => {
                resolve(res.attributes)
            }).catch(err => {
                reject(throwError(err))
            })
        })
    }

    /**
     * Disable The Two Factor Authentication For The Current Client
     * @param {constants.disableTwoFactorAuth} data The data
     * @returns {Promise<Object>} The Two Factor Authentication Details
     */
    disableTwoFactorAuth(data) {
        if (!data) throw new Error('Data is required');
        if (typeof data !== 'object') throw new TypeError('Data must be an object');
        if (!data.password) throw new Error('Password is required');
        if (typeof data.password !== 'string') throw new TypeError('Password must be a string');
        return new Promise((resolve, reject) => {
            requests(`${this.host}/account/two-factor`, this.APIKey, 'DELETE', { password: data.password }).then(res => {
                resolve({ success: true })
            }).catch(err => {
                reject(throwError(err))
            })
        })
    }

    /**
     * Update The Current Client's Email
     * @param {constants.updateAccountEmail} data The data
     * @returns {Promise<Boolean>} Wether the email was successfully updated
     */
    updateAccountEmail(data) {
        if (!data) throw new Error('Data is required');
        if (typeof data !== 'object') throw new TypeError('Data must be an object');
        if (!data.email) throw new Error('Email is required');
        if (typeof data.email !== 'string') throw new TypeError('Email must be a string');
        if (!data.password) throw new Error('Password is required');
        if (typeof data.password !== 'string') throw new TypeError('Password must be a string');
        return new Promise((resolve, reject) => {
            requests(`${this.host}/account/email`, this.APIKey, 'PUT', { email: data.email, password: data.password }).then(res => {
                resolve({ success: true })
            }).catch(err => {
                reject(throwError(err))
            })
        })
    }

    /**
     * Update The Current Client's Password
     * @param {constants.updateAccountPassword} data The data
     * @returns {Promise<Boolean>} Wether the password was successfully updated
     */
    updateAccountPassword(data) {
        if (!data) throw new Error('Data is required');
        if (typeof data !== 'object') throw new TypeError('Data must be an object');
        if (!data.currentPassword) throw new Error('OldPassword is required');
        if (typeof data.currentPassword !== 'string') throw new TypeError('OldPassword must be a string');
        if (!data.newPassword) throw new Error('New Password is required');
        if (typeof data.newPassword !== 'string') throw new TypeError('New Password must be a string');
        return new Promise((resolve, reject) => {
            requests(`${this.host}/account/password`, this.APIKey, 'PUT', { current_password: data.oldPassword, password: data.newPassword, password_confirmation: data.newPassword }).then(res => {
                resolve({ success: true })
            }).catch(err => {
                reject(throwError(err))
            })
        })
    }

    /**
     * List The API Keys For The Current Client
     * @returns {Promise<Collection>} The API Keys
     */
    listAPIKeys() {
        return new Promise((resolve, reject) => {
            requests(`${this.host}/account/api-keys`, this.APIKey, 'GET', {}).then(res => {
                let keys = new Collection();
                res.data.forEach(key => {
                    keys.set(key.attributes.identifier, new APIKey(this, key.attributes))
                })

                resolve(keys)
            }).catch(err => {
                reject(throwError(err))
            })
        })
    }

    /**
     * Create A New API Key For The Current Client
     * @param {constants.createAPIKey} data The data
     * @returns {Promise<APIKey>} The API Key
     */
    createAPIKey(data) {
        if (!data) throw new Error('Data is required');
        if (typeof data !== 'object') throw new TypeError('Data must be an object');
        if (!data.name) throw new Error('Name is required');
        if (typeof data.name !== 'string') throw new TypeError('Name must be a string');
        if (!data.description) throw new Error('Description is required');
        if (typeof data.description !== 'string') throw new TypeError('Description must be a string');
        if (data.allowed_ips && !Array.isArray(data.allowed_ips)) throw new TypeError('Allowed IPs must be an array');
        return new Promise((resolve, reject) => {
            requests(`${this.host}/account/api-keys`, this.APIKey, 'POST', { name: data.name, description: data.description, allowed_ips: data.allowed_ips ? data.allowed_ips : [] }).then(res => {
                resolve(new APIKey(this, res.attributes, res.meta))
            }).catch(err => {
                reject(throwError(err))
            })
        })
    }
}

function throwError(error) {
    if (error.response.data) return error.response.data;
    else if (error.response.status) return error.response.status;
    else return error;
}

module.exports = Client;