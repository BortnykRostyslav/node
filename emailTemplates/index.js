const {BANNED, WELCOME, FORGOT_PASSWORD} = require('../configs/emailTypes.enum');

module.exports = {
    [WELCOME]: {
        templateName: 'welcome',
        subject: 'Welcome on board'
    },
    [BANNED]: {
        templateName: 'banned',
        subject: 'Account was blocked'
    },
    [FORGOT_PASSWORD]: {
        templateName: 'forgotPassword',
        subject: 'Forgot Password'
    }
};