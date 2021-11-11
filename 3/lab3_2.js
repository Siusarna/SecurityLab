'use strict';

const { MersenneTwister } = require('./MersenneTwister');
const { makeABet } = require('./client');
const { ACCOUNT_ID, GAME_MOD, MODULO, DELETION_TIME } = require('./constants');


(async () => {
    // let seed = Math.floor(new Date(DELETION_TIME).getTime() / 1000) - 3600;
    // // const response = await makeABet(GAME_MOD.MT, ACCOUNT_ID, 1, 324435);
    // const realNumber = 2946491796;
    // console.log(`Base seed = ${seed}`);
    // for (let i = 0; i < 60; i++) {
    //     const mt19937 = new MersenneTwister(seed+i);
    //     const prediction = mt19937.extractNumber();
    //     console.log(`i = ${i}; seed = ${seed + i}; prediction = ${prediction}`);
    //     if (Number(prediction) === realNumber) {
    //         console.log('AAAAAAAA')
    //         console.log(seed);
    //         break;
    //     }
    // }
    const mt = new MersenneTwister(1636670831);
    const prediction0 = mt.extractNumber();
    const prediction1 = mt.extractNumber();
    console.log(prediction1)
    const response = await makeABet(GAME_MOD.MT, ACCOUNT_ID, 10, prediction1);
    console.log(response)
})()
