var MongoClient = require( 'mongodb' ).MongoClient;
var ObjectId = require('mongodb').ObjectId;
var MongoStore = require('connect-mongo');
var url = "mongodb://localhost:27017/recruitment";

var dbCon;
module.exports = {
  connectToServer: function( callback ) {
    MongoClient.connect( url, function( err, client ) {
          console.log("Database created!");
        dbCon = client.db("recruitment");
        return callback( err );
    } );
  },
  getDb: function() {
    return dbCon;
  }
};