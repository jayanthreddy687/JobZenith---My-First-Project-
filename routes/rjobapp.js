var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

var mongodb = require('../mongodb');
var dbCon = mongodb.getDb();


router.get('/', function (req, res) {

    var query = {
        "Remail": req.session.email
    }
    console.log(query)
    dbCon.collection("recivedappdata").find(query).toArray(function (err, result3) {
        console.log(result3)
        res.render("rjobapp", { "data": result3 })

    });
})

router.get('/eprofileview/:email', (req, res) => {
    var profile = {
        "email": req.params.email
    }
    dbCon.collection("Euserdata").findOne(profile, function (err, result) {
        res.render('eprofileview', { "data": result })
    })
})

router.get('/accept/:email/:role/:id', function (req, res) {

    var query = {
      "email": req.params.email,
      "role": req.params.role,
    };
  
    dbCon.collection("applieddata").findOne(query, function (err, resu) {
      var sat = "accepted"
      var insert = {
        "status": sat
      };
      var res2 = resu.email;
      var res3 = req.session.email;
      var note = req.body.addnote;
      console.log(res2);
      console.log(res3);
      if (err) throw err;
      if (res2 != null && res3 != null) {
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'tempa1662@gmail.com',
            pass: '8519934331'
          }
        });
        var mailOptions = {
          from: 'tempa1662@gmail.com',
          to: res2,
          subject: "Congratulations for Getting job",
          text: note + ' for more details contact ' + res3
        };
  
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
      dbCon.collection("applieddata").updateOne(query, { $set: insert }, function (err, reult) {
        console.log(reult)
        res.redirect("/rjobapp")
      });
      dbCon.collection("recivedappdata").deleteOne(query, function (err, re) {
        console.log("deleted")
      })
  
    })
  })
  router.get('/reject/:email/:role', function (req, res) {

    var query = {
      "email": req.params.email,
      "role": req.params.role,
    };
    dbCon.collection("applieddata").findOne(query, function (err, resu) {
      console.log(resu + "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
      var sat = "rejected"
      var insert = {
        "status": sat
      };
      dbCon.collection("applieddata").updateOne(query, { $set: insert }, function (err, re) {
        console.log(res)
        res.redirect("/rjobapp")
      });
      dbCon.collection("recivedappdata").deleteOne(query, function (err, re) {
        console.log("deleted")
      })
      var res2 = resu.email;
      var res3 = req.session.email;
      var note = req.body.addnote;
      console.log(res2);
      console.log(res3);
      if (err) throw err;
      if (res2 != null && res3 != null) {
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'tempa1662@gmail.com',
            pass: '8519934331'
          }
        });
        var mailOptions = {
          from: 'tempa1662@gmail.com',
          to: res2,
          subject: "Your job application is rejected",
          text: note + ' for more details contact ' + res3
        };
  
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
    })
  })

  module.exports = router;
