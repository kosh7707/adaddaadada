const express = require("express");
const request = require("request");
const path = require("path");
const router = express.Router();

require("dotenv").config();

router.get("/", async (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            const data = {
                username: req.user.nickname,
                fruits: ['Apple', 'Banana', 'Orange'],
            };
            res.render("body", data);
        }
        else {
            res.redirect("/");
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;