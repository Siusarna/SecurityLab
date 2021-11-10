'use strict';

const { getRandomNumber } = require('./utils');

const getGenerator = (m, n, c) => {
    // FAKE. ITS JUST LCG
    let seed = BigInt(getRandomNumber(0, 999999999));
    return () => {
        seed = (seed * m + c) % n;
        return BigInt(seed);
    }
}

module.exports = {
    getRandom: getGenerator(BigInt(672257317), BigInt(1382843889), BigInt(922337203) )
}