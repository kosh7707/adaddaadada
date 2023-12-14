const db = require("../models");

exports.editProfile = async (req, res, next) => {
    try {
        const nickname = req.body.nickname;
        const profileImageFile = req.file;
        if (profileImageFile) {
            console.log(profileImageFile);
        }
        await db.execute(`update userinfo set nickname = ? where account_id = ?`, [nickname, req.user.account_id]);
        res.status(201).redirect("/profile");
    } catch (err) {
        console.error(err);
        next(err);
    }
}

exports.profilePage = async (req, res, next) => {
    try {
        const [userinfo] = await db.execute(`select u.account_id, u.nickname, c.character_name as main_character_name
                                             from userinfo u
                                             left join characters c on u.account_id = c.account_id and u.main_character_id = c.character_id
                                             where u.account_id = ?;`, [req.user.account_id]);

        const [characters] = await db.execute(`select character_id, character_name, server_name, class_name, FORMAT(item_level, 2) as item_level from characters c where account_id = ? order by c.item_level desc`, [req.user.account_id]);
        res.render('profile', {req_user_id: req.user.account_id, profile_id: req.user.account_id, userinfo: userinfo[0], characters: characters});
    } catch (err) {
        console.error(err);
        next(err);
    }
}

exports.changeMainCharacter = async (req, res, next) => {
    try {
        const { character_id } = req.body;
        await db.execute(`update userinfo set main_character_id = ? where account_id = ?`, [character_id, req.user.account_id]);
        res.send("success");
    } catch (err) {
        console.error(err);
        next(err);
    }
}

exports.viewOtherProfile = async (req, res, next) => {
    try {
        const profile_id = req.params.id;
        const [userinfo] = await db.execute(`select u.account_id, u.nickname, c.character_name as main_character_name 
                                                from userinfo u, characters c 
                                                where u.account_id = ? 
                                                  and u.account_id = c.account_id 
                                                  and u.main_character_id = c.character_id;`, [profile_id]);

        const [characters] = await db.execute(`select character_id, character_name, server_name, class_name, FORMAT(item_level, 2) as item_level from characters c where account_id = ? order by c.item_level desc`, [profile_id]);
        res.render('profile', {req_user_id: req.user.account_id, profile_id: profile_id, userinfo: userinfo[0], characters: characters});
    } catch (err) {
        console.error(err);
        next(err);
    }
}

