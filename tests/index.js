const { default: axios } = require('axios');
const PteroManager = require('../');
const config = require('./config.json')

const client = new PteroManager.Client(config.panelURL, config.APIKey, { enableCache: true });
// dd56f84a
(async () => {
    await client.servers.fetch({ identifier: 'e', include: { subusers: true } }).then(async result => {
    }).catch(err => {
        console.log(err);
    })

    client.servers.fetch({ identifier: 'e', include: { subusers: true } }).catch(err => {
        console.log(err);
    })
})();