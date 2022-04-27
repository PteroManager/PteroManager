const { default: axios } = require('axios');
const PteroManager = require('../');
const ServerAllocation = require('../src/v1/Classes/Client/Server/ServerAllocation');
const config = require('./config.json')

const client = new PteroManager.Client(config.panelURL, config.APIKey, { enableCache: true }); // Yes I'm lazy, ok?
// dd56f84a
client.servers.fetch({ identifier: 'dd56f84a', include: { egg: true }}).then(async result => {
    console.log(await result.variables.cache.get('BOT_JS_FILE').update({ value: 'yes' }));
}).catch(err => {
    console.log(err);
})