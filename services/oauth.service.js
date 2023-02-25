const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {BadRequest, Unauthorized, ServerError} = require('../errors/ApiError');
const {REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET} = require('../configs/variables');
const { FORGOT_PASSWORD, CONFIRM_ACCOUNT } = require('../configs/actionTokenTypes.enum');

const hashPassword = (password) => bcrypt.hash(password, 10);

const checkPassword = async (hashedPassword, password) => {
    const isPasswordEquals = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordEquals) {
        throw new BadRequest('Email or password is wrong');
    }
};

const generateNewAccessTokenPair = (encodeData = {}) => {
    const accessToken = jwt.sign(encodeData, ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
    const refreshToken = jwt.sign(encodeData, REFRESH_TOKEN_SECRET, {expiresIn: '30d'});

    return{
        accessToken,
        refreshToken
    };
};

const validateAccessToken = (accessToken = '') => {
    try {
        return jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    } catch (e) {
        throw new Unauthorized(e.message || 'Invalid token');
    }

};

const validateRefreshToken = (refreshToken = '') => {
    try {
        return jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    } catch (e) {
        throw new Unauthorized(e.message || 'Invalid token');
    }
};

const generateActionToken = (actionType, encodeData = {}) => {
    let expiresIn = '72h';
    const secretWord = 'qwerty';

    switch (actionType){
        case FORGOT_PASSWORD:
            expiresIn = '72h';
            //secretWord = 'qwerty';
            break

        case CONFIRM_ACCOUNT:
            expiresIn = '72h';
            //secretWord = 'qwerty';
            break

        default:
            throw new ServerError('Wrong action type')
    }

    return jwt.sign(encodeData, secretWord, { expiresIn });
};

const validateActionToken = (token) => {
    try {
        return jwt.verify(token, 'qwerty');
    } catch (e) {
        throw new BadRequest(e.message || 'Invalid token');
    }

};

module.exports = {
    hashPassword,
    checkPassword,
    generateNewAccessTokenPair,
    generateActionToken,

    validateAccessToken,
    validateRefreshToken,
    validateActionToken
};