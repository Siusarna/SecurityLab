'use strict';

const { port, certPassphrase } = require('./config');
const app = require ('./app');
const https = require('https');
const fs = require('fs');


https.createServer({
    key: fs.readFileSync(`${__dirname}/../certs/localhost.key`),
    cert: fs.readFileSync(`${__dirname}/../certs/localhost.crt`),
    passphrase: certPassphrase
}, app).listen(port, () => {
    console.log(`Listening on port ${port}`);
})