const PteroManager = require('../');
const config = require('./config.json')
const Collection = require('../src/Collection');
const APIKey = require('../src/v1/Classes/Client/APIKey');

const client = new PteroManager.Client('https://panel.ck-hosting.com', config.APIKey);
new APIKey('test', 'uecd', 'edc')
client.deleteAPIKey({
    identifier: 'nBMHaduclXYb4qvE'
}).then(res => {
    console.log(res)
}).catch(err => {
    console.log(err)
})