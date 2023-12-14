const db = require("../models");

exports.profilePage = async (req, res, next) => {
    try {
        res.render('profile', {hello: "hello, World!"});
    } catch (err) {
        console.error(err);
        next(err);
    }
};