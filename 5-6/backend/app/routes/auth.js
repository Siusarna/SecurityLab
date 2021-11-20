'use strict';

const { celebrate } = require('celebrate');
const validator = require('../validators/auth');

const authController = require('../controllers/auth');
const wrap = require('../middleware/wrap');

module.exports = app => {
    app.post('/api/v1/sing-in', celebrate(validator.signIn, validator.options), wrap(authController.signIn));
    app.post('/api/v1/sing-up', celebrate(validator.signUp, validator.options), wrap(authController.signUp));
}