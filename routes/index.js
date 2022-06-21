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
// router.param('sceneId', indexController.load);

////////////////////////////LOGIN/////////////////////////////
/* GET home page. */
router.get('/', isNotLoggedIn, function (req, res, next) {
  //let success = req.flash('success')[0];
  //res.locals.success=success;
  let message = req.flash('messages')[0];
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


router.post('/deleteAction', isLoggedIn, isAdmin, createController.deleteAction);
router.get('/getActions', isLoggedIn, isAdmin, createController.sendActions);


router.get('/indexCreate/:json?', isLoggedIn, isAdmin, createController.indexCreate);
router.post('/createJSON', isLoggedIn, isAdmin, createController.createJSON);
router.get('/backgroundView', isLoggedIn, isAdmin, createController.backgroundView);
router.post('/background', isLoggedIn, isAdmin, createController.background);
router.get('/characterView', isLoggedIn, isAdmin, createController.characterView);
router.post('/loadCharacter', isLoggedIn, isAdmin, createController.loadCharacter);
router.get('/dialogView', isLoggedIn, isAdmin, createController.dialogView);
router.post('/dialog', isLoggedIn, isAdmin, createController.dialog);
router.get('/testView', isLoggedIn, isAdmin, createController.testView);
router.post('/test', isLoggedIn, isAdmin, createController.test);
router.get('/finalView', isLoggedIn, isAdmin, createController.finalView);
router.post('/final', isLoggedIn, isAdmin, createController.final);


/////////////////////////RESULTADOS/////////////////////////////

router.get('/results', isLoggedIn, isAdmin, resultController.resultados);
router.get('/results/:sceneId', isLoggedIn, isAdmin, resultController.gameResults);
router.post('/filter', isLoggedIn, isAdmin, resultController.filter);

////////////////////////////GAME///////////////////////////////

//router.post('/escena', isLoggedIn, seguirController.escenas);

router.get('/game/:json', isLoggedIn, gameController.game);

router.post('/game/:json', seguirController.seguimiento);

router.post('/answers/:type?/:json', seguirController.answers);

//
/////////////////////////////////////


router.get('/graphics/:json', isLoggedIn, isAdmin, resultController.graphics);



///////////////////////////UPLOAD IMAGES//////////////////////////////////////

const multer = require('multer');
const path = require('path');

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/game/images/characters')
  },
  filename: function (req, file, cb) {
    cb(null, + Date.now()+'-' +file.originalname)
  },
})



let storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/game/images/backgrounds')
  },
  filename: function (req, file, cb) {
    cb(null, + Date.now()+'-' +file.originalname)
  },
})

let storage3 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/app')
  },
  filename: function (req, file, cb) {
    cb(null, + Date.now()+'-' +file.originalname)
  },
})


var upload = multer({ storage: storage,  fileFilter: function (req, file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  console.log("aquiestamos: " + mimetype)
  const extname = filetypes.test(path.extname(file.originalname))
  console.log(extname)
  if(mimetype && extname){
    cb(null, true);
  }else{
  cb(null, false);
  }
}, 
})

var uploadBackground = multer({ storage: storage2,  fileFilter: function (req, file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  console.log("aquiestamos2: " + mimetype)
  const extname = filetypes.test(path.extname(file.originalname))
  console.log(extname)
  if(mimetype && extname){
    cb(null, true);
  }else{
    cb(null, false);
  }
}, 
})

var uploadGame = multer({ storage: storage3,  fileFilter: function (req, file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname))
  if(mimetype && extname){
    cb(null, true);
  }else{
    cb(null, false);
  }
}, 
})


router.post('/uploadfile', isLoggedIn, isAdmin, upload.single('char'), (req, res, next) => {
  const file = req.file
  console.log(file)
  if (!file) {
    req.flash('messages', 'File must be an image')
    res.redirect('/backgroundView')
  }
    console.log(req.originalUrl)
    console.log(req.body.number)
    req.flash('success', 'The image has been download correctly');
    res.redirect('/characterView?number='+req.body.number);
  
})


router.post('/upload/background', isLoggedIn, isAdmin, uploadBackground.single('background'), (req, res, next) => {
  const file = req.file
  console.log(file)
  if (!file) {
    req.flash('messages', 'You must upload a valid image')
    res.redirect('/backgroundView')
  }
    req.flash('success', 'The image has been download correctly');
    console.log(req.originalUrl)
    res.redirect('/backgroundView');
  
})


router.post('/upload/game', isLoggedIn, isAdmin, uploadGame.single('game'), (req, res, next) => {
  const file = req.file
  console.log(file)
  if (!file) {
    res.redirect('/createShow/wrongImage')
  }
    console.log(req.originalUrl)
    res.redirect('/createShow/false')
  
})













module.exports = router;
