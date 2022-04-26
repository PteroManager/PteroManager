const requests = require('../requests');
const APIKey = require('./Classes/Client/User/APIKey');
const { default: Collection } = require('@pteromanager/collection');
const ClientServerManager = require('./Classes/Client/Managers/ClientServerManager')
const ClientAPIKeyManager = require('./Classes/Client/Managers/ClientAPIKeyManager')
const ClientUserManager = require('./Classes/Client/Managers/ClientUserManager')

class Client {
    /**
     * Create A New Client
     * @param {string} host The url of the Pterodactyl Panel
     * @param {string} APIKey The APIKey of the Client
     * @param {object} options The options
     * @param {boolean} [options.addEverythingToCache] For the lazy people
     * @param {boolean} [options.addServersToCache] Whether to cache the fetched data of the servers
     * @param {boolean} [options.addAPIKeysToCache] Whether to cache the fetched data of the APIKeys
     * @param {boolean} [options.addAllocationsToCache] Whether to cache the fetched data of the Allocations
     */
    constructor(host, APIKey, options) {
        if (!host) {
            throw new Error('Host is required');
        }
        if (!APIKey) {
            throw new Error('APIKey is required');
        }

        if (typeof host !== 'string') throw new TypeError('Host must be a string');
        if (typeof APIKey !== 'string') throw new TypeError('APIKey must be a string');

        if (!host.startsWith('http://') && !host.startsWith('https://')) {
            host = `http://${host}`;
        }

        if (host.endsWith('/')) {
            host = host.substring(0, host.length - 1);
        }

        host += '/api/client'

        this.host = host;
        this.APIKey = APIKey;

        this.options = options || {};

        if (options && options.addEverythingToCache) {
            this.options.addServersToCache = true;
            this.options.addAPIKeysToCache = true;
            this.options.addAllocationsToCache = true;
        }

        this.user = new ClientUserManager(this);
        this.servers = new ClientServerManager(this);
    }

    /**
     * Throw a new error
     * @param {string|object|Error|TypeError} error The error
     * @returns {string|object|Error|TypeError} The error
     * @private
     */
    throwError(error) {
        if (error.response && error.response.data) return error.response.data;
        else if (error.response && error.response.status) return error.response.status;
        else return error;
    }
}

module.exports = Client;