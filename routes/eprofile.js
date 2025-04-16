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
        dbCon.collection("Euserdata").findOne({ "email": req.session.email }, function (err, result) {
            console.log(result)
            if (err) throw err;
            res.render('eprofile', { "data": result, "email": req.session.email });
        })
    }
})

router.get('/eprofileedit', function (req, res) {
    console.log("login sucessfullly")
    dbCon.collection("Euserdata").findOne({ "email": req.session.email }, function (err, result) {
        console.log(result)
        if (err) throw err;
        res.render('eprofileedit', { "data": result, "email": req.session.email });
    })

})
router.post('/eprofilesave', upload.single("image"), function (req, res) {
    var insertData = {
        "Fname": req.body.Fname,
        "Lname": req.body.Lname,
        "phno": req.body.phno,
        "gender": req.body.gender,
        "abt": req.body.abt,
        "skill1": req.body.Skill1,
        "skill2": req.body.Skill2,
        "skill3": req.body.Skill3,
        "skill4": req.body.Skill4,
        "skill5": req.body.Skill5,
        "experience1yr": req.body.experience1yr,
        "experience1role": req.body.experience1role,
        "experience1company": req.body.experience1company,
        "experience1abt": req.body.experience1abt,
        "experience2yr": req.body.experience2yr,
        "experience2role": req.body.experience2role,
        "experience2company": req.body.experience2company,
        "experience2abt": req.body.experience2abt,
        "experience3yr": req.body.experience3yr,
        "experience3role": req.body.experience3role,
        "experience3company": req.body.experience3company,
        "experience3abt": req.body.experience3abt,
        "proj1name": req.body.proj1name,
        "proj1sd": req.body.proj1sd,
        "proj1ed": req.body.proj1ed,
        "proj1status": req.body.proj1status,
        "proj2name": req.body.proj2name,
        "proj2sd": req.body.proj2sd,
        "proj2ed": req.body.proj2ed,
        "proj2status": req.body.proj2status,
        "proj3name": req.body.proj3name,
        "proj3sd": req.body.proj3sd,
        "proj3ed": req.body.proj3ed,
        "proj3status": req.body.proj3status,
        "proj4name": req.body.proj4name,
        "proj4sd": req.body.proj4sd,
        "proj4ed": req.body.proj4ed,
        "proj4status": req.body.proj4status,
        "proj5name": req.body.proj5name,
        "proj5sd": req.body.proj5sd,
        "proj5ed": req.body.proj5ed,
        "proj5status": req.body.proj5status,
        "fb": req.body.fb,
        "twitter": req.body.twitter,
        "linkedin": req.body.linkedin,
        "github": req.body.github,

    };
    if (req.file) {
        insertData.image = req.file.filename;
    }
    async function update() {
        var res1 = await dbCon.collection("Euserdata").updateOne({ "email": req.session.email }, { $set: insertData })
        res.redirect("/eprofile");

    }
    update()
})

module.exports = router;
