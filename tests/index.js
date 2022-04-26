const PteroManager = require('../');
const ServerAllocation = require('../src/v1/Classes/Client/Server/ServerAllocation');
const config = require('./config.json')

const client = new PteroManager.Client(config.panelURL, config.APIKey, { addEverythingToCache: true }); // Yes I'm lazy, ok?
// dd56f84a
client.servers.fetchAll().then(async result => {
    console.log(client.servers.cache.get('dd56f84a').allocations.cache.firstValue().notes);
    await client.servers.cache.get('dd56f84a').allocations.cache.firstValue().setNote({ note: 'This is a test not322232qe' });
    console.log(client.servers.cache.get('dd56f84a').allocations.cache.firstValue().notes);
}).catch(err => {
    console.log(err);
})