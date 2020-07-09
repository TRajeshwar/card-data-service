var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

var database = undefined;

const dotenv = require('dotenv');
dotenv.config();
//POST implementation
router.post('/', function(req, res, next) {
  var searchJson = req.body;
  console.log('Account_Number: '+searchJson.account_number);
  MongoClient.connect(process.env.CosmosDBConnectionString, function(err,db){
    if (err){
      res.status(200).json({"errorcode":"50003","errormessage":"Error connecting to DB"}); 
    }else
    {
        database = db;
        console.log('MongoDB connection successful')
        var db = db.db('cardDetails');
        db.collection('cardDetails', function (err, collection) {
        
          collection.find({'sort_code':searchJson.sort_code , 'account_number':searchJson.account_number}).toArray(function(err, items) {
             if(err) {
              res.status(200).json({"errorcode":"50002","errormessage":"Error in searching from DB"});  
             }
             if(items && items.length>0 ){  
               res.status(200).json(items); 
             } else {
              res.status(200).json({"errorcode":"50001","errormessage":"Data not available in DB"});
             }         
         });
         
     });
       
    }
  } 
  ); 	  
});

module.exports = router ;
