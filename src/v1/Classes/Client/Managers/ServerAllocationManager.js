const Client = require('../../../Client')
const { default: Collection } = require('@pteromanager/collection')
const requests = require('../../../../requests')

class ServerAllocationManager {
    /**
     * Create a new ServerAllocationManager class
     * @param {Client} client The PteroManager client
     * @param {object} server The server
     * @param {string} server.identifier The server identifier
     * @param {Array} data The data
     */
    constructor(client, server, data) {
        this.client = client;
        this.server = server;

        // Do NOT move this, it loads this file before the ServerAllocation file
        const ServerAllocation = require('../Server/ServerAllocation')
        /**
         * The cache
         * @type {Collection<number, ServerAllocation>}
         */
        this.cache = new Collection();

        data.forEach(allocation => {
            let allocationClass = new ServerAllocation(this.client, { identifier: this.server.identifier }, allocation.attributes)
            this.cache.set(allocation.attributes.id, allocationClass);
        });
    }

    /**
     * Fetch the allocations for this server
     * @returns {Promise<Collection<number, import('../Server/ServerAllocation')>>} The allocations
     */
    fetch() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/network/allocations`, this.client.APIKey, 'GET', {}).then(res => {
                let allocations = new Collection();
                res.forEach(allocation => {
                    const ServerAllocation = require('../Server/ServerAllocation')

                    if (this.client.options.enableCache) this.cache.set(allocation.attributes.id, new ServerAllocation(this.client, { identifier: this.server.identifier }, allocation.attributes));
                    allocations.set(allocation.attributes.id, new ServerAllocation(this.client, { identifier: this.server.identifier }, allocation.attributes));
                });
                resolve(allocations);
            }).catch(err => {
                reject(this.client._throwError(err))
            })
        })
    }

    /**
     * Create a new allocation for the current server
     * @returns {Promise<import('../Server/ServerAllocation')>}
     */
    create() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/network/allocations`, this.client.APIKey, 'POST', {}).then(res => {
                const ServerAllocation = require('../Server/ServerAllocation')

                let allocation = new ServerAllocation(this.client, { identifier: this.server.identifier }, res.attributes);
                if (this.client.options.enableCache) this.cache.set(allocation.id, allocation);
                resolve(allocation);
            }).catch(err => {
                reject(this.client._throwError(err))
            })
        })
    }

    /**
     * Set the note for a server allocation
     * @param {object} data The data
     * @param {string} data.note The note
     * @param {number|string} data.id The allocation id
     * @returns {Promise<import('../Server/ServerAllocation')>} The updated allocation
     */
    setNote(data) {
        if (!data) throw new Error('Data is required');
        if (typeof data !== 'object') throw new TypeError('Data must be an object');
        if (!data.id) throw new Error('ID is required');
        if (typeof data.id !== 'string' && typeof data.id !== 'number') throw new TypeError('ID must be a string or number');
        if (!data.note) throw new Error('Note is required');
        if (typeof data.note !== 'string') throw new TypeError('Note must be a string');
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/network/allocations/${data.id}`, this.client.APIKey, 'POST', { notes: data.note }).then(res => {
                const ServerAllocation = require('../Server/ServerAllocation')

                let allocation = new ServerAllocation(this.client, { identifier: this.identifier }, res.attributes)
                if (this.client.options.enableCache) this.cache.set(allocation.id, allocation)
                resolve(allocation)
            }).catch(err => {
                reject(this.client._throwError(err))
            })
        })
    }

    /**
     * Set the primary allocation
     * @param {object} data The data
     * @param {number|string} data.id The allocation id
     * @returns {Promise<import('../Server/ServerAllocation')>} The updated allocation
     */
    setPrimary(data) {
        if (!data) throw new Error('Data is required');
        if (typeof data !== 'object') throw new TypeError('Data must be an object');
        if (!data.id) throw new Error('ID is required');
        if (typeof data.id !== 'string' && typeof data.id !== 'number') throw new TypeError('ID must be a string or number');
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/network/allocations/${data.id}/primary`, this.client.APIKey, 'POST', {}).then(res => {
                const ServerAllocation = require('../Server/ServerAllocation')

                let allocation = new ServerAllocation(this.client, { identifier: this.identifier }, res.attributes)
                if (this.client.options.enableCache) this.cache.set(allocation.id, allocation)
                resolve(allocation)
            }).catch(err => {
                reject(this.client._throwError(err))
            })
        })
    }

    /**
     * Delete an allocation
     * @param {object} data The data
     * @param {number|string} data.id The allocation id
     * @returns {Promise<Boolean>} The updated allocation
     */
    delete(data) {
        if (!data) throw new Error('Data is required');
        if (typeof data !== 'object') throw new TypeError('Data must be an object');
        if (!data.id) throw new Error('ID is required');
        if (typeof data.id !== 'string' && typeof data.id !== 'number') throw new TypeError('ID must be a string or number');
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/network/allocations/${data.id}`, this.client.APIKey, 'DELETE', {}).then(res => {
                if (this.client.options.enableCache) this.cache.delete(allocation.id)
                resolve(true)
            }).catch(err => {
                reject(this.client._throwError(err))
            })
        })
    }
}

module.exports = ServerAllocationManager;