const Client = require('../../../Client');
const { default: Collection } = require('@pteromanager/collection');
const ServerFile = require('../Server/ServerFile');

class ServerFileManager {
    /**
     * Create a new ServerFileManager class
     * @param {Client} client The PteroManager Client
     * @param {object} server The server
     * @param {string} server.identifier The server's identifier
     * @param {Array} data The data
     */
    constructor(client, server) {
        this.client = client;
        this.server = server;
    }

    /**
     * List all the server's files
     * @param {object} data The data
     * @param {string} [data.directory] The decoded URI name of the directory
     * @returns {Promise<Collection<string, ServerFile>>}
     */
    list(data) {
        if (!data) throw new Error('Data is required');
        if (typeof data !== 'object') throw new Error('Data must be an object');
        if (!data.directory) data.directory = '/';
        if (typeof data !== 'string') throw new Error('Directory must be a string');

        let encodedDirectory = encodeURIComponent(data.directory);
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/files?directory=${encodedDirectory}`, this.client.APIKey, 'GET', {}).then(res => {
                let files = new Collection();

                res.data.forEach(file => {
                    files.set(file.name, new ServerFile(this.client, this.server, { ...file.attributes, directory: data.directory }));
                });

                resolve(files);
            }).catch(err => {
                reject(err);
            })
        })
    }

    /**
     * Get a file's contents
     * @param {object} data The data
     * @param {string} data.file The path to the file
     * @returns {Promise<string>} The content of the file as a string
     */
    getContents(data) {
        if (!data) throw new Error('Data is required');
        if (typeof data !== 'object') throw new Error('Data must be an object');
        if (!data.file) throw new Error('File is required');
        if (typeof data.file !== 'string') throw new Error('File must be a string');

        let encodedFile = encodeURIComponent(data.file);
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/files/contents?file=${encodedFile}`, this.client.APIKey, 'GET', {}).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }

    /**
     * Get a link to download a file
     * @param {object} data The data
     * @param {string} data.file The path to the desired file
     * @returns {Promise<String>} The link to download the file
     */
    getDownloadLink(data) {
        if (!data) throw new Error('Data is required');
        if (typeof data !== 'object') throw new Error('Data must be an object');
        if (!data.file) throw new Error('File is required');
        if (typeof data.file !== 'string') throw new Error('File must be a string');

        let encodedFile = encodeURIComponent(data.file);
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/files/download?file=${encodedFile}`, this.client.APIKey, 'GET', {}).then(res => {
                resolve(res.attributes.url);
            }).catch(err => {
                reject(err);
            })
        })
    }

    /**
     * Rename a file
     * @param {object} data The data
     * @param {string} [data.directory] The path to the directory
     * @param {Object[]} data.files The files to rename
     * @param {string} data.files[].from The file's current name
     * @param {string} data.files[].to The file's new name
     * @returns {Promise<Boolean>} Whether the files were renamed
     */
    rename(data) {
        if (!data) throw new Error('Data is required');
        if (typeof data !== 'object') throw new Error('Data must be an object');
        if (!data.directory) data.directory = '/';
        if (typeof data.directory !== 'string') throw new Error('Directory must be a string');
        if (!data.files) throw new Error('Files is required');
        if (!Array.isArray(data.files)) throw new Error('Files must be an array');

        let files = [];
        
        data.files.forEach(file => {
            if (!file.from) throw new Error('From is required');
            if (typeof file.from !== 'string') throw new Error('From must be a string');
            if (!file.to) throw new Error('To is required');
            if (typeof file.to !== 'string') throw new Error('To must be a string');

            files.push({ from: file.from, to: file.to });
        });

        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/files/rename`, this.client.APIKey, 'PUT', { root: data.directory, files }).then(res => {
                resolve(true);
            }).catch(err => {
                reject(err);
            })
        })
    }

    /**
     * Copy a file
     * @param {object} data The data
     * @param {string} data.file The path to the file
     * @returns {Promise<Boolean>} Whether the file was copied
     */
    copy(data) {
        if (!data) throw new Error('Data is required');
        if (typeof data !== 'object') throw new Error('Data must be an object');
        if (!data.file) throw new Error('File is required');
        if (typeof data.file !== 'string') throw new Error('File must be a string');

        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/files/copy`, this.client.APIKey, 'POST', { location: data.file }).then(res => {
                resolve(true);
            }).catch(err => {
                reject(err);
            })
        })
    }

    /**
     * Write the content of a file
     * @param {object} data The data
     * @param {string} data.file The path to the file
     * @param {string} data.content The content to write
     * @returns {Promise<Boolean>} Whether the file was written
     */
    write(data) {
        if (!data) throw new Error('Data is required');
        if (typeof data !== 'object') throw new Error('Data must be an object');
        if (!data.file) throw new Error('File is required');
        if (typeof data.file !== 'string') throw new Error('File must be a string');
        if (!data.content) throw new Error('Content is required');
        if (typeof data.content !== 'string') throw new Error('Content must be a string');

        let encodedFile = encodeURIComponent(data.file);
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/files/write?file=${encodedFile}`, this.client.APIKey, 'POST', data.content).then(res => {
                resolve(true);
            }).catch(err => {
                reject(err);
            })
        })
    }

    /**
     * Compress files into a zip file
     * @param {object} data The data
     * @param {string} data.directory The path to the directory
     * @param {Array<String>} data.files The files to compress
     * @returns {Promise<ServerFile>} The compressed file
     */
    compress(data) {
        if (!data) throw new Error('Data is required');
        if (typeof data !== 'object') throw new Error('Data must be an object');
        if (!data.directory) data.directory = '/';
        if (typeof data.directory !== 'string') throw new Error('Directory must be a string');
        if (!data.files) throw new Error('Files is required');
        if (!Array.isArray(data.files)) throw new Error('Files must be an array');

        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/files/compress`, this.client.APIKey, 'POST', { root: data.directory, files: data.files }).then(res => {
                let serverfile = new ServerFile(this.client, this.server, res.attributes);
                resolve(serverfile);
            }).catch(err => {
                reject(err);
            })
        })
    }

    /**
     * Decompress files into a zip file
     * @param {object} data The data
     * @param {string} data.directory The path to the directory
     * @param {string} data.file The file to decompress
     * @returns {Promise<Boolean>} Whether the file was decompressed
     */
    decompress(data) {
        if (!data) throw new Error('Data is required');
        if (typeof data !== 'object') throw new Error('Data must be an object');
        if (!data.directory) data.directory = '/';
        if (typeof data.directory !== 'string') throw new Error('Directory must be a string');
        if (!data.file) throw new Error('File is required');
        if (typeof data.file !== 'string') throw new Error('File must be a string');

        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/files/decompress`, this.client.APIKey, 'POST', { root: data.directory, file: data.file }).then(res => {
                resolve(true);
            }).catch(err => {
                reject(err);
            })
        })
    }

    /**
     * Delete file(s) or folder(s)
     * @param {object} data The data
     * @param {string} data.directory The path to the directory
     * @param {Array<String>} data.files The files to delete
     * @returns {Promise<Boolean>} Whether the files were deleted
     */
    delete(data) {
        if (!data) throw new Error('Data is required');
        if (typeof data !== 'object') throw new Error('Data must be an object');
        if (!data.directory) data.directory = '/';
        if (typeof data.directory !== 'string') throw new Error('Directory must be a string');
        if (!data.files) throw new Error('Files is required');
        if (!Array.isArray(data.files)) throw new Error('Files must be an array');

        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/files/delete`, this.client.APIKey, 'POST', { root: data.directory, files: data.files }).then(res => {
                resolve(true);
            }).catch(err => {
                reject(err);
            })
        })
    }

    /**
     * Create a new folder
     * @param {object} data The data
     * @param {string} data.directory The path to the directory
     * @param {string} data.name The name of the folder
     * @returns {Promise<ServerFile>} The newly created folder
     */
    createFolder(data) {
        if (!data) throw new Error('Data is required');
        if (typeof data !== 'object') throw new Error('Data must be an object');
        if (!data.directory) data.directory = '/';
        if (typeof data.directory !== 'string') throw new Error('Directory must be a string');
        if (!data.name) throw new Error('Name is required');
        if (typeof data.name !== 'string') throw new Error('Name must be a string');

        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/files/create-folder`, this.client.APIKey, 'POST', { root: data.directory, name: data.name }).then(res => {
                let serverfile = new ServerFile(this.client, this.server, res.attributes);
                resolve(serverfile);
            }).catch(err => {
                reject(err);
            })
        })
    }

    /**
     * Upload files to the server
     * @returns {Promise<String>} A signed URL used to upload files to the server using POST
     */
    getUploadLink() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/files/upload`, this.client.APIKey, 'GET').then(res => {
                resolve(res.attributes.url);
            }).catch(err => {
                reject(err);
            })
        })
    }
}

module.exports = ServerFileManager;