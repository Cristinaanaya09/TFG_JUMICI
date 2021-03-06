var createError = require('http-errors');
var express = require('express');
const session = require('express-session')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var partials = require('express-partials'); 
var passport = require('passport')
var indexRouter = require('./routes/index');
var flash = require('connect-flash');

const multer = require('multer');




var app = express();
require('./controllers/passport');

// view engine setup AQUÍ INDICAS DONDE ESTÁ LA CARPETA VIEWS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); //********* */

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'bla bla bla' 
}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//VARIABLES GLOBALES
app.use((req, res, next)=>{
  app.locals.success = req.flash('success');
  app.locals.messages = req.flash('messages');
  //app.locals.success = req.flash('success');
  app.locals.load = null;
  next();
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
