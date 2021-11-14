'use strict';

const axios = require('axios');
const { ACCOUNT_ID } = require('./constants');

const BASE_URL = 'http://95.217.177.249/casino';

const makeABet = (mode, id = ACCOUNT_ID, bet, number) => {
    return axios.get(`${BASE_URL}/play${mode}`, {
        params: {
            id,
            bet,
            number
        }
    }).then(response => {
        return response.data;
    }).catch(e => {
        if (e.response) {
            console.log(e.response.data);
        }else if (e.request) {
            console.log(e.request);
        } else {
            console.log(e)
        }

    });
}

module.exports = {
    makeABet,
}