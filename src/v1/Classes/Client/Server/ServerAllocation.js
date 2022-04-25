const Client = require('../../../Client')
const Server = require('./Server')
const requests = require('../../../../requests')

class ServerAllocation {
    /**
     * Create a new ServerAllocation class
     * @param {Client} client 
     * @param {object} server 
     * @param {string} [server.identifier] The identifier of the server
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
     * Delete this allocation
     * @returns {Promise<Boolean>} Whether the allocation was deleted
     */
    delete() {
        return new Promise((resolve, reject) => {
            requests(`${this.client.host}/servers/${this.server.identifier}/network/allocations/${this.id}`, this.client.APIKey, 'DELETE', {}).then(res => {
                resolve(true)
            }).catch(err => {
                reject(this.client.throwError(err))
            })
        })
    }

    /**
     * Update this allocation
     * @param {object} data The data
     * @param {string} [data.note] The name of the allocation
     * @returns {Promise<ServerAllocation>} The updated allocation
     */
    setNote(data) {
        if (!data) throw new Error('No data provided')
        if (typeof data !== 'object') throw new TypeError('Data must be an object')
        if (!data.note) throw new Error('No note provided')
        if (typeof data.note !== 'string') throw new TypeError('Note must be a string')

        return new Promise((resolve, reject) => {
            requests(`${this.client.host}/servers/${this.server.identifier}/network/allocations/${this.id}`, this.client.APIKey, 'POST', { notes: data.note}).then(res => {
                let allocation = new ServerAllocation(this.client, { identifier: this.server.identifier }, res.attributes)
                if (this.client.options.addAPIKeysToCache) this.client.servers.cache.set(allocation.id, allocation)
                resolve(allocation)
            }).catch(err => {
                reject(this.client.throwError(err))
            })
        })
    }
}

module.exports = ServerAllocation;