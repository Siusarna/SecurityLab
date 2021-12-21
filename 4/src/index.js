'use strict';

const { randomInt } = require('crypto');
const fs = require('fs');
const md5 = require('md5');
const sha1 = require('sha1');
const argon2 = require('argon2');

const { getPasswordFromTop10Million, getPasswordFromTop100 } = require('./getPasswordFromTop');
const { generateFullyRandomPassword } = require('./randomPasswords');
const { generateHumanLikePassword } = require('./humanLikePassword');

const generateBunchOfPasswords = (numberOfPasswords = 100_000, options) => {
    if (!options || !options.fullyRandom || !options.humanLike || !options.top100 || !options.top10Millions) {
        options.fullyRandom = randomInt(1, 6);
        options.top10Millions = randomInt(50, 81);
        options.top100 = randomInt(5, 11);
        options.humanLike = 100 - options.fullyRandom - options.top10Millions - options.top100
    }
    const passwords = [];

    for (let i = 0; i < numberOfPasswords * options.fullyRandom / 100; i++) {
        passwords.push(generateFullyRandomPassword());
    }
    for (let i = 0; i < numberOfPasswords * options.humanLike / 100; i++) {
        passwords.push(generateHumanLikePassword());
    }
    for (let i = 0; i < numberOfPasswords * options.top100 / 100; i++) {
        passwords.push(getPasswordFromTop100());
    }
    for (let i = 0; i < numberOfPasswords * options.top10Millions / 100; i++) {
        passwords.push(getPasswordFromTop10Million());
    }

    return passwords;
}
