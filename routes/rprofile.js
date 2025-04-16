var express = require('express');
var router = express.Router();
var mongodb = require('../mongodb');
var dbCon = mongodb.getDb();
var multer = require('multer')


const storage = multer.diskStorage({
    destination: function (request, file, callback) {
      callback(null, './public/images');
    },
    filename: function (request, file, callback) {
      callback(null, Date.now() + file.originalname);
    },
  });
  const upload = multer({
    storage: storage,
    limits: {
      fieldSize: 300 * 300,
    },
  }); 

router.get('/', function (req, res) {
    console.log("login sucessfullly")
    if (req.session.auth == true) {
      dbCon.collection("Ruserdata").findOne({ "email": req.session.email }, function (err, result) {
        console.log(result)
        if (err) throw err;
        res.render('rprofile', { "data": result });
      })
    }
  })
  router.get('/rprofileedit', function (req, res) {
    dbCon.collection("Ruserdata").findOne({ "email": req.session.email }, function (err, resultr) {
      console.log(resultr)
      res.render('rprofileedit', { "data": resultr })
    })
  })
  router.post('/rprofilesave', upload.single("image"), function (req, res) {
    dbCon.collection("Ruserdata").findOne({ "email": req.body.email }, function (err, results) {
      var iData = {
        "Fname": req.body.Fname,
        "Lname": req.body.Lname,
        "phno": req.body.phno,
        "company": req.body.company,
        "Address": req.body.Address,
        "profession": req.body.profession,
        "fb": req.body.fb,
        "twitter": req.body.twitter,
        "instagram": req.body.instagram,
        "website": req.body.website,
        "github": req.body.github
      };
      if (req.file) {
        iData.image = req.file.filename;
      }
      console.log(results)
      if (err) throw err;
      dbCon.collection("Ruserdata").updateOne({ "email": req.session.email }, { $set: iData }, function (err, res1) {
        res.redirect('/rprofile');
      })
    })
  })

  module.exports = router;
