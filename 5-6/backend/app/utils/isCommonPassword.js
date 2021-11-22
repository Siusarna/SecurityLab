'use strict';

const fs = require('fs');

const topPasswords = fs.readFileSync(`${__dirname}/top10000password.txt`).toString().split('\r\n');

console.log(topPasswords)
const isCommonPassword = (password) => topPasswords.includes(password);

module.exports = {
    isCommonPassword
}