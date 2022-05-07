const Client = require('../../../Client')

class ServerDatabase {
    /**
     * Create a new API Key class
     * @param {Client} client The PteroManager Client
     * @param {object} server The server object
     * @param {object} server.identifier The server identifier
     * @param {object} data The data
     */
    constructor(client, server, data) {
        this.client = client;
        this.server = server;

        this.id = data.id;
        this.ip = data.host.address;
        this.port = data.host.port;
        this.name = data.name;
        this.username = data.username;
        this.connectionsFrom = data.connections_from;
        this.maxConnections = data.max_connections;

        if (this.relationships?.password?.attributes) {
            this.password = this.relationships.password.attributes.password;
        }
    }

    /**
     * Reset this database's password
     * @returns {Promise<ServerDatabase>} Returns the database, which includes the newly generated password.
     */
    resetPassword() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/databases/${this.id}/rotate-password`, this.client.APIKey, 'POST', {}).then(res => {
                let database = new ServerDatabase(this.client, this.server, res.attributes);
                if (this.client.options.enableCache) this.client.servers.cache.get(this.server.identifier)?.databases.cache.set(this.id, database)
                resolve(database)
            }).catch(err => {
                reject(err)
            })
        })
    }

    /**
     * Delete this database
     * @returns {Promise<Boolean>} Returns true if the database was successfully deleted
     */
    delete() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.id}/databases/${this.id}`, this.client.APIKey, 'DELETE', {}).then(res => {
                if (this.client.options.enableCache) this.client.servers.cache.get(this.server.identifier)?.databases.cache.delete(this.id);
                resolve(true)
            }).catch(err => {
                reject(this.client._throwError(err))
            })
        })
    }
}

module.exports = ServerDatabase;