const db = require("../models");
const axios = require(`axios`);

exports.characterSearchPage = async (req, res, next) => {
    try {
        res.render('charactersearch', {hello: "hello, World!"});
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.characterSearch = async (req, res, next) => {
    try {
        const { character_name } = req.body;
        const response = await axios.get(`https://developer-lostark.game.onstove.com/characters/${character_name}/siblings`, {
            headers: {
                'accept': 'application/json',
                'authorization': process.env.API_KEY
            }
        });

        const sortedCharacters = response.data.sort((a, b) => {
            const avgLevelA = parseFloat(a.ItemAvgLevel.replace(/,/g, ''));
            const avgLevelB = parseFloat(b.ItemAvgLevel.replace(/,/g, ''));
            return avgLevelB - avgLevelA;
        });

        res.render(`charactersearch`, { characters: sortedCharacters });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

exports.registerMainCharacter = async (req, res, next) => {
    try {
        const { mainCharacter, characters } = req.body;
        for (const char of characters) {
            const characterValue = [
                req.user.account_id,
                char.ServerName,
                char.CharacterClassName,
                char.CharacterName,
                parseFloat(char.ItemAvgLevel.replace(',', ''))
            ];
            await db.execute(`insert into characters (account_id, server_name, class_name, character_name, item_level) values (?, ?, ?, ?, ?)`, characterValue);
        }
        await db.execute(`update userinfo set main_character_id = (select character_id from characters where character_name = ?) where account_id = ?`, [mainCharacter.CharacterName, req.user.account_id]);
        res.send("success");
    } catch (err) {
        console.error(err);
        next(err);
    }
}