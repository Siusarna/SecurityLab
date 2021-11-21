'use strict';

module.exports = {
    dbConnection: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
    dbPoolMin: parseInt(process.env.DB_POOL_MIN, 10) || 1,
    dbPoolMax: parseInt(process.env.DB_POOL_MAX, 10) || 2,
    port: parseInt(process.env.SERVER_PORT, 10) || 4000,
    cipherName: 'aes-192-gcm',
    cipherKey: process.env.CIPHER_KEY || 'f42206e880ef98050a11ee16ea08aaa1af523c361de9ea7a'
}