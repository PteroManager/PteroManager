const ClientAPIKeyManager = require('./ClientAPIKeyManager')
const requests = require('../../../requests');
const Client = require('../../../Client')

class ClientUserManager {
    /**
     * ClientUserManager Constructor
     * @param {Client} client The client
     */
    constructor(client) {
        this.client = client;

        this.email = null;
        this.username = null;
        this.admin = null;
        this.id = null;
        this.firstName = null;
        this.lastName = null;
        this.language = null;

        this.APIKeys = new ClientAPIKeyManager(this)

    }

    /**
     * Get The Current Client's Account Details
     * @returns {Promise<ClientUserManager>} The Account Details
     */
    getAccountDetails() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/account`, this.client.APIKey, 'GET', {}).then(res => {
                this.email = res.attributes.email;
                this.username = res.attributes.username;
                this.admin = res.attributes.admin;
                this.id = res.attributes.id;
                this.firstName = res.attributes.first_name;
                this.lastName = res.attributes.last_name;
                this.language = res.attributes.language;
                resolve(this)
            }).catch(err => {
                reject(this.client._throwError(err))
            })
        })
    }

    /**
     * Get The Current Client's Two Factor Authentication Details
     * @returns {Promise<Object>} The Two Factor Authentication Details
     */
    getTwoFactorAuthDetails() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/account/two-factor`, this.client.APIKey, 'GET', {}).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(this.client._throwError(err))
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
            this.client._request(`${this.client.host}/account/two-factor`, this.client.APIKey, 'POST', { code: data.code }).then(res => {
                resolve(res.attributes)
            }).catch(err => {
                reject(this.client._throwError(err))
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
            this.client._request(`${this.client.host}/account/two-factor`, this.client.APIKey, 'DELETE', { password: data.password }).then(res => {
                resolve(true)
            }).catch(err => {
                reject(this.client._throwError(err))
            })
        })
    }

    /**
     * Update The Current Client's Email
     * @param {objecr} data The data
     * @param {string} data.email The new email of the client
     * @param {string} data.password The password of the client
     * @returns {Promise<ClientUserManager>} Wether the email was successfully updated
     */
    updateAccountEmail(data) {
        if (!data) throw new Error('Data is required');
        if (typeof data !== 'object') throw new TypeError('Data must be an object');
        if (!data.email) throw new Error('Email is required');
        if (typeof data.email !== 'string') throw new TypeError('Email must be a string');
        if (!data.password) throw new Error('Password is required');
        if (typeof data.password !== 'string') throw new TypeError('Password must be a string');
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/account/email`, this.client.APIKey, 'PUT', { email: data.email, password: data.password }).then(res => {
                this.email = data.email;
                resolve(this)
            }).catch(err => {
                reject(this.client._throwError(err))
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
            this.client._request(`${this.client.host}/account/password`, this.client.APIKey, 'PUT', { current_password: data.oldPassword, password: data.newPassword, password_confirmation: data.newPassword }).then(res => {
                resolve(true)
            }).catch(err => {
                reject(this.client._throwError(err))
            })
        })
    }
}

module.exports = ClientUserManager;