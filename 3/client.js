'use strict';

const axios = require('axios');
const { ACCOUNT_ID } = require('./constants');
//1390581177

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
        console.log(e.response.data.errors)
    });
}

module.exports = {
    makeABet,
}