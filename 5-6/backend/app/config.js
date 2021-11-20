'use strict';

module.exports = {
    dbConnection: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
    dbPoolMin: parseInt(process.env.DB_POOL_MIN, 10) || 1,
    dbPoolMax: parseInt(process.env.DB_POOL_MAX, 10) || 2,
    port: parseInt(process.env.SERVER_PORT, 10) || 4000,
}