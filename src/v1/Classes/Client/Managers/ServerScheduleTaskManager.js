const Client = require('../../../Client');
const { default: Collection } = require('@pteromanager/collection');
const ServerScheduleTask = require('../Server/ServerScheduleTask');
const ServerSchedule = require('../Server/ServerSchedule');

class ServerScheduleTaskManager {
    /**
     * Create a new ServerScheduleTaskManager
     * @param {Client} client The PteroManager client
     * @param {Object} server The server
     * @param {String} server.identifier
     * @param {ServerSchedule} schedule The schedule
     * @param {Array} data An array of the fetched tasks
     */
    constructor(client, server, schedule, data) {
        this.client = client;
        this.server = server;
        this.schedule = schedule;

        /**
         * The cache
         * @type {Collection<number, ServerScheduleTask>}
         */
        this.cache = new Collection();

        data.forEach(task => {
            this.cache.set(task.attributes.id, new ServerScheduleTask(this.client, this.server, this.schedule, task.attributes))
        })
    }

    /**
     * Create a task
     * @param {Object} data The data
     * @param {'command' | 'power' | 'backup'} data.action Type of action to use
     * @param {String} data.payload Payload to send
     * @param {String} data.timeOffset The offset in seconds
     * @returns {Promise<ServerScheduleTask>} The newly created task
     */
    create(data) {
        if (!data) throw new Error('No data provided');
        if (!data.action) throw new Error('No action provided');
        if (typeof data.action !== 'string') throw new Error('Action must be a string');
        if (!data.payload) throw new Error('No payload provided');
        if (typeof data.payload !== 'string') throw new Error('Payload must be a string');
        if (!data.timeOffset) throw new Error('No timeOffset provided');
        if (typeof data.timeOffset !== 'number') throw new Error('TimeOffset must be a string');
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/schedules/${this.schedule.id}/tasks`, this.client.APIKey, 'POST', { action: data.action, payload: data.payload, time_offset: data.timeOffset }).then(res => {
                if (this.client.options.enableCache) this.cache.set(res.data.attributes.id, new ServerScheduleTask(this.client, this.server, this, res.data.attributes));
                resolve(new ServerScheduleTask(this.client, this.server, this.schedule, res.data.attributes));
            }).catch(err => {
                reject(this.client._throwError(err));
            })
        })
    }

    /**
     * Update a task
     * @param {Object} data The data
     * @param {String} data.id The id of the task
     * @param {'command' | 'power' | 'backup'} data.action Type of action to use
     * @param {String} data.payload Payload to send
     * @param {String} data.timeOffset The offset in seconds
     * @returns {Promise<ServerScheduleTask>} The updated task
     */
    update(data) {
        if (!data) throw new Error('No data provided');
        if (!data.id) throw new Error('No id provided');
        if (typeof data.id !== 'string') throw new Error('Id must be a string');
        if (!data.action) throw new Error('No action provided');
        if (typeof data.action !== 'string') throw new Error('Action must be a string');
        if (!data.payload) throw new Error('No payload provided');
        if (typeof data.payload !== 'string') throw new Error('Payload must be a string');
        if (!data.timeOffset) throw new Error('No timeOffset provided');
        if (typeof data.timeOffset !== 'number') throw new Error('TimeOffset must be a string');
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/schedules/${this.schedule.id}/tasks/${data.id}`, this.client.APIKey, 'POST', { action: data.action, payload: data.payload, time_offset: data.timeOffset }).then(res => {
                if (this.client.options.enableCache) this.cache.set(res.data.attributes.id, new ServerScheduleTask(this.client, this.server, this.schedule, res.data.attributes));
                resolve(new ServerScheduleTask(this.client, this.server, this.schedule, res.data.attributes));
            }) .catch(err => {
                reject(this.client._throwError(err));
            })
        })
    }

    /**
     * Delete a task
     * @param {Object} data The data
     * @param {String} data.id The id of the task
     * @returns {Promise<Boolean>} Whether the task was deleted
     */
    delete(data) {
        if (!data) throw new Error('No data provided');
        if (!data.id) throw new Error('No id provided');
        if (typeof data.id !== 'string') throw new Error('Id must be a string');
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/schedules/${this.schedule.id}/tasks/${data.id}`, this.client.APIKey, 'DELETE').then(res => {
                if (this.client.options.enableCache) this.cache.delete(data.id);
                resolve(true);
            }).catch(err => {
                reject(this.client._throwError(err));
            })
        })
    }
}

module.exports = ServerScheduleTaskManager