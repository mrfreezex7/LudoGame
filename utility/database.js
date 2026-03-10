const MongoClient = require("mongodb").MongoClient;
const keys = require("../config/keys");

const url = keys.mongodb.dbURI;
const dbName = "LudoGame";

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
      if (err) {
        console.log("MongoDB connection error:", err);
        return;
      }

      console.log("Connected successfully to MongoDB");

      _db = client.db(dbName);
      callback(client);
    },
  );
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.getDb = getDb;
exports.mongoConnect = mongoConnect;
