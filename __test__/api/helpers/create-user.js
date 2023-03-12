const { faker } = require("@faker-js/faker");

const User = require('../../../dataBase/User');

module.exports = (userData = {}) => {
    const fakeUser = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        age: faker.random.numeric(2),
        password: faker.internet.password(8),
        ...userData
    };

    return User.saveUserWithHashPassword(fakeUser);
};
