var express = require('express');
var router = express.Router();

const constants = require('../utils/constants');
const utils = require('../utils');
const {User} = require('../models');
const logger = require("../utils/logger")(__filename);

/* GET users listing. */
router.get('/', async function (req, res, next) {
    const user = await User.findById(req.user.id);
    logger.info("user", req.user);

    if (utils.isBlank(user)) {
        return res.sendStatus(404);
    }

    if (user.deleted) {
        res.status(410);
        return res.send("user is deleted");
    }

    if (user.role !== constants.USER_ROLES.USER) {
        res.status(403);
        return res.send("user is not admin")
    }

    if (user.status !== constants.USER_STATUS.ACTIVE) {
        res.status(403);
        return res.send("user is not active");

    }
    res.send('respond with a resource');
});

module.exports = router;
