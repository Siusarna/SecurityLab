'use strict';

class MersenneTwister {
    w = BigInt(32);
    n = BigInt(624);
    m = BigInt(397);
    r = BigInt(31);
    a = BigInt(0x9908B0DF);
    u = BigInt(11);
    d = BigInt(0xFFFFFFFF);
    s = BigInt(7);
    b = BigInt(0x9D2C5680);
    t = BigInt(15);
    c = BigInt(0xEFC60000);
    l = BigInt(18);
    f = BigInt(1812433253);
    bigOne = BigInt(1);
    lowerMask = (this.bigOne << this.r) - this.bigOne;
    upperMask = this.bigOne << this.r;

    MT = [];
    index = 0;

    constructor(seed) {
        this.MT[0] = BigInt(seed);
        this.index = this.n;
        for (let i = 1; i < this.n; i++) {
            this.MT[i] = (this.f * (this.MT[i - 1] ^ (this.MT[i - 1] >> (this.w - BigInt(2)))) + BigInt(i)) & ((this.bigOne << this.w) - this.bigOne);
        }
    }

    twist() {
        for (let i = 0; i < this.n; i++) {
            // let x = (this.MT[i] & this.upperMask) | (this.MT[(i+1) % 624] & 0x7fffffff);
            let x = (this.MT[i] & this.upperMask) + (this.MT[BigInt(i + 1) % this.n] & this.lowerMask);
            let xA = x >> this.bigOne;
            if (x % BigInt(2) !== BigInt(0)) {
                xA = xA ^ this.a;
            }
            this.MT[i] = this.MT[(BigInt(i) + this.m) % this.n] ^ xA;
        }
        this.index = 0;
    }

    extractNumber() {
        if (this.index >= this.n) {
            if (this.index > this.n) {
                throw new Error('Generator was never seeded');
            }
            this.twist();
        }

        let y = this.MT[this.index];
        y = y ^ ((y >> this.u) & this.d);
        y = y ^ ((y << this.s) & this.b);
        y = y ^ ((y << this.t) & this.c);
        y = y ^ (y >> this.l);

        this.index++;
        return y & ((this.bigOne << this.w) - this.bigOne);
    }
}

module.exports = {
    MersenneTwister
}