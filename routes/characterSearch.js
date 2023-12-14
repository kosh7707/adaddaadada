const express = require("express");
const { isLoggedIn } = require("../middlewares");
const { characterSearchPage } = require("../controllers/characterSearch");
const router = express.Router();

router.get("/", isLoggedIn, characterSearchPage);

module.exports = router;