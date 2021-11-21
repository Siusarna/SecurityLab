'use strict';

const crypto = require('crypto');
const { promisify } = require('util');
const config = require('../config');

const promisifiedRandomFill = promisify(crypto.randomFill);

const encrypt = async (data, key) => {
    const iv = await promisifiedRandomFill(new Uint8Array(16));
    const aes = crypto.createCipheriv(config.cipherName, key, iv);
    let encrypted = aes.update(data, 'utf8', 'hex');
    encrypted += aes.final('hex');

    return encrypted;
}

module.exports = {
    encrypt
}