class ServerDatabase {
    /**
     * Create a new API Key class
     * @param {Client} client The PteroManager Client
     * @param {Object} data The APIKey Data
     */
    constructor(client, data) {
        if (!client) throw new Error('Client is required');
        if (!data) throw new Error('Data is required');
    }
}

module.exports = ServerDatabase;