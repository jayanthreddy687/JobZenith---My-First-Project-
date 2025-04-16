var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')
const passport = require('passport');
var flash = require('express-flash');

const GoogleStrategy = require('passport-google-oauth2').Strategy;
const GOOGLE_CLIENT_ID = '';
const GOOGLE_CLIENT_SECRET = '';
var data;

var mongodb = require('../mongodb');
var dbCon = mongodb.getDb();

router.use(flash());


router.get('/', function (req, res) {
  res.render('login', { message: req.flash('message') });
});
router.post('/validate', (req, res) => {
  var type = req.body.type;
  var details = { 'email': req.body.email };

  console.log(type);
  
  if (type == 1) {
    dbCon.collection("Rlogindata").findOne(details, function (err, res1) {
      if (err) throw err;
      console.log(res1);
      if (req.body.pwd) {
        bcrypt.compare(req.body.pwd, res1.password, function (err, result) {
          if (result == true) {
            console.log(req.session);
            req.session.auth = true;
            req.session.email = req.body.email;
            var email1 = req.session.email;
            res.redirect('/rprofile');
          }

          else {
            req.flash('message', 'Enter correct password');
            res.redirect('/login');
          }
        });
      }
      else {
        req.flash('message', 'Enter correct credentials');
        res.redirect('/login');
      }

    });
  }
  else if (type == 2) {
    dbCon.collection("Elogindata").findOne(details, function (err, res1) {
      if (err) throw err;
      console.log(res1);
      if (req.body.pwd) {
        bcrypt.compare(req.body.pwd, res1.password, function (err, result) {
          if (result == true) {
            req.session.auth = true;
            req.session.email = req.body.email;
            email = req.session.email;
            res.redirect('/eprofile');
          }

          else {
            req.flash('message', 'Enter correct password');
            res.redirect('/login');
          }
        });

      }
      else {
        req.flash('message', 'Enter correct credentials');
        res.redirect('/login');
      }
    });

  }
  else {
    req.flash('message', 'Please select role');
    res.redirect('/login');

  }
})

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/login/gmail/callback",
  passReqToCallback: true,
},
  function (request, accessToken, refreshToken, profile, done) {
    data = profile;
    return done(null, profile);
  }));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
router.get('/gmail',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get('/gmail/callback',
  passport.authenticate('google', {
    successRedirect: '/login/gmaillogin',
    failureRedirect: '/auth/google/failure'
  })
);

router.get('/gmaillogin', function (req, res) {

  var query = { "email": data.email }
  async function fetchData() {
    var empInfo = await dbCon.collection("Elogindata").findOne(query);
    var RecInfo = await dbCon.collection("Rlogindata").findOne(query);
    if (empInfo == null && RecInfo == null) {
      res.redirect('/eregister')
    }
    if (empInfo != null) {
      req.session.auth = true;
      req.session.email = data.email;
      email = req.session.email;
      res.redirect('/eprofile');
    }
    if (RecInfo != null) {
      req.session.auth = true;
      req.session.email = data.email;
      email = req.session.email;
      res.redirect('/rprofile');
    }
  }
  fetchData();


});
module.exports = router;
