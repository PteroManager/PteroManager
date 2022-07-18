const { default: axios } = require('axios');
const PteroManager = require('../');
const config = require('./config.json')

const client = new PteroManager.Client(config.panelURL, config.APIKey, { enableCache: true });
// dd56f84a
(async () => {
    let server = await client.servers.fetch({ identifier: 'dd56f84a' });

    server.backups.fetchAll().then(async res => {
        let res2 = res.firstValue();

        let link = await res2.getDownloadLink()
        console.log(link)
    }).catch(err => {
        console.log(err);
    })
})();