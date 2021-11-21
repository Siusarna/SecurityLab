'use strict';

const { Joi } = require('celebrate');

const loginInfo = Joi.object({
    email: Joi.string().email().required(),
    password: Joi
        .string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/)
        .required()
        .label('Minimum eight and maximum 64 characters, at least one uppercase letter, one lowercase letter, one number and one special character')
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