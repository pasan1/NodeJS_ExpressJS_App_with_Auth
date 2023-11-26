const mongoose = require('mongoose');
const jsonwebtoken = require('jsonwebtoken');

const getCollection = (collection) => {
    return mongoose.connection.collections[collection];
};

const generateTokens = (payload) => {
    let iat = Math.floor(Date.now() / 1000);
    let exp = iat + Math.floor(process.env.JWT_ACCESS_EXPIRATION_SEC);
    let expRefresh = iat + Math.floor(process.env.JWT_REFRESH_EXPIRATION_SEC);

    console.log('process.env.JWT_ACCESS_EXPIRATION_SEC: ', process.env.JWT_ACCESS_EXPIRATION_SEC);
    console.log('iat: ', iat);
    console.log('exp: ', exp);
    console.log('expRefresh: ', expRefresh);

    return {
        access_token: jsonwebtoken.sign({
            data: payload,
            iat: iat,
            exp: exp,
        }, process.env.JWT_ACCESS_SECRET),
        token_type: 'Bearer',
        expires_in: exp,
        refresh_token: jsonwebtoken.sign({
            data: payload,
            iat: iat,
            exp: expRefresh,
        }, process.env.JWT_REFRESH_SECRET),
    };
};

module.exports = {getCollection, generateTokens};