const PteroManager = require('../');
const config = require('./config.json')

const client = new PteroManager.Client(config.panelURL, config.APIKey, { addEverythingToCache: true }); // Yes I'm lazy, ok?
// dd56f84a
client.servers.fetch({
    identifier: 'dd56f84a'
}).then(async server => {
    console.log(client.servers.cache.firstValue())
}).catch(err => {
    console.log(err);
})