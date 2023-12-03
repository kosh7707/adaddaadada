const express = require("express");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nunjucks = require("nunjucks");
const path = require("path");
const passport = require('passport');

require("dotenv").config();
require("./passport")();

const app = express();
app.use(express.static("public"));
app.set("views", __dirname + "/views");
app.set("view engine", "html");
nunjucks.configure("views", {
    express: app, 
    watch: true, 
});

app.set("port", process.env.PORT);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));
app.use(passport.initialize());
app.use(passport.session());

const indexRouter = require("./routes");
const boardRouter = require("./routes/board");
const authRouter = require("./routes/auth");
const bootstrapRouter = require("./routes/bootstrap");
app.use("/", indexRouter);
app.use("/board", boardRouter);
app.use("/auth", authRouter);
app.use("/bootstrap", bootstrapRouter);

app.use((req, res, next) => {
    const err = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.error(err);
    res.send(err);
});

app.listen(app.get('port'), () => {
    console.log(`listening at http://localhost:${app.get('port')}`);
});