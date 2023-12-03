const express = require("express");
const path = require("path");
const router = express.Router();

require("dotenv").config();

router.get("/", async (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            res.redirect("/board");
        }
        else {
            res.sendFile(path.join(process.cwd(), 'views', 'index.html'));
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;