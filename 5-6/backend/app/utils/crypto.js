'use strict';

const crypto = require('crypto');
const argon2 = require('argon2');
const { promisify } = require('util');
const config = require('../config');

const promisifiedRandomFill = promisify(crypto.randomFill);

const encrypt = async (data, key) => {
    const iv = await promisifiedRandomFill(new Uint8Array(16));
    const aes = crypto.createCipheriv(config.cipherName, key, iv);
    let encrypted = aes.update(data, 'utf8', 'hex');
    encrypted += aes.final('hex');

    return { encrypted, iv };
}

const decrypt = async (data, key, iv) => {
    const aes = crypto.createDecipheriv(config.cipherName, key, iv);
    let decrypted = aes.update(data, 'hex', 'utf-8');
    decrypted += aes.final('utf-8');

    return decrypted;
}

const hashing = (data) => argon2.hash(data, {
    type: argon2.argon2id,
    memoryCost: 1024 * 37,
    parallelism: 1,
    hashLength: 50,
});

module.exports = {
    encrypt,
    hashing,
    decrypt
}