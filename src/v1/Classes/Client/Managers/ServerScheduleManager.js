const Client = require('../../../Client');
const { default: Collection } = require('@pteromanager/collection');
const ServerSchedule = require('../Server/ServerSchedule');

class ServerScheduleManager {
    /**
     * Create a new ServerScheduleManager
     * @param {Client} client
     * @param {object} server
     * @param {string} server.identifier
     * @param {Array} data
     */
    constructor(client, server, data) {
        this.client = client;
        this.server = server;

        /**
         * The cache
         * @type {Collection<string, ServerSchedule>}
         */
        this.cache = new Collection();

        data.forEach(database => {
            this.cache.set(database.attributes.id, new ServerSchedule(this.client, this.server, database));
        });
    }

    /**
     * Fetch all schedules
     * @returns {Promise<Collection<number, ServerSchedule>>}
     */
    fetchAll() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/schedules`, this.client.APIKey, 'GET', {}).then(res => {
                let schedules = new Collection();
                res.data.forEach(schedule => {
                    if (this.client.options.enableCache) this.cache.set(schedule.attributes.id, new ServerSchedule(this.client, this.server, schedule.attributes));
                    schedules.set(schedule.attributes.id, new ServerSchedule(this.client, this.server, schedule.attributes));
                });
                resolve(schedules);
            }).catch(err => {
                reject(this.client._throwError(err));
            });
        })
    }

    /**
     * Create a new schedule
     * @param {object} data The data
     * @param {string} data.name The name
     * @param {Boolean} [data.isActive] Whether the schedule is active
     * @param {object} data.cron The cron expression
     * @param {string} data.cron.minute The minute
     * @param {string} data.cron.hour The hour
     * @param {string} data.cron.dayOfWeek The day of week
     * @param {string} data.cron.dayOfMonth The day of month
     * @returns {Promise<ServerSchedule>}
     */
    create(data) {
        if (!data) throw new Error('No data provided');
        if (typeof data !== 'object') throw new Error('Data must be an object');
        if (!data.name) throw new Error('No name provided');
        if (typeof data.name !== 'string') throw new Error('Name must be a string');
        if (!data.cron) throw new Error('No cron provided');
        if (typeof data.cron !== 'object') throw new Error('Cron must be an object');
        if (!data.cron.minute) throw new Error('No cron minute provided');
        if (typeof data.cron.minute !== 'string') throw new Error('Cron minute must be a string');
        if (!data.cron.hour) throw new Error('No cron hour provided');
        if (typeof data.cron.hour !== 'string') throw new Error('Cron hour must be a string');
        if (!data.cron.dayOfWeek) throw new Error('No cron day of week provided');
        if (typeof data.cron.dayOfWeek !== 'string') throw new Error('Cron day of week must be a string');
        if (!data.cron.dayOfMonth) throw new Error('No cron day of month provided');
        if (typeof data.cron.dayOfMonth !== 'string') throw new Error('Cron day of month must be a string');

        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/schedules`, this.client.APIKey, 'POST', { name: data.name, is_active: data.isActive, minute: data.cron.minute, hour: data.cron.hour, day_of_week: data.cron.dayOfWeek, day_of_month: data.cron.dayOfMonth }).then(res => {
                if (this.client.options.enableCache) this.cache.set(res.data.attributes.id, new ServerSchedule(this.client, this.server, res.data.attributes));
                resolve(new ServerSchedule(this.client, this.server, res.data.attributes));
            }).catch(err => {
                reject(this.client._throwError(err));
            });
        })
    }

    /**
     * Fetch a schedule
     * @param {object} data The data
     * @param {string} data.id The id of the schedule
     * @returns {Promise<ServerSchedule>}
     */
    fetch(data) {
        if (!data) throw new Error('No data provided');
        if (typeof data !== 'object') throw new Error('Data must be an object');
        if (!data.id) throw new Error('No id provided');
        if (typeof data.id !== 'string') throw new Error('Id must be a string');

        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/schedules/${data.id}`, this.client.APIKey, 'GET', {}).then(res => {
                if (this.client.options.enableCache) this.cache.set(res.attributes.id, new ServerSchedule(this.client, this.server, res.attributes));
                resolve(new ServerSchedule(this.client, this.server, res.attributes));
            }).catch(err => {
                reject(this.client._throwError(err));
            });
        })
    }

    /**
     * Update a schedule
     * @param {object} data The data
     * @param {string} data.id The id of the schedule
     * @param {string} data.name The name
     * @param {Boolean} [data.isActive] Whether the schedule is active
     * @param {object} data.cron The cron expression
     * @param {string} data.cron.minute The minute
     * @param {string} data.cron.hour The hour
     * @param {string} data.cron.dayOfWeek The day of week
     * @param {string} data.cron.dayOfMonth The day of month
     * @returns {Promise<Boolean>} Returns true if successful
     */
    update(data) {
        if (!data) throw new Error('No data provided');
        if (typeof data !== 'object') throw new Error('Data must be an object');
        if (!data.id) throw new Error('No id provided');
        if (typeof data.id !== 'string') throw new Error('Id must be a string');
        if (!data.name) throw new Error('No name provided');
        if (typeof data.name !== 'string') throw new Error('Name must be a string');
        if (!data.cron) throw new Error('No cron provided');
        if (typeof data.cron !== 'object') throw new Error('Cron must be an object');
        if (!data.cron.minute) throw new Error('No cron minute provided');
        if (typeof data.cron.minute !== 'string') throw new Error('Cron minute must be a string');
        if (!data.cron.hour) throw new Error('No cron hour provided');
        if (typeof data.cron.hour !== 'string') throw new Error('Cron hour must be a string');
        if (!data.cron.dayOfWeek) throw new Error('No cron day of week provided');
        if (typeof data.cron.dayOfWeek !== 'string') throw new Error('Cron day of week must be a string');
        if (!data.cron.dayOfMonth) throw new Error('No cron day of month provided');
        if (typeof data.cron.dayOfMonth !== 'string') throw new Error('Cron day of month must be a string');

        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/schedules/${data.id}`, this.client.APIKey, 'PUT', { name: data.name, is_active: data.isActive, minute: data.cron.minute, hour: data.cron.hour, day_of_week: data.cron.dayOfWeek, day_of_month: data.cron.dayOfMonth }).then(res => {
                if (this.client.options.enableCache) this.cache.set(res.attributes.id, new ServerSchedule(this.client, this.server, res.attributes));
                resolve(new ServerSchedule(this.client, this.server, res.attributes));
            }).catch(err => {
                reject(this.client._throwError(err));
            });
        });
    }

    /**
     * Delete a schedule
     * @param {object} data The data
     * @param {string} data.id The id of the schedule
     * @returns {Promise<Boolean>} Whether the schedule was deleted
     */
    delete(data) {
        if (!data) throw new Error('No data provided');
        if (typeof data !== 'object') throw new Error('Data must be an object');
        if (!data.id) throw new Error('No id provided');
        if (typeof data.id !== 'string') throw new Error('Id must be a string');

        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/schedules/${data.id}`, this.client.APIKey, 'DELETE', {}).then(res => {
                if (this.client.options.enableCache) this.cache.delete(data.id);
                resolve(true);
            }).catch(err => {
                reject(this.client._throwError(err));
            });
        });
    }
}

module.exports = ServerScheduleManager;