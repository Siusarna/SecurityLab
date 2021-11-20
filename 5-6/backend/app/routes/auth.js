'use strict';

const { celebrate } = require('celebrate');
const validator = require('../validators/auth');
const rates = require('../rate-limits/auth');

const authController = require('../controllers/auth');
const wrap = require('../middleware/wrap');

module.exports = app => {
    app.post('/api/v1/sing-in', rates.signInLimiter, celebrate(validator.signIn, validator.options), wrap(authController.signIn));
    app.post('/api/v1/sing-up', rates.signUpLimiter, celebrate(validator.signUp, validator.options), wrap(authController.signUp));
}