'use strict';

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}


function modInverse(a, m) {
    // a = (a % m + m) % m
    // if (!a || m < 2) {
    //     return NaN // invalid input
    // }
    // // find the gcd
    // const s = []
    // let b = m
    // while(b) {
    //     [a, b] = [b, a % b]
    //     s.push({a, b})
    // }
    // if (a !== 1) {
    //     return NaN // inverse does not exists
    // }
    // // find the inverse
    // let x = 1
    // let y = 0
    // for(let i = s.length - 2; i >= 0; --i) {
    //     [x, y] = [y,  x - y * Math.floor(s[i].a / s[i].b)]
    // }
    // return BigInt((y % m + m) % m)
    if (m === 1) {
        return 0;
    }
    const m0 = m;
    let x = BigInt(1);
    let y = BigInt(0);

    while (a > 1) {
        const q = BigInt(a / m);
        [a, m] = [m, a % m];
        [x, y] = [y, x - q * y];
    }
    return x < 0 ? BigInt(x + m0) : BigInt(x);
}

module.exports = {
    getRandomNumber,
    modInverse
}