var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

var mongodb = require('../mongodb');
var dbCon = mongodb.getDb();

router.get('/', function (req, res) {

    var query = {
        "email": req.session.email
    }
    dbCon.collection("applieddata").find(query).toArray(function (err, result2) {
        console.log(result2)
        res.render("ejobapp", { "data": result2 })

    });

})

router.post("/apply/:id", function (req, res) {
    var query = {
        "_id": ObjectId(req.params.id)
    };
    if (req.session.auth == true) {
        dbCon.collection("JobData").findOne(query, function (err, res1) {
            dbCon.collection("Euserdata").findOne({ "email": req.session.email }, function (err, result) {
                var sat = "pending";
                var query2 = {
                    "Fname": result.Fname,
                    "Lname": result.Lname,
                    "email": result.email,
                    "phno": result.phno,
                    "skill1": result.skill1,
                    "skill2": result.skill2,
                    "skill3": result.skill3,
                    "skill4": result.skill4,
                    "skill5": result.skill5,
                    "resume": result.resume,
                    "role": res1.role,
                    "Remail": res1.email,

                };
                var query3 = {
                    "role": res1.role,
                    "email": result.email,
                    "Remail": res1.email,
                    "company": res1.company,
                    "salary": res1.salary,
                    "experience": res1.experience,
                    "Type": res1.Type,
                    "location": res1.location,
                    "JobDescription": res1.JobDescription,
                    "status": sat

                }
                dbCon.collection("recivedappdata").insertOne(query2, function (err, result1) {
                    console.log("inserted sucessfully");
                })
                dbCon.collection("applieddata").insertOne(query3, function (err, result1) {
                    console.log("inserted sucessfully");
                })
            })
            var res2 = res1.email;
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
                    subject: "Application for job",
                    text: note + ' for more details contact ' + res3
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                res.redirect("/ejobapp");
            }
            else {

                res.redirect("/jobopenings");
            }
        });
    }
    else {
        res.redirect("/login")
    }
})

module.exports = router;
