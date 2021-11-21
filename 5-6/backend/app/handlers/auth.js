'use strict';

const argon2 = require('argon2');
const { BadRequest } = require('../exceptions')
const { encrypt, hashing, decrypt } = require('../utils/crypto');
const config = require('../config');
const userModels = require('../models/users');
const { knex } = require('../lib/db');

const signIn = async ({ email, password }) => {
   const { iv, password: storedPassword, ...user } = await knex.transaction(trx => {
      return userModels.selectByEmail(trx, { email })
   });
   if (!user) {
      throw new BadRequest('Login failed; Invalid email or password.');
   }
   const arrIv = new Uint8Array(iv.split(','));
   const decryptedPassword = await decrypt(storedPassword, config.cipherKey, arrIv);
   if (!(await argon2.verify(decryptedPassword, password))) {
      throw new BadRequest('Login failed; Invalid email or password.');
   }
   return {
      message: 'You are successfully login',
      user
   };

};

const signUp = async ({ email, password }) => {
   const hashedPassword = await hashing(password);
   const { encrypted: encryptedPassword, iv } = await encrypt(hashedPassword, config.cipherKey);
   const { password: storedPassword, iv: storedIv, ...rest } = await knex.transaction(trx => {
      return userModels.create(trx, { email, password: encryptedPassword, iv: iv.toString() })
   })

   return rest;
}

module.exports = {
   signUp,
   signIn
}