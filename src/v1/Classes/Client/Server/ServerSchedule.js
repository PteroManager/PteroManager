const Client = require('../../../Client');
const ServerScheduleTaskManager = require('../Managers/ServerScheduleTaskManager');

class ServerSchedule {
    /**
     * Create a new ServerSchedule
     * @param {Client} client
     * @param {object} server
     * @param {string} server.identifier
     * @param {object} data
    */
    constructor(client, server, data) {
        this.client = client;
        this.server = server;

        this.id = data.id;
        this.name = data.name;
        this.isActive = data.isActive;
        this.cron = {
            minute: data.cron.minute,
            hour: data.cron.hour,
            dayOfWeek: data.cron.day_of_week,
            dayOfMonth: data.cron.day_of_month
        }
        this.isProcessing = data.is_processing;
        if (data.last_run_at) {
            this.lastRunAt = new Date(data.last_run_at);
            this.lastRunTimestamp = new Date(data.last_run_at).getTime();
        } else {
            this.lastRunAt = null;
            this.lastRunTimestamp = null;
        }
        this.nextRunAt = new Date(data.next_run_at);
        this.nextRunTimestamp = new Date(data.next_run_at).getTime();
        this.createdAt = new Date(data.created_at);
        this.createdTimestamp = new Date(data.created_at).getTime();
        this.updatedAt = new Date(data.updated_at);

        this.tasks = new ServerScheduleTaskManager(client, server, this, data.relationships?.tasks?.data || []);
    }

    /**
     * Fetch this schedule
     * @returns {Promise<ServerSchedule>} The fetched schedule
     */
    fetch() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/schedules/${this.id}`, this.client.APIKey, 'GET', {}).then(res => {
                let newSchedule = new ServerSchedule(this.client, this.server, res.attributes)
                if(this.client.options.enableCache) this.client.servers.cache.get(this.server.identifier)?.schedules.cache.set(this.id, newSchedule)
                resolve(newSchedule);
            }).catch(err => {
                reject(this.client._throwError(err));
            })
        })
    }

    /**
     * Update this schedule
     * @param {Object} data The data
     * @param {String} data.name The schedule's name
     * @param {Boolean} [data.isActive] Whether the schedule is active
     * @param {object} data.cron The cron expression
     * @param {string} data.cron.minute The minute
     * @param {string} data.cron.hour The hour
     * @param {string} data.cron.dayOfWeek The day of week
     * @param {string} data.cron.dayOfMonth The day of month
     * @returns {Promise<Boolean>} Whether the action was succesful
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
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/schedules/${this.id}`, this.client.APIKey, 'PUT', { name: data.name, is_active: data.isActive, minute: data.cron.minute, hour: data.cron.hour, day_of_week: data.cron.dayOfWeek, day_of_month: data.cron.dayOfMonth }).then(res => {
                if (this.client.options.enableCache) this.cache.set(res.attributes.id, new ServerSchedule(this.client, this.server, res.attributes));
                resolve(true);
            }).catch(err => {
                reject(this.client._throwError(err));
            });
        });
    }

    /**
     * Delete a schedule
     * @returns {Promise<Boolean>} Whether the schedule was deleted successful
     */
    delete() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/schedules/${this.id}`, this.client.APIKey, 'DELETE', {}).then(res => {
                resolve(true)
            }).catch(err => {
                reject(this.client._throwError(err));
            })
        })
    }
}

module.exports = ServerSchedule;