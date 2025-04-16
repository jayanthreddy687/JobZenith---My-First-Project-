var express = require('express');
var router = express.Router();
var mongodb = require('../mongodb');
var dbCon = mongodb.getDb();

router.post('/', function (req, res) {
    var Jobdata = {
      "email": req.session.email,
      "role": req.body.role,
      "company": req.body.company,
      "salary": req.body.salary,
      "experience": req.body.Years,
      "Type": req.body.Type,
      "location": req.body.Location,
      "JobDescription": req.body.JobD
    }
    dbCon.collection("JobData").insertOne(Jobdata, function (err, result) {
      if (err) throw err;
      res.redirect('/rprofile');
    })
  });

  module.exports = router;
