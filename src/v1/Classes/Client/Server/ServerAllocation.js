const Client = require('../../../Client')
const Server = require('./Server')
const requests = require('../../../requests');
const ServerAllocationManager = require('../Managers/ServerAllocationManager');

class ServerAllocation {
    /**
     * Create a new ServerAllocation class
     * @param {Client} client 
     * @param {object} server 
     * @param {string} server.identifier The identifier of the server
     * @param {object} data 
     */
    constructor(client, server, data) {
        this.client = client;
        this.server = server;

        this.id = data.id;
        this.ip = data.ip;
        this.ipAlias = data.ip_alias;
        this.port = data.port;
        this.notes = data.notes;
        this.isDefault = data.is_default;
    }

    /**
     * Fetch this allocation
     * @returns {Promise<ServerAllocation>} The allocation
     */
    fetch() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/allocations/${this.id}`, this.client.APIKey, 'GET', {}).then(res => {
                if(this.client.options.enableCache) this.client.servers.cache.get(this.server.identifier)?.allocations.cache.set(this.id, new ServerAllocation(this.client, this.server, res.attributes))
                resolve(new ServerAllocation(this.client, this.server, res.attributes));
            }).catch(err => {
                reject(this.client._throwError(err));
            })
        })
    }

    /**
     * Delete this allocation
     * @returns {Promise<Boolean>} Whether the allocation was deleted
     */
    delete() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/network/allocations/${this.id}`, this.client.APIKey, 'DELETE', {}).then(res => {
                if(this.client.options.enableCache) this.client.servers.cache.get(this.server.identifier)?.allocations.cache.delete(this.id)
                resolve(true)
            }).catch(err => {
                reject(this.client._throwError(err))
            })
        })
    }

    /**
     * Update this allocation
     * @param {object} data The data
     * @param {string} data.note The name of the allocation
     * @returns {Promise<ServerAllocation>} The updated allocation
     */
    setNote(data) {
        if (!data) throw new Error('No data provided')
        if (typeof data !== 'object') throw new TypeError('Data must be an object')
        if (!data.note) throw new Error('No note provided')
        if (typeof data.note !== 'string') throw new TypeError('Note must be a string')

        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/network/allocations/${this.id}`, this.client.APIKey, 'POST', { notes: data.note}).then(res => {
                let allocation = new ServerAllocation(this.client, { identifier: this.server.identifier }, res.attributes)
                if (this.client.options.enableCache) this.client.servers.cache.get(this.server.identifier)?.allocations.cache.set(this.id, allocation)
                resolve(allocation)
            }).catch(err => {
                reject(this.client._throwError(err))
            })
        })
    }

    /**
     * Set this allocation as the primary allocation
     * @returns {Promise<ServerAllocation>} The updated allocation
     */
    setPrimary() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/network/allocations/${this.id}/primary`, this.client.APIKey, 'POST', { is_default: true }).then(res => {
                let allocation = new ServerAllocation(this.client, { identifier: this.server.identifier }, res.attributes)
                if (this.client.options.enableCache) this.client.servers.cache.get(this.server.identifier)?.allocations.cache.set(this.id, allocation)
                resolve(allocation)
            }).catch(err => {
                reject(this.client._throwError(err))
            })
        })
    }
}

module.exports = ServerAllocation;