const express = require("express");

const { isLoggedIn } = require("../middlewares");
const { mainPage, newPost, uploadPost, viewPost, writeComment, likePost } = require("../controllers/post");

const router = express.Router();

router.get("/", isLoggedIn, mainPage);

router.get("/newpost", isLoggedIn, newPost);

router.post("/newpost", isLoggedIn, uploadPost);

router.get("/:post_id", isLoggedIn, viewPost);

router.post("/:post_id/comment", isLoggedIn, writeComment);

router.post("/:post_id/like", isLoggedIn, likePost);

module.exports = router;