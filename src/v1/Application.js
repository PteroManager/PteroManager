class Application {
    constructor(host, APIKey) {
        if (!host) {
            throw new Error('Host is required');
        }
        if (!APIKey) {
            throw new Error('APIKey is required');
        }

        if (typeof host !== 'string') throw new TypeError('Host must be a string');
        if (typeof APIKey !== 'string') throw new TypeError('APIKey must be a string');

        if (!host.startsWith('http://') && !host.startsWith('https://')) {
            host = `http://${host}`;
        }

        if (host.endsWith('/')) {
            host = host.substring(0, host.length - 1);
        }

        host += '/api/application'

        this.host = host;
        this.APIKey = APIKey;
    }
    /**
     * @private
     */
    throwError(error) {
        if (error.response.data) return error.response.data;
        else if (error.response.status) return error.response.status;
        else return error;
    }
}

module.exports = Application;