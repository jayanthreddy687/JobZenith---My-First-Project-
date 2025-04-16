var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

var mongodb = require('../mongodb');
var dbCon = mongodb.getDb();


router.get('/', (req, res) => {
    res.render('forgot')
})
router.post('/forget', urlencodedParser, [
    check('email', 'This user-name must be atleat 4 characters long and only characters')
        .isEmail()
        .exists(),
    check('SQuestion', 'Please Select Security Question')
        .exists(),
    check('email', 'Please Enter Answer')
        .exists(),

], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const jay = errors.array({ onlyFirstError: true });
        res.render('forgot', { jay })
    }
    else {
        var forgot = { 'email': req.body.email, 'Sanswer': req.body.Sanswer };
        console.log(forgot)
        async function change() {
            var res1 = await dbCon.collection("Elogindata").findOne(forgot)
            var res2 = await dbCon.collection("Rlogindata").findOne(forgot)

            if (res1 != null) {
                res.render("password");
            }
            else if (res2 != null) {
                res.render("password")
            }
            else {
                res.redirect("/forgot")
            }
        }
        change();

    }
})

router.post('/password', (req, res) => {


    if (req.body.pwd == req.body.cpwd) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            console.log("pwd")
            bcrypt.hash(req.body.pwd, salt, function (err, hash) {
                // Store hash in your password DB.
                var registerData = {
                    "password": hash,
                };
                async function t() {
                    var res1 = await dbCon.collection("Elogindata").updateOne({ "email": req.body.email }, { $set: registerData })
                    var res2 = await dbCon.collection("Rlogindata").updateOne({ "email": req.body.email }, { $set: registerData })
                    req.flash('message', 'Password changed sucessfully');
                    res.redirect('/login');
                }
                t();

            })
        })
    }
    else {
        res.redirect("/forgot");
    }
})

module.exports = router;
