const requests = require('../requests');
const APIKey = require('./Classes/Client/Account/APIKey');
const { default: Collection } = require('@pteromanager/collection');
const ClientServerManager = require('./Classes/Client/Managers/ClientServerManager')
const ClientAPIKeyManager = require('./Classes/Client/Managers/ClientAPIKeyManager')

class Client {
    /**
     * Create A New Client
     * @param {string} host The url of the Pterodactyl Panel
     * @param {string} APIKey The APIKey of the Client
     * @param {object} options The options
     * @param {boolean} [options.addEverythingToCache] For the lazy people
     * @param {boolean} [options.addServersToCache] Whether to cache the fetched data of the servers
     * @param {boolean} [options.addAPIKeysToCache] Whether to cache the fetched data of the APIKeys
     * @param {boolean} [options.addAllocationsToCache] Whether to cache the fetched data of the Allocations
     */
    constructor(host, APIKey, options) {
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

        this.options = options || {};

        if (options && options.addEverythingToCache) {
            this.options.addServersToCache = true;
            this.options.addAPIKeysToCache = true;
            this.options.addAllocationsToCache = true;
        }

        this.APIKeys = new ClientAPIKeyManager(this)
        this.servers = new ClientServerManager(this);
    }

    /**
     * Throw a new error
     * @param {string|object|Error|TypeError} error The error
     * @returns {string|object|Error|TypeError} The error
     * @private
     */
    throwError(error) {
        if (error.response && error.response.data) return error.response.data;
        else if (error.response && error.response.status) return error.response.status;
        else return error;
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
                reject(this.throwError(err))
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
                reject(this.throwError(err))
            })
        })
    }

    /**
     * Enable The Two Factor Authentication For The Current Client
     * @param {object} data The data
     * @param {string} data.code The code to enable the two factor authentication
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
                reject(this.throwError(err))
            })
        })
    }

    /**
     * Disable The Two Factor Authentication For The Current Client
     * @param {object} data The data
     * @param {string} data.password The password of the client
     * @returns {Promise<Boolean>} The Two Factor Authentication Details
     */
    disableTwoFactorAuth(data) {
        if (!data) throw new Error('Data is required');
        if (typeof data !== 'object') throw new TypeError('Data must be an object');
        if (!data.password) throw new Error('Password is required');
        if (typeof data.password !== 'string') throw new TypeError('Password must be a string');
        return new Promise((resolve, reject) => {
            requests(`${this.host}/account/two-factor`, this.APIKey, 'DELETE', { password: data.password }).then(res => {
                resolve(true)
            }).catch(err => {
                reject(this.throwError(err))
            })
        })
    }

    /**
     * Update The Current Client's Email
     * @param {objecr} data The data
     * @param {string} data.email The new email of the client
     * @param {string} data.password The password of the client
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
                resolve(true)
            }).catch(err => {
                reject(this.throwError(err))
            })
        })
    }

    /**
     * Update The Current Client's Password
     * @param {object} data The data
     * @param {string} data.currentPassword The current password of the client
     * @param {string} data.newPassword The new password of the client
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
                resolve(true)
            }).catch(err => {
                reject(this.throwError(err))
            })
        })
    }
}

module.exports = Client;