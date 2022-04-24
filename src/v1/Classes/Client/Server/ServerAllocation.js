const Client = require('../../../Client')
const Server = require('./Server')

class ServerAllocation {
    /**
     * Create a new ServerAllocation class
     * @param {Client} client 
     * @param {Server} server 
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
        return this.server.deleteAllocation({ id: this.id })
    }

    /**
     * Update this allocation
     * @param {object} data The data
     * @param {string} [data.note] The name of the allocation
     * @returns {Promise<ServerAllocation>} The updated allocation
     */
    setNote(data) {
        return this.server.setAllocationNote({ id: this.id, note: data.note })
    }
}

module.exports = ServerAllocation;