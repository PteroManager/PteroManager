const { default: axios } = require('axios');
const PteroManager = require('../');
const config = require('./config.json')

const client = new PteroManager.Client(config.panelURL, config.APIKey, { enableCache: true }); // Yes I'm lazy, ok?
// dd56f84a
client.servers.fetch({ identifier: 'dd56f84a', include: { subusers: true } }).then(async result => {
    console.log(
        (
        await result.subusers.delete({ uuid: '3b417d45-fcea-4bcc-a7bd-e5ed70a354ee', permissions: ['allocation.delete', 'backup.create'] })
        )
    )
    // console.log(result.eggFeatures)
}).catch(err => {
    console.log(err);
})