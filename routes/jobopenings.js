var express = require('express');
var router = express.Router();
var mongodb = require('../mongodb');
var dbCon = mongodb.getDb();

router.get('/', function (req, res) {
    dbCon.collection("JobData").find({}).toArray(function (err, result) {
        console.log(result)
        if (err) throw err;
        async function fetchDatasu() {

            roles = await dbCon.collection('JobData').distinct('role')
            types = await dbCon.collection('JobData').distinct('Type')
            experience = await dbCon.collection('JobData').distinct('experience')
            locations = await dbCon.collection('JobData').distinct('location')

            console.log(roles);
            res.render('jobopenings', { "data": result, "role": roles, "type": types, "experience": experience, "location": locations });
        }
        fetchDatasu();
    })

})
router.get('/rjobopenings', function (req, res) {
    dbCon.collection("JobData").find({}).toArray(function (err, result) {
        console.log(result)
        if (err) throw err;
        async function fetchDatasu() {
            roles = await dbCon.collection('JobData').distinct('role')
            types = await dbCon.collection('JobData').distinct('Type')
            experience = await dbCon.collection('JobData').distinct('experience')
            locations = await dbCon.collection('JobData').distinct('location')

            console.log(roles);
            res.render('rjobopenings', { "data": result, "role": roles, "type": types, "experience": experience, "location": locations });
        }
        fetchDatasu();
    })

})
router.get('/ejobopenings', function (req, res) {
    dbCon.collection("JobData").find({}).toArray(function (err, result) {
        console.log(result)
        if (err) throw err;
        async function fetchDatasu() {
            roles = await dbCon.collection('JobData').distinct('role')
            types = await dbCon.collection('JobData').distinct('Type')
            experience = await dbCon.collection('JobData').distinct('experience')
            locations = await dbCon.collection('JobData').distinct('location')

            console.log(roles);
            res.render('ejobopenings', { "data": result, "role": roles, "type": types, "experience": experience, "location": locations });
        }
        fetchDatasu();
    })

})

module.exports = router;
