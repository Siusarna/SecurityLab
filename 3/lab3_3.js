'use strict';

const { MersenneTwister: MT } = require('./MersenneTwister');
const { makeABet } = require('./client');
const { ACCOUNT_ID, GAME_MOD } = require('./constants');

const untemper = (y) => {
    let y1 = BigInt(y);
    y1 = y1 ^ (y1 >> MT.l);
    y1 = y1 ^ ((y1 << MT.t) & MT.c);

    for (let i = 0; i < MT.s; i++) {
        y1 ^= y1 << MT.s & MT.b;
    }

    for (let i = 0; i < 3; i++){
        y1 = y1 ^ (y1 >> MT.u);
    }

    return y1;
}

(async () => {
    const realNumbers = [];
    for (let i = 0; i < MT.n; i++) {
        const result = await makeABet(GAME_MOD.BETTER_MT, ACCOUNT_ID, 1, 324435);
        realNumbers[i] = result.realNumber;
        console.log(i)
    }
    const mt19973 = new MT(0);
    const recoversStateByRealNumbers = [];
    realNumbers.forEach((el, index) => {
        recoversStateByRealNumbers[index] = untemper(el);
    })
    mt19973.MT = recoversStateByRealNumbers;

    const predicted = mt19973.extractNumber();
    const response0 = await makeABet(GAME_MOD.BETTER_MT, ACCOUNT_ID, 10, predicted);
})()
