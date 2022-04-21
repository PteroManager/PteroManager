const axios = require('axios');

/**
 * Make an axios request
 * @param {string} path The path to the endpoint
 * @param {string} APIKey The APIKey of the Client
 * @param {'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'} method The method to use
 * @param {object} body The body of the request
 * @returns {Promise<object>} The response of the request
 */
module.exports = async function (path, APIKey, method, body) {
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
            resolve(res.data);
        }).catch(err => {
            reject(err);
        })
    })
}