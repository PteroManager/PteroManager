const Client = require("../../../Client");

class ServerBackup {
    /**
     * Create a new ServerBackup
     * @param {Client} client The PteroManager Client
     * @param {object} server The data
     * @param {String} server.identifier The identifier of the server 
     * @param {object} data The data
     */
    constructor(client, server, data) {
        this.client = client;
        this.server = server;

        this.uuid = data.uuid;
        this.name = data.name;
        /**
         * @type {Array<string>}
         */
        this.ignoredFiles = data.ignoredFiles;

        this.sha256Hash = data.sha256Hash;
        this.bytes = data.bytes;

        this.createdAt = new Date(data.created_at);
        this.createdTimestamp = new Date(data.created_at).getTime();

        /**
         * @type {Date | null}
         */
        this.completedAt = data.completed_at ? new Date(data.completed_at) : null;

        /**
         * @type {Date | null}
         */
        this.completedTimestamp = data.completed_at ? new Date(data.completed_at).getTime() : null;
    }

    /**
     * Fetch this backup
     * @returns {Promise<ServerBackup>} The backup
     */
    fetch() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/backups/${this.uuid}`, this.client.APIKey, 'GET', {}).then(res => {
                if(this.client.options.enableCache) this.client.servers.cache.get(this.server.identifier)?.backups.cache.set(this.uuid, new ServerBackup(this.client, this.server, res.attributes));
                resolve(new ServerBackup(this.client, this.server, res.attributes));
            }).catch(err => {
                reject(this.client._throwError(err));
            })
        })
    }
    /**
     * Get the download URL for the backup
     * @returns {Promise<string>} The download URL
     */
    getDownloadLink() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/backups/${this.uuid}/download`, this.client.APIKey, 'GET', {}).then(res => {
                resolve(res.attributes.url);
            }).catch(err => {
                reject(this.client._throwError(err));
            })
        })
    }

    /**
     * Delete the backup
     * @returns {Promise<Boolean>} Whether the backup was deleted
     */
    delete() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/backups/${this.uuid}`, this.client.APIKey, 'DELETE', {}).then(res => {
                if(this.client.options.enableCache) this.client.servers.cache.get(this.server.identifier)?.backups.cache.delete(this.uuid);
                resolve(true);
            }).catch(err => {
                reject(this.client._throwError(err));
            })
        })
    }
}

module.exports = ServerBackup;