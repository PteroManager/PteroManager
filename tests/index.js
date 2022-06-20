const { default: axios } = require('axios');
const PteroManager = require('../');
const config = require('./config.json')

const client = new PteroManager.Client(config.panelURL, config.APIKey, { enableCache: true });
// dd56f84a
(async () => {
    client.servers.cache.get().files.compress({
        directory: '/',
        files: [
            'test.txt',
            'test2.txt',
            'test3.txt',
            'test4.txt',
            'test5.txt',
            'test6.txt',
            'test7.txt',
            'test8.txt',
            'test9.txt',
        ]
    })
})();