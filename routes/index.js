var express = require('express');
var router = express.Router();
const seguirController = require("../controllers/seguirAlumno");
const passport = require('passport');
const { models } = require('../models');
const {isNotLoggedIn, isLoggedIn} = require('../controllers/link')


////////////////////////////LOGIN/////////////////////////////
/* GET home page. */
router.get('/', isNotLoggedIn, function (req, res, next) {
  let success = req.flash('success')[0];
  res.locals.success=success;
  let message = req.flash('message')[0];
  res.locals.message=message;
  res.render('login');
});

router.post('/', (req, res, next) => {
  passport.authenticate('local.signin', {
    successRedirect: '/game',
    failureRedirect: '/',
    failureFlash: true
  })(req, res, next);}
)

router.get('/close', function (req, res, next) {
  res.locals.success=null;
  res.locals.message=null;
  res.redirect('/');
});

////////////////////////////////REGISTER///////////////////////

router.get('/register', function (req, res, next) {
  let message = req.flash('message')[0];
  res.locals.message=message;
  let success = req.flash('success')[0];
  res.locals.success=success;
  res.render('register');
})

router.post('/register', (req, res, next) => {
  passport.authenticate('local.signup', {
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash: true
  }) (req, res, next);}
);

/////////////////////////////LOGOUT///////////////////////////

router.get('/logout', isLoggedIn, function (req, res, next) {
  req.logOut();
  res.redirect('/');
})

////////////////////////////GAME///////////////////////////////

router.get('/game', isLoggedIn, function (req, res, next) {
  res.render('game');
}
);

router.post('/game', seguirController.seguimiento);

module.exports = router;
