const router = require('express').Router();
const passport = require('passport');
const ChangeLog = require('../models/changeLog');
const Middleware = require('../middleware/Middleware');

router.get('/login', Middleware.isMaintenanceMode, (req, res) => {
    console.log(ChangeLog.ChangeLogs);
    console.log(req.user);
    res.render('pages/index', {
        pageTitle: "LudoGame.io - Play Ludo Game Online for Free",
        user: req.user,
        changeLog: ChangeLog.ChangeLogs,
        playerStats: null
    });
});


router.get('/logout', Middleware.isMaintenanceMode, (req, res) => {
    req.logout();
    res.redirect('/');
});


router.post('/guest', Middleware.isMaintenanceMode,
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: false
    })
);

router.get('/facebook', Middleware.isMaintenanceMode, passport.authenticate('facebook', {
    authType: 'reauthenticate',
    scope: ["email"]
}));

router.get('/facebook/callback', Middleware.isMaintenanceMode,
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/auth/login'
    }));

router.get('/google', Middleware.isMaintenanceMode, passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
    failureRedirect: '/auth/login',
}));

router.get('/google/redirect', Middleware.isMaintenanceMode, passport.authenticate('google', { failureRedirect: '/auth/login' }), (req, res) => {
    res.redirect('/');
});



module.exports = router;