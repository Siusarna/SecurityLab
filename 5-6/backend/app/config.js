'use strict';

module.exports = {
    dbConnection: process.env.DB_CONNECTION,
    dbPoolMin: parseInt(process.env.DB_POOL_MIN, 10) || 1,
    dbPoolMax: parseInt(process.env.DB_POOL_MAX, 10) || 2,
    port: parseInt(process.env.SERVER_PORT, 10) || 4000,
    cipherPasswordKey: process.env.CIPHER_PASSWORD_KEY,
    cipherPasswordName: 'aes-256-cbc',
    cipherDataName: 'aes-256-gcm',
    cipherDataKey: process.env.CIPHER_DATA_KEY,
    passwordVersions: process.env.PASSWORD_VERSIONS || 'v0',
    aws: {
        accessKey: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        cmkIdentifier: process.env.CMK_IDENTIFIER,
    },
    certPassphrase: process.env.CERT_PASSPHARASE,
}