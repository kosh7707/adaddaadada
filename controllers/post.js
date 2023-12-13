const db = require('../models');

exports.mainPage = async (req, res, next) => {
    try {
        const [posts] = await db.execute(`select p.post_id, p.title, p.content, u.nickname, p.view_count
                                            , DATE_FORMAT(p.created_at, '%Y-%m-%d') as created_at
                                            , (select count(*) from likes where post_id = p.post_id) as like_count
                                            , (select count(*) from comments where post_id = p.post_id) as comment_count
                                          from posts p, userinfo u
                                          where p.author_id = u.account_id
                                          order by created_at desc;`);
        res.render('board', { posts });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.newPost = async (req, res, next) => {
    try {
        res.render("newpost");
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.uploadPost = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        await db.execute(`INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)`, [title, content, req.user.account_id]);
        res.redirect('/board');
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.viewPost = async (req, res, next) => {
    try {
        const post_id = req.params.post_id;
        await db.execute(`update posts set view_count = view_count + 1 where post_id = ?`, [post_id]);

        const [posts] = await db.execute(`select p.post_id, p.title, p.content, u.nickname, p.view_count
                                              , DATE_FORMAT(p.created_at, '%Y.%m.%d %h:%m:%s') as created_at
                                         from posts p, userinfo u
                                         where p.author_id = u.account_id and p.post_id = ?;`, [post_id]);
        const [comments] = await db.execute(`select c.content as content, u.nickname
                                            , DATE_FORMAT(c.created_at, '%Y.%m.%d %h:%m:%s') as created_at
                                            from comments c, userinfo u
                                            where c.post_id = ? and c.author_id = u.account_id;`, [post_id]);
        const [comment_count] = await db.execute(`select count(*) as count from comments where post_id = ?;`, [post_id]);
        const [like_count] = await db.execute(`select count(*) as count from likes where post_id = ?;`, [post_id]);

        res.render('post', { post: posts[0], comments: comments, like_count: like_count[0]['count'], comment_count: comment_count[0]['count'] });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.writeComment = async (req, res, next) => {
    try {
        const post_id = req.params.post_id;
        const comment = req.body.comment;

        await db.execute('INSERT INTO comments (post_id, content, author_id) VALUES (?, ?, ?)', [post_id, comment, req.user.account_id]);

        res.redirect(`/board/${post_id}`);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.likePost = async (req, res, next) => {
    try {
        const post_id = req.params.post_id;
        const [count] = await db.execute(`select count(*) as count from likes where post_id = ? and like_id = ?`, [post_id, req.user.account_id]);
        if (count[0]['count'] === 0)
            await db.execute(`insert into likes (post_id, like_id) values (?, ?)`, [post_id, req.user.account_id]);
        res.redirect(`/board/${post_id}`);
    } catch (err) {
        console.error(err);
        next(err);
    }
}