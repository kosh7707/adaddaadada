const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require(process.cwd() + '/models');

exports.register = async (req, res, next) => {
    const {email, nickname, password} = req.body;
    try {
        const [rows] = await db.execute(`select * from accounts where user_email=?`, [email]);
        if (rows.length !== 0) {
            return res.redirect('/');
        }
        const hash = await bcrypt.hash(password, 12);
        await db.execute(`insert into accounts(user_email, user_pw) values (?, ?)`, [email, hash]);
        await db.execute(`insert into userinfo(account_id, nickname) values ((select account_id from accounts where user_email = ?), ?)`, [email, nickname]);
        return res.redirect('/');
    } catch (err) {
        console.error(err);
        return next(err);
    }
};

exports.login = (req, res, next) => {
    passport.authenticate('local', (authErr, user) => {
        if (authErr) {
            console.error(authErr);
            return next(authErr);
        }
        if (!user) {
            return res.redirect('/');
        }
        return req.login(user, async (loginErr) => {
            if (loginErr) {
                console.error(loginErr);
                return next(loginErr);
            }
            await db.execute(`update accounts set last_login = current_timestamp where account_id = ?`, [user.account_id]);
            return res.redirect('/board');
        });
    }) (req, res, next);
};

exports.logout = (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
};