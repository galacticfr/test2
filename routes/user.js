const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../util/wrapAsync');
const user = require('../controller/user');

router.route('/register')
    .get(user.renderSignup)
    .post(wrapAsync(user.signup));

router.route('/login')
    .get(user.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.login);

router.get('/logout', user.logout);

module.exports = router;