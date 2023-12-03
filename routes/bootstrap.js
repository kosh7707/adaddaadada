const express = require("express");
const path = require("path");
const router = express.Router();

router.use("/", express.static(path.join(__dirname, "../node_modules/bootstrap/dist")));

module.exports = router;