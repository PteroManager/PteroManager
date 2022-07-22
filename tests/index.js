const { default: axios } = require('axios');
const PteroManager = require('../');
const config = require('./config.json')

const client = new PteroManager.Client(config.panelURL, config.APIKey, { enableCache: true });
// dd56f84a
(async () => {
    client
})();