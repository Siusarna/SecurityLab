'use strict';

const { Joi } = require('celebrate');

const loginInfo = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
})

exports.signIn = {
    body: loginInfo
}

exports.signUp = {
    body: loginInfo
}

exports.options = {
    presence: 'required',
    allowUnknown: false,
    abortEarly: false,
    convert: false
};