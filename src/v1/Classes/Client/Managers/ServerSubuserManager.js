const Client = require('../../../Client');
const { default: Collection } = require('@pteromanager/collection');
const ServerSubuser = require('../Server/ServerSubuser');

class ServerSubuserManager {
    /**
     * Create a new ServerSubuserManager
     * @param {Client} client The PteroManager Client
     * @param {object} server The server
     * @param {string} server.identifier The server identifier
     * @param {object} data The data
     */
    constructor(client, server, data) {
        this.client = client;
        this.server = server;

        /**
         * The cache
         * @type {Collection<string, ServerSubuser>}
         */
        this.cache = new Collection();

        data.forEach(subuser => {
            this.cache.set(subuser.attributes.uuid, new ServerSubuser(this.client, this.server, subuser));
        });
    }

    /**
     * Fetch the subusers
     * @returns {Promise<Collection<string, ServerSubuser>>}
     */
    fetchAll() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/users`, this.client.APIKey, 'GET', {}).then(res => {
                let subusers = new Collection();
                res.data.forEach(subuser => {
                    if (this.client.options.enableCache) this.cache.set(subuser.attributes.uuid, new ServerSubuser(this.client, this.server, subuser.attributes));
                    subusers.set(subuser.attributes.uuid, new ServerSubuser(this.client, this.server, subuser.attributes));
                });
                resolve(subusers);
            }).catch(err => {
                reject(this.client._throwError(err));
            });
        })
    }

    /**
     * Create a new subuser
     * @param {object} data The data
     * @param {string} data.email The email of the subuser
     * @param {Array<'control.console'|'control.start'|'control.stop'|'control.restart'|'user.create'|'user.read'|'user.update'|'user.delete'|'file.create'|'file.read'|'file.read'|'file.update'|'file.delete'|'file.archive'|'file.sftp'|'backup.create'|'backup.read'|'backup.update'|'backup.delete'|'backup.download'|'allocation.read'|'allocation.create'|'allocation.update'|'allocation.delete'|'startup.read'|'startup.update'|'database.create'|'database.read'|'database.update'|'database.delete'|'database.view_password'|'schedule.create'|'schedule.read'|'schedule.update'|'schedule.delete'|'settings.rename'|'settings.reinstall'>} data.permissions The permissions
     * @returns {Promise<ServerSubuser>} The subuser
     */
    create(data) {
        if (!data) throw new Error('Data is required');
        if (typeof data !== 'object') throw new TypeError('Data must be an object');
        if (!data.email) throw new Error('Email is required');
        if (typeof data.email !== 'string') throw new TypeError('Email must be a string');
        if (!data.permissions) throw new Error('Permissions is required');
        if (!Array.isArray(data.permissions)) throw new TypeError('Permissions must be an array');

        let validPerms = ['control.console', 'control.start', 'control.stop', 'control.restart', 'user.create', 'user.read', 'user.update', 'user.delete', 'file.create', 'file.read', 'file.read', 'file.update', 'file.delete', 'file.archive', 'file.sftp', 'backup.create', 'backup.read', 'backup.update', 'backup.delete', 'backup.download', 'allocation.read', 'allocation.create', 'allocation.update', 'allocation.delete', 'startup.read', 'startup.update', 'database.create', 'database.read', 'database.update', 'database.delete', 'database.view_password', 'schedule.create', 'schedule.read', 'schedule.update', 'schedule.delete', 'settings.rename', 'settings.reinstall'];
        if(!data.permissions.some(perm => validPerms.includes(perm))) throw new Error('Invalid permission(s)');

        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/users`, this.client.APIKey, 'POST', data).then(res => {
                let subuser = new ServerSubuser(this.client, this.server, res.attributes);
                if (this.client.options.enableCache) this.cache.set(subuser.uuid, subuser);
                resolve(subuser);
            }).catch(err => {
                reject(this.client._throwError(err));
            });
        })
    }

    /**
     * Get a subuser
     * @param {object} data The data
     * @param {string} data.uuid The uuid of the subuser
     * @returns {Promise<ServerSubuser>} The subuser
     */
    fetch(data) {
        if (!data) throw new Error('Data is required');
        if (typeof data !== 'object') throw new TypeError('Data must be an object');
        if (!data.uuid) throw new Error('UUID is required');
        if (typeof data.uuid !== 'string') throw new TypeError('UUID must be a string');

        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/users/${data.uuid}`, this.client.APIKey, 'GET', {}).then(res => {
                let subuser = new ServerSubuser(this.client, this.server, res.attributes);
                if (this.client.options.enableCache) this.cache.set(subuser.uuid, subuser);
                resolve(subuser);
            }).catch(err => {
                reject(this.client._throwError(err));
            });
        });
    }

    /**
     * Update a subuser
     * @param {object} data The data
     * @param {string} data.uuid The uuid of the subuser
     * @param {Array<'control.console'|'control.start'|'control.stop'|'control.restart'|'user.create'|'user.read'|'user.update'|'user.delete'|'file.create'|'file.read'|'file.read'|'file.update'|'file.delete'|'file.archive'|'file.sftp'|'backup.create'|'backup.read'|'backup.update'|'backup.delete'|'backup.download'|'allocation.read'|'allocation.create'|'allocation.update'|'allocation.delete'|'startup.read'|'startup.update'|'database.create'|'database.read'|'database.update'|'database.delete'|'database.view_password'|'schedule.create'|'schedule.read'|'schedule.update'|'schedule.delete'|'settings.rename'|'settings.reinstall'>} data.permissions The permissions
     * @returns {Promise<ServerSubuser>} The subuser
     */
    update(data) {
        if (!data) throw new Error('Data is required');
        if (typeof data !== 'object') throw new TypeError('Data must be an object');
        if (!data.uuid) throw new Error('UUID is required');
        if (typeof data.uuid !== 'string') throw new TypeError('UUID must be a string');
        if (!data.permissions) throw new Error('Permissions is required');
        if (!Array.isArray(data.permissions)) throw new TypeError('Permissions must be an array');

        let validPerms = ['control.console', 'control.start', 'control.stop', 'control.restart', 'user.create', 'user.read', 'user.update', 'user.delete', 'file.create', 'file.read', 'file.read', 'file.update', 'file.delete', 'file.archive', 'file.sftp', 'backup.create', 'backup.read', 'backup.update', 'backup.delete', 'backup.download', 'allocation.read', 'allocation.create', 'allocation.update', 'allocation.delete', 'startup.read', 'startup.update', 'database.create', 'database.read', 'database.update', 'database.delete', 'database.view_password', 'schedule.create', 'schedule.read', 'schedule.update', 'schedule.delete', 'settings.rename', 'settings.reinstall'];
        if (!data.permissions.some(perm => validPerms.includes(perm))) throw new Error('Invalid permission(s)');

        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/users/${data.uuid}`, this.client.APIKey, 'POST', data).then(res => {
                let subuser = new ServerSubuser(this.client, this.server, res.attributes);
                if (this.client.options.enableCache) this.cache.set(subuser.uuid, subuser);
                resolve(subuser);
            }).catch(err => {
                reject(this.client._throwError(err));
            });
        });
    }

    /**
     * Delete a subuser
     * @param {object} data The data
     * @param {string} data.uuid The uuid of the subuser
     * @returns {Promise<Boolean>} If the subuser was deleted
     */
    delete(data) {
        if (!data) throw new Error('Data is required');
        if (typeof data !== 'object') throw new TypeError('Data must be an object');
        if (!data.uuid) throw new Error('UUID is required');
        if (typeof data.uuid !== 'string') throw new TypeError('UUID must be a string');

        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/users/${data.uuid}`, this.client.APIKey, 'DELETE', {}).then(res => {
                if (this.client.options.enableCache) this.cache.delete(data.uuid);
                resolve(true);
            }).catch(err => {
                reject(this.client._throwError(err));
            });
        });
    }
}

module.exports = ServerSubuserManager;