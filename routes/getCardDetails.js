var express = require('express');
var router = express.Router();
/*var mongoose = require('mongoose');*/
var MongoClient = require('mongodb').MongoClient;
var database = undefined;
var dbUrl ='mongodb://127.0.0.1:27017/cardDetails';

/* GET  listing. */
router.get('/:userId', function(req, res, next) {
  console.log(req.params.userId);
  var userId = req.params.userId;
  /*res.status(200).json({"Reason Code": "200","Success Message":"User Id present"});
  mongoose.model('cardDetails').find(function(err, cardDetails)
  {
    res.send(cardDetails);
  });*/
  MongoClient.connect(dbUrl, function(err,db){
    if (err){
      res.status(200).json({"errorcode":"50003","errormessage":"Error connecting to DB"});
    }else
    {
        database = db;
        console.log('MongoDB connection successful');
        var db = db.db('cardDetails');
        db.collection('cardDetails', function (err, collection) {
        
          collection.find({'id':userId}).toArray(function(err, items) {
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

router.post('/', function(req, res, next) {
  var searchJson = req.body;
  console.log('Id: '+searchJson.id);
  MongoClient.connect(dbUrl, function(err,db){
    if (err){
      res.status(200).json({"errorcode":"50003","errormessage":"Error connecting to DB"}); 
    }else
    {
        database = db;
        console.log('MongoDB connection successful');
        var db = db.db('cardDetails');
        db.collection('cardDetails', function (err, collection) {
        
          collection.find({'id':searchJson.id} && {'brand':searchJson.brand}).toArray(function(err, items) {
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