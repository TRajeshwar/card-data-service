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
        throw err;
    }else
    {
        database = db;
        console.log('MongoDB connection successful');
        var db = db.db('cardDetails');
        db.collection('cardDetails', function (err, collection) {
        
          collection.find({'id':userId}).toArray(function(err, items) {
             if(err) throw err;    
             console.log(items);   
             res.status(200).json(items);          
         });
         
     });
       
    }
  }
  );
});

router.post('/:userId', function(req, res, next) {
  console.log(req.body);
  res.status(200).json({"Error Code": "4001","Error Message":"Request method not allowed"});	  	  
});

module.exports = router ;