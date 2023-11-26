const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const axios = require('axios');
const crypto = require('node:crypto');

const constants = require('../utils/constants');
const utils = require('../utils');
const {User} = require('../models');
const {generateTokens} = require('../utils/common');
const logger = require("../utils/logger")(__filename);

const router = express.Router();

router.post('/register', async (req, res) => {
    logger.info("registering user");
    const {
        firstname,
        lastname,
        username,
        email,
        mobileNumber,
        password,
        role,
    } = req.body;

    if (utils.isBlank(password) || password.length < 8) {
        return res.status(400).json({message: 'invalid password'});
    }
    if (!(role === constants.USER_ROLES.ADMIN || role === constants.USER_ROLES.USER)) {
        return res.status(400).json({message: 'invalid role'});
    }
    if (!utils.isBlank(await User.findOne({username}))) {
        return res.status(400).json({message: 'username already exists'});
    }
    if (!utils.isBlank(await User.findOne({email}))) {
        return res.status(400).json({message: 'email already exists'});
    }
    if (!utils.isBlank(await User.findOne({mobileNumber}))) {
        return res.status(400).json({message: 'mobileNumber already exists'});
    }

    const user = new User({
        firstname,
        lastname,
        username,
        email,
        mobileNumber,
        role,
        status: constants.USER_STATUS.ACTIVE,
    });
    user.setPassword(password);

    try {
        await user.validate();
    } catch (e) {
        return res.status(400).json(e);
    }

    try {
        await user.save();
    } catch (e) {
        return res.status(500).json(e);
    }

    return res.status(200).json({
        user,
        tokens: generateTokens({
            id: user.id || user._id,
            role: user.role,
            email: user.email,
            status: user.status,
        }),
    });
});

router.post('/login', async (req, res) => {
    const {email, mobileNumber, username, password} = req.body;

    if (utils.isBlank(password)) {
        return res.sendStatus(400);
    }

    let user;

    if (!utils.isBlank(email)) {
        user = await User.findOne({email, deleted: false});
    } else if (!utils.isBlank(mobileNumber)) {
        user = await User.findOne({mobileNumber, deleted: false});
    } else if (!utils.isBlank(username)) {
        user = await User.findOne({username, deleted: false});
    } else {
        return res.sendStatus(400);
    }

    if (utils.isBlank(user)) {
        return res.sendStatus(401);
    }

    if (!user.validPassword(password)) {
        return res.sendStatus(401);
    }

    return res.json(generateTokens({
        id: user.id || user._id,
        role: user.role,
        email: user.email,
        status: user.status,
    }));
});

router.post('/refresh', async (req, res) => {
    const {refresh_token, grant_type} = req.body;

    if (utils.isBlank(refresh_token) || utils.isBlank(grant_type)) {
        return res.sendStatus(400);
    }

    if (grant_type !== 'refresh_token') {
        return res.sendStatus(400);
    }

    try {
        const decoded = jsonwebtoken.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
        return res.json(generateTokens(decoded.data));
    } catch (e) {
        return res.sendStatus(401);
    }
});

module.exports = router;
