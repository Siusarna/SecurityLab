'use strict';

const { Joi } = require('celebrate');
const { DatabaseValidationError } = require('../exceptions/index');
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
        .returning('*');
    return humps.camelizeKeys(results[0]);
}

module.exports = {
    create
}