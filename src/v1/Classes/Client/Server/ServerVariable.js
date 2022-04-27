class ServerVariable {
    /**
     * Create a new ServerVariable
     * @param {Client} client The PterodactylClient
     * @param {object} server The server
     * @param {string} [server.identifier] The server identifier
     * @param {object} data The data
     */
    constructor(client, server, data) {
        this.client = client;
        this.server = server;
        
        this.name = data.name;
        this.description = data.description;
        this.key = data.env_variable
        this.defaultValue = data.default_value;
        this.serverValue = data.server_value;
        this.editable = data.is_editable;
        
        this.rules = data.rules;

        this.required = this.rules.includes('required');
    }

    /**
     * Update the server variable
     * @param {object} data The data
     * @param {any} [data.value] The variable value
     * @returns {Promise<ServerVariable>} The updated server variable
     */
    update(data) {
        if (!data) throw new Error('No data provided');
        if (typeof data !== 'object') throw new Error('Data must be an object');

        if (!this.editable) throw new Error('Variable is not editable');
        
        if((this.rules.includes('required') && data.value === '') || (this.rules.includes('required') && !data.value)) throw new Error('Variable is required');
        
        return new Promise((resolve, reject) => {
            this.client._request(`${this.client.host}/servers/${this.server.identifier}/startup/variable`, this.client.APIKey, 'PUT', { key: this.key, value: data.value }).then(res => {
                resolve(new ServerVariable(this.client, this.server, res.attributes));
            }).catch(err => {
                reject(this.client._throwError(err));
            });
        });
    }
}

module.exports = ServerVariable;