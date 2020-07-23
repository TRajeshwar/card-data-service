var MongoClient = require('mongodb').MongoClient;
var dbUrl = "mongodb://pooja:Mlab1234@cluster0-shard-00-00.cybug.mongodb.net:27017,cluster0-shard-00-01.cybug.mongodb.net:27017,cluster0-shard-00-02.cybug.mongodb.net:27017/cardDetails?ssl=true&replicaSet=atlas-8aee87-shard-0&authSource=admin&retryWrites=true&w=majority";
var collection= null;
module.exports = function (context, req) {
  MongoClient.connect(dbUrl, (err, db) => {
    let send = response(context);
    let errorMessage;
    if (err) {
      errorMessage = { "errorcode": "50003", "errormessage": "Error connecting to DB" };
      send(500, JSON.parse(JSON.stringify(errorMessage)),db);
    }
    database = db;
    console.log('MongoDB connection successful')
    var db = db.db('cardDetails');

    db.collection('cardDetails', function (err, collection) {
      collection.find({ 'sort_code': req.query.sort_code, 'account_number': req.query.account_number }).toArray(function (err, items) {
        if (err) {
          errorMessage = { "errorcode": "50002", "errormessage": "Error in searching from DB" };
          send(500, JSON.parse(JSON.stringify(errorMessage)),db);
        } else {
          if (items && items.length > 0) {
            send(200, JSON.parse(JSON.stringify(items)));
          } else {
            errorMessage = { "errorcode": "50001", "errormessage": "Data not available in DB" };
            send(500, JSON.parse(JSON.stringify(errorMessage)),db);
          }
        }
      });
    }
    );
  });
};

function response(context, connection) {
  return function (status, body) {
    context.res = {
      status: status,
      body: body
    };
    if(connection) {
      connection.close();
    }
    context.done();
  };
}