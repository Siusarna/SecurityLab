'use strict';

const { getRandom } = require('./lcg');
const { modInverse } = require('./utils');
const { makeABet } = require('./client');
const { ACCOUNT_ID, GAME_MOD, MODULO } = require('./constants');

const predictRandomNumber = (previous, m, n, c) => {
    return (previous * m + c) % n;
}

const hackIncrement = (arrayOfPrevious, m, n) => {
    return (arrayOfPrevious[1] - arrayOfPrevious[0] * m) % n
}

const hackMultiplier = (arrayOfPrevious, n) => {
    return (arrayOfPrevious[2] - arrayOfPrevious[1]) * modInverse(arrayOfPrevious[1] - arrayOfPrevious[0], n) % n;
}

(async () => {
    const response0 = await makeABet(GAME_MOD.LCG, ACCOUNT_ID, 1, 345345);
    const s0 = BigInt(response0.realNumber);
    const response1 = await makeABet(GAME_MOD.LCG, ACCOUNT_ID, 1, 345345);
    const s1 = BigInt(response1.realNumber);
    const response2 = await makeABet(GAME_MOD.LCG, ACCOUNT_ID, 1, 345345);
    const s2 = BigInt(response2.realNumber);
    const response3 = await makeABet(GAME_MOD.LCG, ACCOUNT_ID, 1, 345345);
    const s3 = BigInt(response3.realNumber);

    const m = hackMultiplier([s0, s1, s2, s3], MODULO);
    const c = hackIncrement([s0, s1], m, MODULO);

    console.log(m)
    console.log(c)
    const predicted = Number(predictRandomNumber(s3, m, MODULO, c));
    const response = await makeABet(GAME_MOD.LCG, ACCOUNT_ID, 500, predicted);
    console.log(response)
})()

// const s0 = getRandom();
// const s1 = getRandom();
// const s2 = getRandom();
// const s3 = getRandom();
// const n = hackModulo()
// const m = hackMultiplier([s0, s1, s2, s3], n);
// console.log(m);
// const c = hackIncrement([s0, s1], m, n);
// console.log(c);
// const predictedS4 = predictRandomNumber(s3, m, n, c);
// const s4 = getRandom();
//
//
// console.log(predictedS4 === s4);