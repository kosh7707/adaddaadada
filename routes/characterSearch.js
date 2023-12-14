const express = require("express");
const { isLoggedIn } = require("../middlewares");
const { characterSearchPage, characterSearch, registerMainCharacter } = require("../controllers/charactersearch");
const router = express.Router();

router.get("/", isLoggedIn, characterSearchPage);

router.post("/search", isLoggedIn, characterSearch);

router.post("/registermaincharacter", isLoggedIn, registerMainCharacter);

module.exports = router;