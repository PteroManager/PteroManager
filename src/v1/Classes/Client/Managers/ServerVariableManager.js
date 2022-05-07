const Client = require('../../../Client');
const { default: Collection } = require('@pteromanager/collection');
const ServerVariable = require('../Server/ServerVariable');

class ServerVariableManager {
    /**
     * Create a new ServerVariableManager
     * @param {Client} client The PteroManager Client
     * @param {object} server The server
     * @param {string} server.identifier The server identifier
     * @param {Array} data The data
     * @param {object} metadata The metadata
     */
    constructor(client, server, data, metadata) {
        this.client = client;
        this.server = server;

        /**
         * @type {Collection<string, ServerVariable>} The cache
         */
        this.cache = new Collection();

        data.forEach(variable => {
            this.cache.set(variable.attributes.env_variable, new ServerVariable(client, server, variable.attributes));
        });

        if (metadata) {
            if (metadata.startup_command) {
                this.startupCommand = metadata.startup_command;
            }
            if (metadata.raw_startup_command) {
                this.rawStartupCommand = metadata.raw_startup_command;
            }
        }
    }

    /**
     * Fetch the server variables
     * @returns {Promise<Collection<string, ServerVariable>>} The server variables
     */
    fetchAll() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/startup`, this.client.APIKey, 'GET', {}).then(res => {
                let variables = new Collection();
                res.forEach(variable => {
                    if (this.client.options.enableCache) this.cache.set(variable.attributes.env_variable, new ServerVariable(this.client, this.server, variable.attributes.env_variable));
                    variables.set(variable.attributes.env_variable, new ServerVariable(this.client, this.server, variable.attributes.key));
                });
                resolve(variables);
            }).catch(err => {
                reject(this.client._throwError(err));
            });
        });
    }

    /**
     * Update a server variable
     * @param {object} data The data
     * @param {string} data.key The variable key
     * @param {any} [data.value] The variable value
     * @returns {Promise<ServerVariable>} The server variable
     */
    update(data) {
        if (!data) throw new Error('No data provided');
        if (typeof data !== 'object') throw new Error('Data must be an object');
        if (!data.key) throw new Error('No key provided');
        if (typeof data.key !== 'string') throw new Error('Key must be a string');

        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/startup/variable`, this.client.APIKey, 'PUT', data).then(res => {
                if (this.client.options.enableCache) {
                    this.cache.set(data.key, new ServerVariable(this.client, this.server, res.attributes));
                }
                resolve(new ServerVariable(this.client, this.server, res.attributes));
            }).catch(err => {
                reject(this.client._throwError(err));
            });
        });
    }
}

module.exports = ServerVariableManager;