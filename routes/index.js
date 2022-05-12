var express = require('express');
var router = express.Router();
const seguirController = require("../controllers/seguirAlumno");
const resultController = require("../controllers/resultados");
const indexController = require("../controllers/index");
const gameController = require("../controllers/game");
const createController = require("../controllers/createGame");
const passport = require('passport');
const { models } = require('../models');
const {isNotLoggedIn, isLoggedIn, isAdmin} = require('../controllers/link')


////////////////////////////PARAMS/////////////////////////////

// Autoload for routes using :quizId
router.param('sceneId', indexController.load);

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
    successRedirect: '/index',
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
    successRedirect: '/index',
    failureRedirect: '/register',
    failureFlash: true
  }) (req, res, next);}
);

/////////////////////////////LOGOUT///////////////////////////

router.get('/logout', isLoggedIn, function (req, res, next) {
  req.logOut();
  res.redirect('/');
})

/////////////////////////INDEX/////////////////////////////

router.get('/index', isLoggedIn, indexController.index);
router.post('/enabled/:sceneId(\\d+)', isLoggedIn, isAdmin, indexController.enabled);
router.get('/delete/:sceneId(\\d+)', isLoggedIn, isAdmin, indexController.delete);




router.get('/edit/:sceneId(\\d+)/:message?', isLoggedIn, isAdmin, indexController.showEdit);
router.post('/edit/:sceneId(\\d+)', isLoggedIn, isAdmin, indexController.edit);

/////////////////////////CREATE/////////////////////////////
router.post('/create', isLoggedIn, isAdmin, createController.crear);
router.get('/createShow/:question/:json?', isLoggedIn, isAdmin, createController.createShow);
router.post('/download', isLoggedIn, isAdmin, createController.download);


/////////////////////////RESULTADOS/////////////////////////////

router.get('/results', isLoggedIn, isAdmin, resultController.resultados);
router.get('/results/:sceneId', isLoggedIn, isAdmin, resultController.gameResults);
router.post('/filter', isLoggedIn, isAdmin, resultController.filter);

////////////////////////////GAME///////////////////////////////

router.post('/escena', isLoggedIn, seguirController.escenas);

router.get('/game/:json', isLoggedIn, gameController.game);

router.post('/game/:json', seguirController.seguimiento);

router.post('/answers/:type?/:json', seguirController.answers);

//QUITAAAAAAAR
//router.get('/final', isLoggedIn, indexController.index);
//router.get('/kkk/:json', isLoggedIn, isAdmin, indexController.kkk);

module.exports = router;
