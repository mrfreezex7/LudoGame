
const router = require('express').Router();
const PlayerStats = require('../models/playerStats');
const Contact = require('../models/contact');
const ChangeLog = require('../models/changeLog');
const Middleware = require('../middleware/Middleware');

//console.log(ChangeLog.GetAllChangeLogs())

const authCheck = (req, res, next) => {
    if (!req.user) {
        res.redirect('/auth/login');
    } else {
        next();
    }
};



router.get('/', Middleware.isMaintenanceMode, authCheck, (req, res) => {
    console.log(ChangeLog.ChangeLogs);
    PlayerStats.findByUserId(req.user.userId)
        .then(playerStats => {
            console.log(playerStats);
            res.render('pages/index', { pageTitle: "LudoGame.io - Play Ludo Game Online for Free", user: req.user, changeLog: ChangeLog.ChangeLogs, playerStats: playerStats });
        })
        .catch(err => {
            res.render('pages/index', { pageTitle: "LudoGame.io - Play Ludo Game Online for Free", user: req.user, changeLog: ChangeLog.ChangeLogs, PlayerStats: null });
        })

});

router.post('/contactSupport', Middleware.isMaintenanceMode, (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let subject = req.body.subject;

    new Contact(name, email, subject)
        .save()
        .then(() => {
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/');
        })


})

router.get('/privacy', Middleware.isMaintenanceMode, (req, res) => {
    res.render('pages/privacy');
})





router.get('/relogin', Middleware.isMaintenanceMode, (req, res) => {
    console.log("posing");
    req.logIn(req.user, function (err) {
        if (err) {
            return res.redirect('/');
        }
        return res.redirect('/');
    });
})


module.exports = router;