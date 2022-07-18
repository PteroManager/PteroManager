const Client = require('../../../Client');
const ServerSchedule = require('./ServerSchedule');

class ServerScheduleTask {
    /**
     * Create a new ServerScheduleTask
     * @param {Client} client The PteroManager client
     * @param {Object} server The server
     * @param {String} server.identifier
     * @param {ServerSchedule} schedule The schedule
     * @param {Object} data The data
     */
    constructor(client, server, schedule, data) {
        this.client = client;
        this.server = server;
        this.schedule = schedule;

        this.id = data.id;
        this.sequenceId = data.sequence_id;
        /**
         * The action to use
         * @type {'command' | 'power' | 'backup'}
         * @readonly
         */
        this.action = data.action;
        this.payload = data.payload;
        this.timeOffset = data.time_offset;

        this.isQueued = data.is_queued;

        this.createdAt = new Date(data.created_at);
        this.createdTimestamp = new Date(data.created_at).getTime();

        this.updatedAt = new Date(data.updated_at);
        this.updatedTimestamp = new Date(data.updated_at).getTime();
    }

    /**
     * Fetch this task
     * @returns {Promise<ServerScheduleTask>} The task
     */
    fetch() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/schedules/${this.schedule.id}/tasks/${this.id}`, this.client.APIKey, 'GET', {}).then(res => {
                if(this.client.options.enableCache) this.client.servers.cache.get(this.server.identifier)?.schedules.cache.get(this.schedule.id)?.tasks.cache.set(this.id, new ServerScheduleTask(this.client, this.server, this.schedule, res.attributes));
                resolve(new ServerScheduleTask(this.client, this.server, this.schedule, res.attributes));
            }).catch(err => {
                reject(this.client._throwError(err));
            })
        })
    }

    /**
     * Update the task
     * @param {Object} data The data
     * @param {'command' | 'power' | 'backup'} data.action Type of action to use
     * @param {String} data.payload Payload to send
     * @param {String} data.timeOffset The offset in seconds
     * @returns {Promise<ServerScheduleTask>} The updated task
     */
    update(data) {
        if (!data) throw new Error('No data provided');
        if (!data.action) throw new Error('No action provided');
        if (typeof data.action !== 'string') throw new Error('Action must be a string');
        if (!data.payload) throw new Error('No payload provided');
        if (typeof data.payload !== 'string') throw new Error('Payload must be a string');
        if (!data.timeOffset) throw new Error('No timeOffset provided');
        if (typeof data.timeOffset !== 'string') throw new Error('TimeOffset must be a string');
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/schedules/${this.schedule.id}/tasks/${this.id}`, this.client.APIKey, 'POST', { action: data.action, payload: data.payload, time_offset: data.timeOffset }).then(res => {
                if (this.client.options.enableCache) this.schedule.tasks.cache.set(res.data.attributes.id, new ServerScheduleTask(this.client, this.server, this.schedule, res.data.attributes));
                resolve(new ServerScheduleTask(this.client, this.server, this.schedule, res.data.attributes));
            }).catch(err => {
                reject(this.client._throwError(err));
            })
        })
    }

    /**
     * Delete the task
     * @returns {Promise<Boolean>} Whether the task was deleted
    */
    delete() {
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/schedules/${this.schedule.id}/tasks/${this.id}`, this.client.APIKey, 'DELETE').then(res => {
                if (this.client.options.enableCache) this.schedule.tasks.cache.delete(this.id);
                resolve(true);
            }).catch(err => {
                reject(this.client._throwError(err));
            })
        })
    }
}

module.exports = ServerScheduleTask;