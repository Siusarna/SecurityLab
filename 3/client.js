const axios = require('axios');

const ACCOUNT = {
    id: "2110",
    money: 1000,
    deletionTime: "2021-11-09T21:47:23.1941133Z"
}

//1390581177

const BASE_URL = 'http://95.217.177.249/casino';

const makeABet = (mode, id = ACCOUNT.id, bet, number) => {
    return axios.get(`${BASE_URL}/play${mode}`, {
        params: {
            id,
            bet,
            number
        }
    });
}

module.exports = {
    makeABet,
}