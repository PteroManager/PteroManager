const toJSON = require("../../toJSON");
const Client = require('../Client');

/**
 * @typedef {Object} APIKey
 */
class APIKey {
    /**
     * Create a new API Key class
     * @param {Client} client The PteroManager Client
     * @param {Object} data The APIKey Data
     */
    constructor(client, data, metadata) {
        this.client = client;
        this.identifier = data.identifier;
        this.description = data.description;
        this.createdAt = data.created_at;
        this.lastUsedAt = data.last_used_at;
        this.allowedIPs = data.allowed_ips;

        if (metadata) {
            this.secret_token = metadata.secret_token || null;
        }
    }
    delete() {
        this.client
    }
    toJSON() {
        return { identifier: this.identifier, description: this.description, createdAt: this.createdAt, lastUsedAt: this.lastUsedAt, allowedIPs: this.allowedIPs };
    }
}

module.exports = APIKey;