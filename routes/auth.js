const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { register, login, logout } = require('../controllers/auth');

const router = express.Router();

// POST /auth/join
router.post('/register', isNotLoggedIn, register);

// POST /auth/login
router.post('/login', isNotLoggedIn, login);

// GET /auth/logout
router.get('/logout', isLoggedIn, logout);

module.exports = router;