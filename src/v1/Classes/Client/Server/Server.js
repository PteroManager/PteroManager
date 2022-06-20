const Client = require('../../../Client');
const { default: Collection } = require('@pteromanager/collection');
const ServerAllocation = require('./ServerAllocation');
const requests = require('../../../requests');
const ServerAllocationManager = require('../Managers/ServerAllocationManager');
const ServerVariableManager = require('../Managers/ServerVariableManager');
const ServerSubuserManager = require('../Managers/ServerSubuserManager');
const ServerDatabaseManager = require('../Managers/ServerDatabaseManager');
const ServerFileManager = require('../Managers/ServerFileManager');

class Server {
    /**
     * Create a new server
     * @param {Client} client The PteroManager Client
     * @param {object} data The data
     * @param {object} metadata The metadata
     */
    constructor(client, data, metadata) {
        this.client = client;

        this.serverOwner = data.server_owner;
        this.identifier = data.identifier;
        this.uuid = data.uuid;
        this.name = data.name;
        this.node = data.node;
        this.sftpDetails = { ip: data.sftp_details.ip, port: data.sftp_details.port };
        this.description = data.description;
        this.limits = {
            memory: data.limits.memory,
            swap: data.limits.swap,
            disk: data.limits.disk,
            io: data.limits.io,
            cpu: data.limits.cpu,
            oom_disabled: data.feature_limits.oom_disabled
        }
        this.featureLimits = {
            databases: data.feature_limits.databases,
            allocations: data.feature_limits.allocations,
            backups: data.feature_limits.backups,
            threads: data.feature_limits.threads
        }
        this.isSuspended = data.is_suspended;
        this.isInstalling = data.is_installing;
        if (metadata) {
            this.userPermissions = metadata.user_permissions;
        }
        this.invocation = data.invocation;
        this.dockerImage = data.docker_image;
        this.eggFeatures = data.egg_features;
        this.status = data.status;
        this.isTransferring = data.is_transferring;

        this.allocations = new ServerAllocationManager(this.client, this, data.relationships.allocations.data);

        this.variables = new ServerVariableManager(this.client, { identifier: this.identifier }, data.relationships.variables.data, data.relationships.variables.meta);

        if (data.relationships.egg) {
            this.egg = {
                uuid: data.relationships.egg.attributes.uuid,
                name: data.relationships.egg.attributes.name,
            }
        }

        this.subusers = new ServerSubuserManager(this.client, { identifier: this.identifier }, data.relationships.subusers.data);

        this.databases = new ServerDatabaseManager(this.client, this, []);

        this.files = new ServerFileManager(this.client, this);
    }

    /**
     * Rename this server
     * @param {object} data The data
     * @param {string} data.name The new name
     * @returns {Promise<Boolean>} Whether the rename was successful
     */
    rename(data) {
        if (!data) throw new Error('No data provided');
        if (typeof data !== 'object') throw new Error('Data must be an object');
        if (!data.name) throw new Error('No name provided');
        if (typeof data.name !== 'string') throw new Error('Name must be a string');

        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.identifier}/settings/rename`, this.client.APIKey, 'POST', { name: data.name }).then(res => {
                resolve(true)
            }).catch(err => {
                reject(err)
            })
        })
    }

    /**
     * Reinstall this server
     * @returns {Promise<Boolean>} Whether the reinstall was successful
     */
    reinstall() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.identifier}/settings/reinstall`, this.client.APIKey, 'POST').then(res => {
                resolve(true)
            }).catch(err => {
                reject(err)
            })
        })
    }
}

module.exports = Server;