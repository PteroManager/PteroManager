const { default: Collection } = require('@pteromanager/collection');
const Client = require('../../../Client')
const ServerDatabase = require('../Server/ServerDatabase');

class ServerDatabaseManager {
    /**
     * Create a new ServerDatabaseManager
     * @param {Client} client The PteroManager Client
     * @param {object} server The server
     * @param {string} server.identifier The server identifier
     * @param {Array} data The data
     */
    constructor(client, server, data) {
        this.client = client;
        this.server = server;

        /**
         * The cache
         * @type {Collection<string, import('../Server/ServerDatabase')>}
         */
        this.cache = new Collection();

        data.forEach(database => {
            this.cache.set(database.attributes.id, new ServerDatabase(this.client, this.server, database));
        });
    }

    /**
     * Fetches all databases
     * @returns {Promise<Collection<string, ServerDatabase>>}
     */
    fetchAll() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/databases`, this.client.APIKey, 'GET', {}).then(res => {
                let databases = new Collection();
                res.data.forEach(database => {
                    if (this.client.options.enableCache) this.cache.set(database.attributes.id, new ServerDatabase(this.client, this.server, database.attributes));
                    databases.set(database.attributes.id, new ServerDatabase(this.client, this.server, database.attributes));
                });
                resolve(databases);
            }).catch(err => {
                reject(this.client._throwError(err));
            });
        })
    }

    /**
     * Creates a new database
     * @param {object} data The data
     * @param {string} data.name The name
     * @param {string} data.remote The remote
     * @returns {Promise<ServerDatabase>} The newly created database
     */
    create(data) {
        if(!data) throw new Error('No data provided')
        if (typeof data !== 'object') throw new TypeError('Data must be an object')
        if (!data.name) throw new Error('No name provided')
        if (typeof data.name !== 'string') throw new TypeError('Name must be a string')
        if (!data.remote) throw new Error('No remote provided')
        if (typeof data.remote !== 'string') throw new TypeError('Remote must be a string')

        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/databases`, this.client.APIKey, 'POST', { database: data.name, remote: data.remote }).then(res => {
                let database = new ServerDatabase(client, server, res.attributes);
                if (this.client.options.enableCache) this.cache.set(database.name, database)
                resolve(database)
            }).catch(err => {
                reject(this.client._throwError(err))
            })
        })
    }

    /**
     * Reset a database's password
     * @param {object} data The data
     * @param {string} data.id The database's Id
     * @returns {Promise<ServerDatabase>} The updated database
     */
    resetPassword(data) {
        if (!data) throw new Error('No data provided')
        if (typeof data !== 'object') throw new TypeError('Data must be an object');
        if (!data.id) throw new Error('No id provided')
        if (typeof data.id !== 'string') throw new TypeError('Id must be a string')
        
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/databases/${data.id}/rotate-password`, this.client.APIKey, 'POST', {}).then(res => {
                let database = new ServerDatabase(client, server, res.attributes);
                resolve(database)
            })
        })
    }

    /**
     * Delete a database
     * @param {object} data The data
     * @param {string} data.id The database's Id
     * @returns {Promise<Boolean>} Returns true if the database was successfully deleted
     */
    delete(data) {
        if (!data) throw new Error('No data provided')
        if (typeof data !== 'object') throw new TypeError('Data must be an object')
        if (!data.id) throw new Error('No Id provided')
        if (typeof data.id !== 'string') throw new TypeError('Id must be a string')
        
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/databases/${data.id}`, this.client.APIKey, 'DELETE', {}).then(res => {
                if (this.client.options.enableCache) this.cache.delete(data.id);
                resolve(true)
            }).catch(err => {
                reject(this.client._throwError(err))
            })
        })
    }
}

module.exports = ServerDatabaseManager;