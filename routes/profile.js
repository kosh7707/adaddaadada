const express = require("express");
const { isLoggedIn } = require("../middlewares");
const { profilePage, changeMainCharacter, editProfile, viewOtherProfile } = require("../controllers/profile");
const router = express.Router();

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'public', 'uploads');

fs.readdir(uploadDir, (error) => {
    if (error) {
        fs.mkdirSync(uploadDir);
    }
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const filename = req.user.account_id + "_profile.png";
        cb(null, filename);
    },
});

const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 }});

router.get("/", isLoggedIn, profilePage);

router.get("/:id", isLoggedIn, viewOtherProfile);

router.post("/changemaincharacter", isLoggedIn, changeMainCharacter);

router.post("/edit", isLoggedIn, upload.single('profileImage'), editProfile);

module.exports = router;