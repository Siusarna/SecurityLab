'use strict';

const fs = require('fs');
const { randomInt } = require('crypto');

const top100Passwords = fs.readFileSync(`${__dirname}/static/top-100-passwords.txt`).toString().split('\n');
const top10MillionPasswords = fs.readFileSync(`${__dirname}/static/top-10-million-passwords.txt`).toString().split('\n');

const getPasswordFromTop = (list) => {
    const randomIndex = randomInt(0, list.length);
    return list[randomIndex];
}

const getPasswordFromTop100 = () => {
    return getPasswordFromTop(top100Passwords);
}

const getPasswordFromTop10Million = () => {
    return getPasswordFromTop(top10MillionPasswords);
}

module.exports = {
    getPasswordFromTop100,
    getPasswordFromTop10Million
}