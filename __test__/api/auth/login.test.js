const supertest = require('supertest');
const creteUser = require('../helpers/create-user');
const app = require('../../../app');

const loginData = {
    email: 'bot11165@gmail.com',
    password: 'Hello_Word1!'
};

const loginUrl = '/api/auth';

describe('Login user', () => {
    test('create user', async () => {
        await creteUser(loginData);
    });

    test('Send empty body', async () => {
        const response = await supertest(app).post(loginUrl).send({});

        expect(response.statusCode).toBe(404);
        expect(typeof response.body.message).toBe('string');
        expect(response.body.message).toBe('User not found');
    });

    test('Success login', async () => {
        const response = await supertest(app).post(loginUrl).send(loginData);

        expect(response.statusCode).toBe(200);
        expect(typeof response.body.accessToken).toBe('string');
        expect(typeof response.body.refreshToken).toBe('string');
        expect(typeof response.body.user).toBe('object');
    });

    test('Send wrong login data', async () => {
        const response = await supertest(app)
            .post(loginUrl)
            .send({email: 'fakemail@gmao.com', password: loginData.password});

        expect(response.statusCode).toBe(404);
        expect(typeof response.body.message).toBe('string');
        expect(response.body.message).toBe('User not found');
    });
});