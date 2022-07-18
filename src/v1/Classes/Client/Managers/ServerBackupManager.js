const Client = require("../../../Client");
const { default: Collection } = require('@pteromanager/collection');
const ServerBackup = require("../Server/ServerBackup");

class ServerBackupManager {
    /**
     * Create a new ServerBackupManager
     * @param {Client} client The Pterodactyl Client
     * @param {Object} server The server object
     * @param {String} server.identifier The data
     * @param {Array} data An array of the fetched tasks
     */
    constructor(client, server, data) {
        this.client = client;
        this.server = server;
        /**
         * @type {Collection<string, ServerBackup}
         */
        this.cache = new Collection();

        data.forEach(backup => {
            this.cache.set(backup.attributes.uuid, new ServerBackup(this.client, this.server, backup.attributes));
        })
    }

    /**
     * List all backups for the server
     * @param {Object} [data] The data
     * @param {object} [data.pagination] The pagination data
     * @param {number} [data.pagination.page] The page number
     * @param {number} [data.pagination.perPage] The number of results per page
     * @returns {Promise<Collection<string, ServerBackup>>} A collection of all backups
     */
    fetchAll(data) {
        if (!data) data = { pagination: {} };
        if (!data.pagination) data.pagination = {};
        if (!data.pagination.page) data.pagination.page = 1;
        if (typeof data.pagination.page !== 'number') throw new TypeError('Page must be a number');
        if (!data.pagination.perPage) data.pagination.perPage = 20;
        if (typeof data.pagination.perPage !== 'number') throw new TypeError('PerPage must be a number');
        return new Promise((resolve, reject) => {
            let pagination = '';
            if (data.pagination) {
                if (data.pagination.page) pagination += `?page=${data.pagination.page}`;
                if (data.pagination.perPage) pagination += `${pagination.length > 0 ? `&per_page=${data.pagination.perPage}` : `?per_page=${data.pagination.perPage}`}`;
            }
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/backups${pagination}`, this.client.APIKey, 'GET', {}).then(res => {
                if (this.client.options.enableCache) {
                    res.data.forEach(backup => {
                        this.cache.set(backup.attributes.uuid, new ServerBackup(this.client, this.server, backup.attributes));
                    })
                }
                resolve(this.cache);
            }).catch(err => {
                reject(this.client._throwError(err));
            })
        })
    }

    /**
     * Create a new backup
     * @param {Object} [data] The data
     * @param {String} [data.name] The name of the backup
     * @returns {Promise<ServerBackup>} The backup
     */

    // @param {Array<string>} [data.ignoredFiles] The description of the backup
    // Have to look into this
    create(data) {
        if (!data) data = {};
        if (!data.name) data.name = 'Backup';
        // if (!data.ignoredFiles) data.ignoredFiles = [];
        if (typeof data.name !== 'string') throw new TypeError('Name must be a string');
        // if (!Array.isArray(data.ignoredFiles)) throw new TypeError('IgnoredFiles must be an array');

        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/backups`, this.client.APIKey, 'POST', { name: data.name /*, ignored_files: data.ignoredFiles */ }).then(res => {
                if (this.client.options.enableCache) {
                    this.cache.set(res.data.attributes.uuid, new ServerBackup(this.client, this.server, res.data.attributes));
                }
                resolve(new ServerBackup(this.client, this.server, res.data.attributes));
            }).catch(err => {
                reject(this.client._throwError(err));
            })
        })
    }

    /**
     * Get a backup by its UUID
     * @param {object} data The data
     * @param {String} data.uuid The UUID of the backup
     * @returns {Promise<ServerBackup>} The backup
     */
    fetch(data) {
        if (!data) data = {};
        if (!data.uuid) throw new Error('UUID is required');
        if (typeof data.uuid !== 'string') throw new TypeError('UUID must be a string');
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/backups/${data.uuid}`, this.client.APIKey, 'GET', {}).then(res => {
                if (this.client.options.enableCache) {
                    this.cache.set(res.data.attributes.uuid, new ServerBackup(this.client, this.server, res.attributes));
                }
                resolve(new ServerBackup(this.client, this.server, res.attributes));
            }).catch(err => {
                reject(this.client._throwError(err));
            })
        })
    }

    /**
     * Delete a backup by its UUID
     * @param {object} data The data
     * @param {String} data.uuid The UUID of the backup
     * @returns {Promise<Boolean>} The backup
     */
    delete(data) {
        if (!data) data = {};
        if (!data.uuid) throw new Error('UUID is required');
        if (typeof data.uuid !== 'string') throw new TypeError('UUID must be a string');
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/backups/${data.uuid}`, this.client.APIKey, 'DELETE', {}).then(res => {
                if (this.client.options.enableCache) {
                    this.cache.delete(data.uuid);
                }
                resolve(true);
            }).catch(err => {
                reject(this.client._throwError(err));
            })
        })
    }
}

module.exports = ServerBackupManager;