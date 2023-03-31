const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = callBack => {
  // accessing / creating test database
  /* MongoClient.connect(
    "mongodb+srv://najathi:tMfsfowoGt1XooAO@cluster0-0bot6.mongodb.net/test?retryWrites=true&w=majority"
  ) */

  // accessing / creating shop database
  MongoClient.connect(
    "mongodb+srv://najathi:tMfsfowoGt1XooAO@cluster0-0bot6.mongodb.net/shop?retryWrites=true&w=majority"
  )
    .then(client => {
      console.log("Connected!");
      //_db = client.db('dbName');
      _db = client.db();
      callBack();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

// getDb instance db connection do
const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
