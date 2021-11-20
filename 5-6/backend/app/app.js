'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(bodyParser.json({ limit: '5mb' }));

routes(app);

app.use(errorHandler.notFound());
app.use(errorHandler.validation());
app.use(errorHandler.unexpected(config));

module.exports = app;