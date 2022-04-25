const PteroManager = require('../');
const config = require('./config.json')

const client = new PteroManager.Client(config.panelURL, config.APIKey, { addEverythingToCache: true }); // Yes I'm lazy, ok?
// dd56f84a
client.servers.fetch({
    identifier: 'dd56f84a'
}).then(async server => {
    console.log(server.allocations.cache.firstValue().notes)
    let result = await server.allocations.setPrimary({ note: 'This is a test3', id: server.allocations.cache.firstKey()})
    console.log(server.allocations.cache.firstValue().notes)
}).catch(err => {
    console.log(err);
})