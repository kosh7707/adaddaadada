const db = require("../models");

exports.characterSearchPage = async (req, res, next) => {
    try {
        res.render('charactersearch', {hello: "hello, World!"});
    } catch (err) {
        console.error(err);
        next(err);
    }
};