const Joi = require('joi');
const {PASSWORD_REGEXP, EMAIL_REGEXP} = require('../../configs/regexp.enum');

const userCarSubSchema = Joi.object({
    model: Joi.string().required(),
    color: Joi.string().valid('red', 'white', 'black').required()
});

const newUserSchema = Joi.object({
    firstName: Joi.string().alphanum().min(2).max(64).trim().error(new Error('Firstname is not valid')),
    lastName: Joi.string().alphanum().min(2).max(64).trim().error(new Error('Lastname is not valid')),

    email: Joi.string().regex(EMAIL_REGEXP).lowercase().trim().required().error(new Error('Email is not valid')),
    password: Joi.string().regex(PASSWORD_REGEXP).required().error(new Error('Password is not valid')),

    age: Joi.number().integer().min(2).max(101).error(new Error('Age is not valid')),

    cars: Joi.array().items(userCarSubSchema).unique().when('girl', {is: true, then: Joi.required()}),

    girl: Joi.boolean()
});

module.exports = {
    newUserSchema
};