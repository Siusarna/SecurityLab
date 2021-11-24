'use strict';

const argon2 = require('argon2');
const {BadRequest} = require('../exceptions')
const {encryptPassword, hashing, decryptPassword, encryptData, decryptData} = require('../utils/crypto');
const { decrypt } = require('../lib/aws')
const config = require('../config');
const userModels = require('../models/users');
const {knex} = require('../lib/db');

const signIn = async ({email, password}) => {
    const storedUser = await knex.transaction(trx => {
        return userModels.selectByEmail(trx, {email})
    });
    if (!storedUser) {
        throw new BadRequest('Login failed; Invalid email or password.');
    }
    const dataKey = await decrypt(config.cipherDataKey);
    const passwordKey = await decrypt(config.cipherPasswordKey);
    const {iv, password: storedPassword, address, phone, ...user} = storedUser;
    const arrIv = new Uint8Array(iv.split(','));
    const decryptedPassword = decryptPassword(storedPassword, passwordKey, arrIv);
    const decryptedAddress = decryptData(address.data, dataKey, new Uint8Array(address.iv.split(',')), Buffer.from(address.tag, 'base64'));
    const decryptedPhone = decryptData(phone.data, dataKey, new Uint8Array(phone.iv.split(',')), Buffer.from(phone.tag, 'base64'));
    if (!(await argon2.verify(decryptedPassword, password))) {
        throw new BadRequest('Login failed; Invalid email or password.');
    }
    await knex.transaction(trx => {
        return userModels.updateLastAuthDate(trx, storedUser.id);
    })
    return {
        message: 'You are successfully login',
        address: decryptedAddress,
        phone: decryptedPhone,
        user
    };
};

const signUp = async ({email, password, address, phone}) => {
    const hashedPassword = await hashing(password);
    const dataKey = await decrypt(config.cipherDataKey);
    const passwordKey = await decrypt(config.cipherPasswordKey);
    const {encrypted: encryptedPassword, iv} = await encryptPassword(hashedPassword, passwordKey);
    const encryptedAddress = await encryptData(address, dataKey);
    const encryptedPhone = await encryptData(phone, dataKey);
    const {password: storedPassword, iv: storedIv, ...rest} = await knex.transaction(trx => {
        return userModels.create(trx, {
            email,
            iv,
            password: encryptedPassword,
            address: {
                data: encryptedAddress.encrypted,
                iv: encryptedAddress.iv,
                tag: encryptedAddress.tag
            },
            phone: {
                data: encryptedPhone.encrypted,
                iv: encryptedPhone.iv,
                tag: encryptedPhone.tag
            }

        })
    })

    return rest;
}

module.exports = {
    signUp,
    signIn
}