const ClientAPIKeyManager = require('./ClientAPIKeyManager')

class ClientUserManager {
    /**
     * ClientUserManager Constructor
     * @param {Client} client The client
     */
    constructor(client) {
        this.client = client;

        this.email = null;
        this.username = null;
        this.admin = null;
        this.id = null;
        this.firstName = null;
        this.lastName = null;
        this.language = null;

        this.APIKeys = new ClientAPIKeyManager(this)

    }

    
}

module.exports = ClientUserManager;