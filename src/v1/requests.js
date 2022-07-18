const axios = require('axios');
const Client = require('./Client');

/**
 * Make an axios request
 * @param {string} path The path to the endpoint
 * @param {string} APIKey The APIKey of the Client
 * @param {'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'} method The method to use
 * @param {object} body The body of the request
 * @param {Client} client The PteroManager Client
 * @returns {Promise<object>} The response of the request
 */
module.exports = async function (path, APIKey, method, body, client) {
    await checkRateLimit(client)
    return new Promise((resolve, reject) => {
        axios.default(path, {
            headers: {
                'Authorization': `Bearer ${APIKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: method,
            data: body
        }).then(res => {
            client._requestsRemaining = res.headers['x-ratelimit-remaining'];
            resolve(res.data);
        }).catch(err => {
            client._requestsRemaining = err.response.headers['x-ratelimit-remaining'];
            reject(err);
        })
    })
}

async function checkRateLimit(client) {
    if (client._requestsRemaining <= 0) {
        let toReturn = await new Promise((resolve, reject) => {
            let timeToWait = (60 - new Date().getSeconds()) * 1000;
            setTimeout(async () => {
                if (client._requestsRemaining <= 0 /* change this to 0 later */) {
                    return resolve(await checkRateLimit(client));
                }
                resolve(true);
            }, timeToWait)
        })

        return toReturn;
    }
    else return true;
}