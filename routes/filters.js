var express = require('express');
var router = express.Router();

var mongodb = require('../mongodb');
var dbCon = mongodb.getDb();

var roles, locations, types, experience;

router.get('/role/:role', function (req, res) {
    var rol = { "role": req.params.role }
    dbCon.collection("JobData").find(rol).toArray(function (err, r) {
        res.render('jobopenings', { "data": r, "role": roles, "type": types, "experience": experience, "location": locations });
    })
})
router.get('/type/:type', function (req, res) {
    var ty = { "Type": req.params.type }
    dbCon.collection("JobData").find(ty).toArray(function (err, r1) {
        res.render('jobopenings', { "data": r1, "role": roles, "type": types, "experience": experience, "location": locations });
    })
})
router.get('/location/:location', function (req, res) {
    var loc = { "location": req.params.location }
    dbCon.collection("JobData").find(loc).toArray(function (err, r2) {
        res.render('jobopenings', { "data": r2, "role": roles, "type": types, "experience": experience, "location": locations });
    })
})
router.get('/experience/:experience', function (req, res) {
    var exp = { "experience": req.params.experience }
    dbCon.collection("JobData").find(exp).toArray(function (err, r3) {
        res.render('jobopenings', { "data": r3, "role": roles, "type": types, "experience": experience, "location": locations });
    })
})

module.exports = router;
