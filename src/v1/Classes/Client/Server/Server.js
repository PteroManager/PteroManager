const Client = require('../../../Client');
const { default: Collection } = require('@pteromanager/collection');
const ServerAllocation = require('./ServerAllocation');
const requests = require('../../../../requests');

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
        this.userPermissions = metadata.user_permissions;
        this.invocation = data.invocation;
        this.dockerImage = data.docker_image;
        this.eggFeatures = data.egg_features;
        this.status = data.status;
        this.isTransferring = data.is_transferring;

        this.allocations = new Collection();
        data.relationships.allocations.data.forEach(allocation => {
            this.allocations.set(allocation.attributes.id, new ServerAllocation(this.client, this, allocation.attributes))
        })
    }

    /**
     * Delete a server allocation
     * @param {object} data The data
     * @returns {Promise<Boolean>} Whether the allocation was deleted
     */
    deleteAllocation(data) {
        return new Promise((resolve, reject) => {
            requests(`${this.client.host}/servers/${this.identifier}/network/allocations/${data.id}`, this.client.APIKey, 'DELETE', {}).then(res => {
                resolve(res)
            }).catch(err => {
                reject(this.client.throwError(err))
            })
        })
    }

    /**
     * Set the note for a server allocation
     * @param {object} data The data
     * @returns {Promise<ServerAllocation>} The updated allocation
     */
    setAllocationNote(data) {
        if (!data) throw new Error('Data is required');
        if (typeof data !== 'object') throw new TypeError('Data must be an object');
        if (!data.id) throw new Error('ID is required');
        if (typeof data.id !== 'string') throw new TypeError('ID must be a string');
        if (!data.note) throw new Error('Note is required');
        if (typeof data.note !== 'string') throw new TypeError('Note must be a string');

        return new Promise((resolve, rejext) => {
            requests(`${this.client.host}/servers/${this.identifier}/network/allocations/${data.id}`, this.client.APIKey, 'PATCH', { note: data.note }).then(res => {
                let allocation = new ServerAllocation(this.client, this, res.data)
                if(this.client.options.addAPIKeysToCache) this.client.cache.set(allocation.id, allocation)
                resolve(allocation)
            }).catch(err => {
                reject(this.client.throwError(err))
            })
        })
    }
}

module.exports = Server;