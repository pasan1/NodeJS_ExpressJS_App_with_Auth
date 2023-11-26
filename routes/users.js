var express = require('express');
var router = express.Router();

const constants = require('../utils/constants');
const utils = require('../utils');
const {User} = require('../models');
const logger = require("../utils/logger")(__filename);

/* GET users listing. */
router.get('/', async function (req, res, next) {
    const user = await User.findById(req.user.id);

    if (utils.isBlank(user)) {
        return res.sendStatus(404);
    }

    res.send('respond with a resource');
});

module.exports = router;
