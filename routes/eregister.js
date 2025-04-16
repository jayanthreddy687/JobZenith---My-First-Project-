var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')
const saltRounds = 10;
const { check, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
var url = "mongodb://localhost:27017/recruitment";
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var MongoStore = require('connect-mongo');
var mongodb = require('../mongodb');
var dbCon = mongodb.getDb();

router.get('/', function (err, res) {
    res.render('eregister');
})
router.post('/signup1', urlencodedParser, [
    check('Fname', 'Please enter First name')
        .exists()
        .isAlpha(),
    check('Lname', 'Please enter Lname')
        .exists()
        .isAlpha(),
    check('email', 'Please enter valid email')
        .isEmail()
        .exists(),
    check('Sanswer', 'Please enter Sanswer')
        
        .exists(),
    
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const jay = errors.array();
        dbCon.collection("Elogindata").find({}).toArray(function (err, result) {
            if (err) throw err;
            res.render("eregister", { jay })
        })
    }
    else {
        console.log(req.body);
        var query = { 'email': req.body.email }
        var insertData = {
            "Fname": req.body.Fname,
            "Lname": req.body.Lname,
            "email": req.body.email,
            "phno": req.body.phno,
            "gender": req.body.gender
        };
        if (req.body.pwd == req.body.cpwd) {
            bcrypt.genSalt(saltRounds, function (err, salt) {
                console.log("pwd")
                bcrypt.hash(req.body.pwd, salt, function (err, hash) {
                    // Store hash in your password DB.
                    var registerData = {
                        "email": req.body.email,
                        "password": hash,
                        "SQuestion": req.body.SQuestion,
                        "Sanswer": req.body.Sanswer
                    };
                    console.log(hash);
                    dbCon.collection("Elogindata").findOne(query, function (err, res1) {
                        if (err) throw err;
                        if (res1 == null) {
                            async function fetchDatasu() {
                                var userInfo = await dbCon.collection("Euserdata").insertOne(insertData);
                                var loginInfo = await dbCon.collection("Elogindata").insertOne(registerData);
                                req.session.auth = true;
                                req.session.email = req.body.email
                                res.redirect('/eprofileedit');
                            }
                            fetchDatasu();
                        }

                        else {
                            res.redirect('/login');
                        }
                    });
                });
            });
        }
    }
})

module.exports = router;
