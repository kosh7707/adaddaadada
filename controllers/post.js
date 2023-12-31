const db = require('../models');

exports.mainPage = async (req, res, next) => {
    try {
        const [posts] = await db.execute(`select p.post_id, p.title, p.content, u.nickname, p.view_count, p.author_id
                                            , DATE_FORMAT(p.created_at, '%Y-%m-%d') as created_at
                                            , (select count(*) from likes where post_id = p.post_id) as like_count
                                            , (select count(*) from comments where post_id = p.post_id) as comment_count
                                          from posts p, userinfo u
                                          where p.author_id = u.account_id
                                          order by p.created_at desc;`);
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
        const visitedPosts = req.cookies.visitedPosts || [];

        if (!visitedPosts.includes(post_id)) {
            await db.execute(`update posts set view_count = view_count + 1 where post_id = ?`, [post_id]);
            res.cookie('visitedPosts', [...visitedPosts, post_id], { maxAge: 60000 });
        }

        const [posts] = await db.execute(`select p.post_id, p.title, p.content, u.nickname, p.view_count, p.author_id
                                              , DATE_FORMAT(p.created_at, '%Y.%m.%d %h:%m:%s') as created_at
                                         from posts p, userinfo u
                                         where p.author_id = u.account_id and p.post_id = ?;`, [post_id]);
        const [comments] = await db.execute(`select c.comment_id, c.content as content, u.nickname
                                            , DATE_FORMAT(c.created_at, '%Y.%m.%d %h:%m:%s') as created_at
                                            from comments c, userinfo u
                                            where c.post_id = ? and c.author_id = u.account_id;`, [post_id]);
        const [comment_count] = await db.execute(`select count(*) as count from comments where post_id = ?;`, [post_id]);
        const [like_count] = await db.execute(`select count(*) as count from likes where post_id = ?;`, [post_id]);

        res.render('post', { user_id: req.user.account_id, post: posts[0], comments: comments, like_count: like_count[0]['count'], comment_count: comment_count[0]['count'] });
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

exports.deletePost = async (req, res, next) => {
    try {
        const post_id = req.params.post_id;
        const [author_id] = await db.execute(`select author_id from posts where post_id = ?`, [post_id]);
        if (req.user.account_id === author_id[0]['author_id']){
            await db.execute(`delete from posts where post_id = ?`, [post_id]);
            res.send("success");
        }
        else {
            res.status(403).send("user is not the author");
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
}

exports.viewEditPost = async (req, res, next) => {
    try {
        const post_id = req.params.post_id;
        const [author_id] = await db.execute(`select author_id from posts where post_id = ?`, [post_id]);
        if (req.user.account_id === author_id[0]['author_id']) {
            const [posts] = await db.execute(`select * from posts where post_id = ?`, [post_id]);
            res.render("editpost", { post: posts[0]})
        }
        else {
            res.status(403).send("user is not the author");
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
}

exports.editPost = async (req, res, next) => {
    try {
        const post_id = req.params.post_id;
        const { title, content } = req.body;
        await db.execute(`update posts set title = ?, content = ?, updated_at = CURRENT_TIMESTAMP where post_id = ?`, [title, content, post_id]);
        res.redirect(`/board/${post_id}`);
    } catch (err) {
        console.error(err);
        next(err);
    }
}

exports.deleteComment = async (req, res, next) => {
    try {
        const comment_id = req.params.comment_id;
        const [author_id] = await db.execute(`select author_id from comments where comment_id = ?`, [comment_id]);
        if (req.user.account_id === author_id[0]['author_id']){
            await db.execute(`delete from comments where comment_id = ?`, [comment_id]);
            res.send("success");
        }
        else {
            res.status(403).send("user is not the author");
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
}