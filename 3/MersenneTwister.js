'use strict';

class MersenneTwister {
    MT = [];
    index = 0;
    init = false;
    seed;

    constructor(seed) {
        this.seed = seed;
    }

    generateNumbers() {
        for (let i = 0; 624 > i; ++i) {
            let y = (this.MT[i] & 0x80000000) | (this.MT[(i+1) % 624] & 0x7fffffff);
            this.MT[i] = this.MT[(i + 397) % 624] ^ (y >> 1);
            if (y % 2 === 1) {
                this.MT[i] ^= 0x9908b0df;
            }
        }
    }

    initializeGenerator() {
        this.MT[0] = this.seed;
        for (let i = 1; 624 > i; ++i) {
            this.MT[i] = (0x6c078965 * (this.MT[i - 1] ^ (this.MT[i] >> 30)) + i) & 0xffffffff;
        }
    }

    extractNumber() {
        if (this.index === 0) {
            if (!this.init) {
                this.initializeGenerator();
            }
            this.generateNumbers();
        }

        let y = this.MT[this.index];
        y ^= (y >> 11);
        y ^= (y <<  7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >> 18);
        this.index = (this.index + 1) % 624;
        return y / 0x80000000;
    }

    randomMT (ubound, flr) {
        let rnd = this.extractNumber();

        if (ubound !== undefined) {
            rnd *= ubound;
        }

        return flr ? ~~rnd : rnd;
    }
}

module.exports = {
    MersenneTwister
}