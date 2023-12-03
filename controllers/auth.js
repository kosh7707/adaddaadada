const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require(process.cwd() + '/models');

exports.register = async (req, res, next) => {
    const {email, nickname, password} = req.body;
    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE email=?', [email]);
        if (rows.length != 0) {
            return res.redirect('/');
        }
        const hash = await bcrypt.hash(password, 12);
        await db.execute('INSERT INTO users (email, nickname, password) VALUES (?, ?, ?)', [email, nickname, hash]);
        return res.redirect('/');
    } catch (err) {
        console.error(err);
        return next(err);
    }
};

exports.login = (req, res, next) => {
    passport.authenticate('local', (authErr, user, info) => {
        if (authErr) {
            console.error(authErr);
            return next(authErr);
        }
        if (!user) {
            return res.redirect('/');
        }
        return req.login(user, (loginErr) => {
            if (loginErr) {
                console.error(loginErr);
                return next(loginErr);
            }
            return res.redirect('/board');
        });
    })(req, res, next);
};

exports.logout = (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
};