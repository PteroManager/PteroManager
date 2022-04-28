const Client = require('../../../Client')

class ServerSubuser {
    /**
     * Create a new ServerSubuser
     * @param {Client} client The PteroManager Client
     * @param {object} server The server
     * @param {string} server.identifier The server identifier
     * @param {object} data The data
     */
    constructor(client, server, data) {
        this.client = client;
        this.server = server;

        this.uuid = data.uuid;
        this.username = data.username;
        this.email = data.email;
        this.avatar = data.image;
        this.twoFactorAuthEnabled = data['2fa_enabled']
        this.createdAt = new Date(data.created_at)
        this.createdTimestamp = new Date(data.created_at).getTime();
        /**
         * The user permissions
         * @type {Array<string>}
         */
        this.permissions = data.permissions;
    }

    /**
     * Update the subuser
     * @param {object} data The data
     * @param {Array<'control.console'|'control.start'|'control.stop'|'control.restart'|'user.create'|'user.read'|'user.update'|'user.delete'|'file.create'|'file.read'|'file.read'|'file.update'|'file.delete'|'file.archive'|'file.sftp'|'backup.create'|'backup.read'|'backup.update'|'backup.delete'|'backup.download'|'allocation.read'|'allocation.create'|'allocation.update'|'allocation.delete'|'startup.read'|'startup.update'|'database.create'|'database.read'|'database.update'|'database.delete'|'database.view_password'|'schedule.create'|'schedule.read'|'schedule.update'|'schedule.delete'|'settings.rename'|'settings.reinstall'>} data.permissions The permissions
     * @returns {Promise<ServerSubuser>}
     */
    update(data) {
        if (!data) throw new Error('No data provided');
        if(typeof data !== 'object') throw new Error('Data must be an object');
        if (!data.permissions) throw new Error('No permissions provided');
        if (!Array.isArray(data.permissions)) throw new Error('Permissions must be an array');

        let validPerms = ['control.console', 'control.start', 'control.stop', 'control.restart', 'user.create', 'user.read', 'user.update', 'user.delete', 'file.create', 'file.read', 'file.read', 'file.update', 'file.delete', 'file.archive', 'file.sftp', 'backup.create', 'backup.read', 'backup.update', 'backup.delete', 'backup.download', 'allocation.read', 'allocation.create', 'allocation.update', 'allocation.delete', 'startup.read', 'startup.update', 'database.create', 'database.read', 'database.update', 'database.delete', 'database.view_password', 'schedule.create', 'schedule.read', 'schedule.update', 'schedule.delete', 'settings.rename', 'settings.reinstall'];
        if (!data.permissions.some(perm => validPerms.includes(perm))) throw new Error('Invalid permission(s)');

        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/users/${this.uuid}`, this.client.APIKey, 'POST', { permissions: data.permissions }).then(res => {
                let subuser = new ServerSubuser(this.client, this.server, res.attributes);

                if(this.client.options.enableCache) this.client.servers.cache.get(this.server.identifier)?.subusers.cache.set(subuser.uuid, subuser);

                resolve(subuser);
            }).catch(err => {
                reject(err);
            });
        })
    }

    /**
     * Delete the subuser
     * @returns {Promise<Boolean>} Returns true if the subuser was deleted
     */
    delete() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/users/${this.uuid}`, this.client.APIKey, 'DELETE').then(res => {
                if(this.client.options.enableCache) this.client.servers.cache.get(this.server.identifier)?.subusers.cache.delete(this.uuid);

                resolve(true);
            }).catch(err => {
                reject(err);
            });
        })
    }
}

module.exports = ServerSubuser;