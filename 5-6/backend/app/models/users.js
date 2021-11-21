'use strict';

const { Joi } = require('celebrate');
const { DatabaseValidationError, DatabaseSaveError } = require('../exceptions/index');
const humps = require('humps');

const validateSchema = (schema, data) => {
    if (Array.isArray(data)) {
        data.forEach(obj => validateSchema(schema, obj));
    }
    const v = schema.validate(data);
    if (v.error) {
        const errors = v.error.details.map(err => err.message);
        throw new DatabaseValidationError(errors.join(', '));
    }
}

const table = 'users';

const createSchema = Joi.object({
    email: Joi.string().lowercase().required(),
    password: Joi.string().required()
});

const create = async (trx, data) => {
    validateSchema(createSchema, data);
    const results = await trx
        .insert(humps.decamelizeKeys(data))
        .into(table)
        .returning('*')
        .catch(e => {
            if (e.constraint === 'users_email_key') {
                const { password, ...rest } = data;
                throw new DatabaseSaveError('User with this email has already exists', 422, rest);
            }
            throw e;
        });
    return humps.camelizeKeys(results[0]);
}

module.exports = {
    create
}