const MongoClient = require('mongodb').MongoClient;
const keys = require('../config/keys');
const assert = require('assert');

const url = keys.mongodb.dbURI;

const dbName = 'LudoGame';

let _db;

const mongoConnect = callback => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        _db = client.db(dbName);
        callback(client);
    });
}



const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!';
};

exports.getDb = getDb;
exports.mongoConnect = mongoConnect;