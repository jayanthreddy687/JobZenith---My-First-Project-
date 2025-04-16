var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var { v4: uuidv4 } = require('uuid');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var url = "mongodb://localhost:27017/recruitment";
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var MongoStore = require('connect-mongo');
var passport = require('passport');
var nodemailer = require('nodemailer');
const bcrypt = require('bcrypt')
const saltRounds = 10;
const { check, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
var flash = require('express-flash');
var app = express();
var mongodb = require('./mongodb');

app.set('trust proxy', 1)
app.use(session({
  genid: function (req) {
    return uuidv4(); // use UUIDs for session IDs
  },
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 999999999 },
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost/recruitment' })
}))
app.use(flash());



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


mongodb.connectToServer(function (err) {
  var indexRouter = require('./routes/index');
  var usersRouter = require('./routes/users');
  var loginRouter = require('./routes/login');
  var EregisterRouter = require('./routes/eregister');
  var HregisterRouter = require('./routes/rregister');
  var logoutRouter = require('./routes/logout');
  var FiltersRouter = require('./routes/filters');
  var ForgotRouter = require('./routes/forgot');
  var EprofileRouter = require('./routes/eprofile');
  var EjobappRouter = require('./routes/ejobapp');
  var AddjobRouter = require('./routes/addjob');
  var JobOpeningsRouter = require('./routes/jobopenings');
  var RjobappRouter = require('./routes/rjobapp');
  var RprofileRouter = require('./routes/rprofile');


  app.use('/', indexRouter);
  app.use('/users', usersRouter);
  app.use('/login', loginRouter);
  app.use('/eregister', EregisterRouter);
  app.use('/rregister', HregisterRouter);
  app.use('/logout', logoutRouter);
  app.use('/filters', FiltersRouter);
  app.use('/forgot', ForgotRouter);
  app.use('/eprofile', EprofileRouter);
  app.use('/ejobapp', EjobappRouter);
  app.use('/addjob', AddjobRouter);
  app.use('/jobopenings', JobOpeningsRouter);
  app.use('/rjobapp', RjobappRouter);
  app.use('/rprofile', RprofileRouter);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
})

module.exports = app;
