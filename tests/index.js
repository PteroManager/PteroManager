const PteroManager = require('../');
const config = require('./config.json')

const client = new PteroManager.Client(config.panelURL, config.APIKey, { addServersToCache: true, addAPIKeysToCache: true });
// dd56f84a
client.servers.fetch({
    identifier: 'dd56f84a'
}).then(async server => {
    let result = await server.allocations.firstValue().setNote({ note: 'Primary' })
    console.log(result)
}).catch(err => {
    console.log(err);
})