var MongoClient = require('mongodb').MongoClient;
var dbUrl = 'mongodb://azurecosmostest1:L46XJChy9tpiAEAI8wJLhDgUXKnzXN8STiXgIKU2FsiEdKzqQK1DgFdMhxG2gVEIklxyFo4594UX08I2a7Jquw%3D%3D@azurecosmostest1.documents.azure.com:10255/?ssl=true&replicaSet=globaldb';
// using funcpack now
//

module.exports = function (context, req) {
  MongoClient.connect(dbUrl, (err, db) => {
    let send = response(context);
    let errorMessage;
    if (err) {
      errorMessage = { "errorcode": "50003", "errormessage": "Error connecting to DB" };
      send(500, JSON.parse(JSON.stringify(errorMessage)));
    }
    database = db;
    console.log('MongoDB connection successful')
    var db = db.db('cardDetails');
    db.collection('cardDetails', function (err, collection) {
      collection.find({ 'sort_code': req.body.sort_code, 'account_number': req.body.account_number }).toArray(function (err, items) {
        if (err) {
          errorMessage = { "errorcode": "50002", "errormessage": "Error in searching from DB" };
          send(500, JSON.parse(JSON.stringify(errorMessage)));
        } else {
          if (items && items.length > 0) {
            send(200, JSON.parse(JSON.stringify(items)));
          } else {
            errorMessage = { "errorcode": "50001", "errormessage": "Data not available in DB" };
            send(500, JSON.parse(JSON.stringify(errorMessage)));
          }
        }
      });
    }
    );
  });
};

function response(context) {
  return function (status, body) {
    context.res = {
      status: status,
      body: body
    };
    context.done();
  };
}
