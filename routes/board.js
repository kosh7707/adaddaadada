const express = require("express");

const { isLoggedIn } = require("../middlewares");
const { mainPage, newPost, uploadPost, viewPost, writeComment, likePost, deletePost, viewEditPost, editPost, deleteComment } = require("../controllers/post");

const router = express.Router();

router.get("/", isLoggedIn, mainPage);

router.get("/newpost", isLoggedIn, newPost);

router.post("/newpost", isLoggedIn, uploadPost);

router.get("/:post_id", isLoggedIn, viewPost);

router.post("/:post_id/comment", isLoggedIn, writeComment);

router.post("/:post_id/like", isLoggedIn, likePost);

router.delete("/:post_id", isLoggedIn, deletePost);

router.get("/:post_id/edit", isLoggedIn, viewEditPost);

router.post("/:post_id/edit", isLoggedIn, editPost);

router.delete("/comment/:comment_id", isLoggedIn, deleteComment);

module.exports = router;