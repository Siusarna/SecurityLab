'use strict';

const argon2 = require('argon2');
const { encrypt } = require('../utils/crypto');
const config = require('../config');
const userModels = require('../models/users');
const { knex } = require('../lib/db');

const signIn = () => {

};

const signUp = async ({ email, password }) => {
   const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 1024 * 37,
      parallelism: 1,
      hashLength: 50,
   });
   const encryptedPassword = await encrypt(hashedPassword, config.cipherKey);
   const { password: storedPassword, ...rest } = await knex.transaction(trx => {
      return userModels.create(trx, {email, password: encryptedPassword})
   })

   return rest;
}

module.exports = {
   signUp,
   signIn
}