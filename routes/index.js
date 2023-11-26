const express = require("express");
const jsonwebtoken = require("jsonwebtoken");

const utils = require("../utils");

const router = express.Router();

router.use(async (req, res, next) => {
    const data = [req.body, req.params, req.query];
    for (let i = 0; i < data.length; i += 1) {
        const {email} = data[i];
        if (!utils.isBlank(email)) {
            // eslint-disable-next-line no-useless-escape
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                return res.status(400).json({message: "invalid email"});
            }
        }
    }
    return next();
});

// router.use("/common", require("./common"));
router.use("/auth", require("./auth"));

router.use(async (req, res, next) => {
    try {
        if (
            utils.isBlank(req.headers.authorization) ||
            !req.headers.authorization.startsWith("Bearer ")
        ) {
            return res.sendStatus(401);
        }
        const decoded = jsonwebtoken.verify(
            req.headers.authorization.substr(7),
            process.env.JWT_ACCESS_SECRET
        );
        req.user = decoded.data;
        return next();
    } catch (e) {
        return res.sendStatus(401);
    }

});

router.use("/demo", require("./demo"));
router.use("/user", require("./users"));
router.use(async (_, res) => res.sendStatus(404));

module.exports = router;