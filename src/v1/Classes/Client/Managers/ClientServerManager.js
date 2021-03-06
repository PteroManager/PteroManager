const Client = require('../../../Client');
const requests = require('../../../requests')
const { default: Collection } = require('@pteromanager/collection');
const Server = require('../Server/Server')

class ClientServerManager {
    /**
     * Create A New ClientServerManager
     * @param {Client} client The PteroManager Client
     */
    constructor(client) {
        this.client = client;

        /**
         * The cached servers
         * @type {Collection<string, Server>} The servers
         */
        this.cache = new Collection();
    }
    /**
     * Fetch All Or A Specific Server
     * @param {object} data The data to send
     * @param {string} data.identifier The identifier of the server
     * @param {object} [data.include] The data to include
     * @param {boolean} [data.include.egg] Include the egg
     * @param {boolean} [data.include.subusers] Include the subusers
     * @returns {Promise<Server>} The server
     */
    fetch(data) {
        if (!data) throw new Error('No Data Provided');
        if (typeof data !== 'object') throw new TypeError('Data Must Be An Object');
        if (!data.identifier) throw new Error('No Identifier Provided');
        if (typeof data.identifier !== 'string') throw new TypeError('Identifier Must Be A String');
        if (!data.include) data.include = {};
        if (typeof data.include !== 'object') throw new TypeError('Include Must Be An Object');
        if (!data.include.egg) data.include.egg = false;
        if (typeof data.include.egg !== 'boolean') throw new TypeError('Include Egg Must Be A Boolean');
        if (!data.include.subusers) data.include.subusers = false;
        if (typeof data.include.subusers !== 'boolean') throw new TypeError('Include Subusers Must Be A Boolean');

        return new Promise((resolve, reject) => {
            let query = '';
            let includes = []
            if (data.include.egg) includes.push('egg');
            if (data.include.subusers) includes.push('subusers');

            if (includes.length > 0) query += `?include=${includes.join(',')}`;

            this.client._request(`${this.client.host}/servers/${data.identifier}${query}`, this.client.APIKey, 'GET', {}).then(res => {
                let server = new Server(this.client, res.attributes, res.meta)
                if (this.client.options.enableCache) this.cache.set(server.identifier, server)
                resolve(server)
            }).catch(err => {
                reject(this.client._throwError(err))
            })
        })
    }

    /**
     * Fetch All Servers
     * @param {object} [data] The data to send
     * @param {object} [data.include] The data to include
     * @param {boolean} [data.include.egg] Include the egg
     * @param {boolean} [data.include.subusers] Include the subusers
     * @param {object} [data.pagination] The pagination data
     * @param {number} [data.pagination.page] The page number
     * @param {number} [data.pagination.perPage] The number of results per page
     * @returns {Promise<Collection<string, Server>>} The servers
     */
    fetchAll(data) {
        if (!data) data = {};
        if (!data.include) data.include = {};
        if (!data.include.egg) data.include.egg = false;
        if (!data.include.subusers) data.include.subusers = false;

        return new Promise((resolve, reject) => {
            let query = '';
            let includes = []
            if (data.include.egg) includes.push('egg');
            if (data.include.subusers) includes.push('subusers');

            if (includes.length > 0) query += `?include=${includes.join(',')}`;

            let pagination = '';
            if (data.pagination) {
                if (data.pagination.page) pagination += `&page=${data.pagination.page}`;
                if (data.pagination.perPage) pagination += `&per_page=${data.pagination.perPage}`;
            }

            if (includes.length > 0) query += pagination
            else if (pagination.length > 0) query += '?' + pagination.replace('&', '')

            this.client._request(`${this.client.host}/${query}`, this.client.APIKey, 'GET', {}).then(res => {
                let servers = new Collection();
                res.data.forEach(server => {
                    let s = new Server(this.client, server.attributes)
                    if (this.client.options.enableCache) this.cache.set(s.identifier, s)
                    servers.set(s.identifier, s)
                })
                resolve(servers)
            }).catch(err => {
                reject(this.client._throwError(err))
            })
        })
    }
}

module.exports = ClientServerManager;