const Client = require('../../../Client');

class ServerFile {
    /**
     * Create a new ServerFile instance.
     * @param {Client} client The PteroManager Client
     * @param {object} server The server object
     * @param {string} server.identifier The server identifier
     * @param {object} data The data
     */
    constructor(client, server, data) {
        this.client = client;
        this.server = server;

        this.name = data.name;
        this.mode = data.mode;
        this.size = data.size;
        this.isFile = data.is_file;
        this.isSymlink = data.is_symlink;
        this.editable = data.is_editable;
        this.mimetype = data.mimetype;
        this.createdAt = new Date(data.created_at);
        this.createdTimestamp = new Date(data.created_at).getTime();
        this.modifiedAt = new Date(data.modified_at);
        this.modifiedTimestamp = new Date(data.modified_at).getTime();
        this.directory = data.directory;
    }

    /**
     * Get the file contents.
     * @returns {Promise<string>}
     */
    getContents() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/files/contents?file=${encodeURIComponent(this.directory) + encodeURIComponent(this.name)}`, this.client.APIKey, 'GET', {}).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }

    /**
     * Get a link to download a file
     * @returns {Promise<string>} The link
     */
    getDownloadLink() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/files/download?file=${encodeURIComponent(this.directory) + encodeURIComponent(this.name)}`, this.client.APIKey, 'GET', {}).then(res => {
                resolve(res.attributes.url);
            }).catch(err => {
                reject(err);
            })
        })
    }

    /**
     * Rename the file.
     * @param {object} data The data
     * @param {string} data.name The new name
     * @returns {Promise<ServerFile>} The new ServerFile
     */
    rename(data) {
        if (!data) throw new Error('No data provided');
        if (data !== 'object') throw new Error('Data must be an object');
        if (!data.name) throw new Error('No name provided');
        if (typeof data.name !== 'string') throw new Error('Name must be a string');

        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/files/rename`, this.client.APIKey, 'PUT', { root: this.directory, files: [{ from: this.name, to: data.name }] }).then(res => {
                this.name = data.name;
                resolve(this);
            }).catch(err => {
                reject(err);
            })
        });
    }

    /**
     * Copy the file.
     * @param {object} [data] The data
     * @param {string} [data.location] The location to copy to
     * @returns {Promise<Boolean>} Whether the copy was successful
     */
    copy(data) {
        if (!data) data = {};
        if (data !== 'object') throw new Error('Data must be an object');
        if (!data.location) data.location = this.directory;
        if (typeof data.location !== 'string') throw new Error('Location must be a string');

        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/files/copy`, this.client.APIKey, 'POST', { location: this.directory }).then(res => {
                resolve(true);
            }).catch(err => {
                reject(err);
            })
        });
    }

    /**
     * Write contents to the file.
     * @param {object} data The data
     * @param {string} data.contents The contents to write
     * @returns {Promise<Boolean>} Whether the write was successful
     */
    write(data) {
        if (!data) throw new Error('No data provided');
        if (data !== 'object') throw new Error('Data must be an object');
        if (!data.contents) throw new Error('No contents provided');
        if (typeof data.contents !== 'string') throw new Error('Contents must be a string');

        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/files/write?file=${encodeURIComponent(this.directory) + encodeURIComponent(this.name)}`, this.client.APIKey, 'POST', data.contents).then(res => {
                resolve(true);
            }).catch(err => {
                reject(err);
            })
        });
    }

    /**
     * Decompress the file.
     * @returns {Promise<Boolean>} Whether the decompression was successful
     */
    decompress() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/files/decompress`, this.client.APIKey, 'POST', { root: this.directory, file: this.name }).then(res => {
                resolve(true);
            }).catch(err => {
                reject(err);
            })
        });
    }

    /**
     * Delete the file.
     * @returns {Promise<Boolean>} Whether the deletion was successful
     */
    delete() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/files/delete`, this.client.APIKey, 'POST', { root: this.directory, files: [this.name] }).then(res => {
                resolve(true);
            }).catch(err => {
                reject(err);
            })
        });
    }
}

module.exports = ServerFile;