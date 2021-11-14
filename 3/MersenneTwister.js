'use strict';

class MersenneTwister {
    static w = BigInt(32);
    static n = BigInt(624);
    static m = BigInt(397);
    static r = BigInt(31);
    static a = BigInt(0x9908B0DF);
    static u = BigInt(11);
    static d = BigInt(0xFFFFFFFF);
    static s = BigInt(7);
    static b = BigInt(0x9D2C5680);
    static t = BigInt(15);
    static c = BigInt(0xEFC60000);
    static l = BigInt(18);
    static f = BigInt(1812433253);
    static bigOne = BigInt(1);
    static lowerMask = (MersenneTwister.bigOne << MersenneTwister.r) - MersenneTwister.bigOne;
    static upperMask = MersenneTwister.bigOne << MersenneTwister.r;

    MT = [];
    index = 0;

    constructor(seed) {
        this.MT[0] = BigInt(seed);
        this.index = MersenneTwister.n;
        for (let i = 1; i < MersenneTwister.n; i++) {
            this.MT[i] = (MersenneTwister.f * (this.MT[i - 1] ^ (this.MT[i - 1] >> (MersenneTwister.w - BigInt(2)))) + BigInt(i)) & ((MersenneTwister.bigOne << MersenneTwister.w) - MersenneTwister.bigOne);
        }
    }

    twist() {
        for (let i = 0; i < MersenneTwister.n; i++) {
            let x = (this.MT[i] & MersenneTwister.upperMask) + (this.MT[BigInt(i + 1) % MersenneTwister.n] & MersenneTwister.lowerMask);
            let xA = x >> MersenneTwister.bigOne;
            if (x % BigInt(2) !== BigInt(0)) {
                xA = xA ^ MersenneTwister.a;
            }
            this.MT[i] = this.MT[(BigInt(i) + MersenneTwister.m) % MersenneTwister.n] ^ xA;
        }
        this.index = 0;
    }

    extractNumber() {
        if (this.index >= MersenneTwister.n) {
            if (this.index > MersenneTwister.n) {
                throw new Error('Generator was never seeded');
            }
            this.twist();
        }

        let y = this.MT[this.index];
        y = y ^ ((y >> MersenneTwister.u) & MersenneTwister.d);
        y = y ^ ((y << MersenneTwister.s) & MersenneTwister.b);
        y = y ^ ((y << MersenneTwister.t) & MersenneTwister.c);
        y = y ^ (y >> MersenneTwister.l);

        this.index++;
        return y & ((MersenneTwister.bigOne << MersenneTwister.w) - MersenneTwister.bigOne);
    }

    set MT(states) {
        this.MT = states;
    }
}

module.exports = {
    MersenneTwister
}