const Client = require('../../../Client');
const requests = require('../../../requests')
const { default: Collection } = require('@pteromanager/collection');
const APIKey = require('../User/APIKey')

class ClientAPIKeyManager {
    /**
     * Create A New ClientAPIKeyManager
     * @param {Client} client The PteroManager Client
     */
    constructor(client) {
        this.client = client;

        this.cache = new Collection();
    }

    /**
     * Fetch all or a specific API Key
     * @returns {Promise<Collection<string, object>>} The API Keys
     */
    fetchAll() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/account/api-keys`, this.client.APIKey, 'GET', {}).then(res => {
                let keys = new Collection();
                res.data.forEach(key => {
                    keys.set(key.attributes.identifier, new APIKey(this.client, key.attributes))
                })

                if (this.client.options.enableCache) {
                    res.data.forEach(key => {
                        this.cache.set(key.attributes.identifier, new APIKey(this.client, key.attributes))
                    })
                }

                resolve(keys)
            }).catch(err => {
                reject(this.client._throwError(err))
            })
        })
    }

    /**
     * Create a new API Key
     * @param {object} data The data to send
     * @param {string} data.description The description of the API Key
     * @param {Array<string>} [data.allowedIPs] The allowed IPs of the API Key
     * @returns {Promise<APIKey>} The API Key
     */
    create(data) {
        if (!data) throw new Error('Data is required')
        if (typeof data !== 'object') throw new TypeError('Data must be an object')
        if (!data.description) throw new Error('Description is required')
        if (typeof data.description !== 'string') throw new TypeError('Description must be a string')
        if (data.allowedIPs && !Array.isArray(data.allowedIPs)) throw new TypeError('Allowed IPs must be an array')
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/account/api-keys`, this.client.APIKey, 'POST', { description: data.description, allowed_ips: (data.allowedIPs || [])}).then(res => {
                let key = new APIKey(this.client, res.attributes, res.meta)
                if (this.client.options.enableCache) this.cache.set(key.identifier, key)
                resolve(key)
            }).catch(err => {
                reject(this.client._throwError(err))
            })
        })
    }

    /**
     * Delete an API Key
     * @param {object} data The data to send
     * @param {string} data.identifier The identifier of the API Key
     * @returns {Promise<Boolean>} Whether the API Key was deleted
     */
    delete(data) {
        if (!data) throw new Error('Data is required')
        if (typeof data !== 'object') throw new TypeError('Data must be an object')
        if (!data.identifier) throw new Error('Identifier is required')
        if (typeof data.identifier !== 'string') throw new TypeError('Identifier must be a string')
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/account/api-keys/${data.identifier}`, this.client.APIKey, 'DELETE', {}).then(res => {
                if (this.client.options.enableCache) this.cache.delete(data.identifier)
                resolve(true)
            }).catch(err => {
                reject(this.client._throwError(err))
            })
        })
    }
}

module.exports = ClientAPIKeyManager;