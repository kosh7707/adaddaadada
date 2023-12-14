const express = require("express");
const { isLoggedIn } = require("../middlewares");
const { profilePage } = require("../controllers/profile");
const router = express.Router();

router.get("/", isLoggedIn, profilePage);

module.exports = router;