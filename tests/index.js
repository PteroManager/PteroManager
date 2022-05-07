const { default: axios } = require('axios');
const PteroManager = require('../');
const config = require('./config.json')

const client = new PteroManager.Client(config.panelURL, config.APIKey, { enableCache: true }); // Yes I'm lazy, ok?
// dd56f84a
client.servers.fetch({ identifier: 'dd56f84a', include: { subusers: true } }).then(async result => {
    result.databases.fetchAll().then(async databases => {
        let database = databases.firstValue()
        console.log(database)
    })
}).catch(err => {
    console.log(err);
})