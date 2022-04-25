const Client = require('../../../Client');
const { default: Collection } = require('@pteromanager/collection');
const ServerAllocation = require('./ServerAllocation');
const requests = require('../../../../requests');
const ServerAllocationManager = require('./ServerAllocationManager');

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

        this.allocations = new ServerAllocationManager(this.client, this, data.relationships.allocations.data);
    }
}

module.exports = Server;