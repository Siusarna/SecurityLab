'use strict';

module.exports = {
    dbConnection: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
    dbPoolMin: parseInt(process.env.DB_POOL_MIN, 10) || 1,
    dbPoolMax: parseInt(process.env.DB_POOL_MAX, 10) || 2,
    port: parseInt(process.env.SERVER_PORT, 10) || 4000,
    cipherPasswordName: 'aes-192-cbc',
    cipherPasswordKey: process.env.CIPHER_PASSWORD_KEY,
    cipherDataName: 'aes-192-gcm',
    cipherDataKey: process.env.CIPHER_DATA_KEY,
    passwordVersions: process.env.PASSWORD_VERSIONS
}