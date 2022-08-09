const mongodb = require('mongodb');
const getDb = require('../utility/database').getDb;
let Logging = require("../utility/logging");

const ObjectId = mongodb.ObjectId;

let ChangeLogs = [];

class ChangeLog {
    constructor(date, title, message) {
        this.date = date;
        this.title = title;
        this.message = message;
    }

    save() {
        const db = getDb();
        return db.collection('changelog').insertOne(this);
    }

    static GetAllChangeLogs() {
        const db = getDb();
        return db.collection("changelog")
            .find({})
            .toArray(function (err, result) {
                console.log(result);
                if (err) {
                    Logging.info("change log err" + err, 0);
                    return null;
                } else {
                    result.forEach(element => {
                        ChangeLogs.push(element);

                    });
                    Logging.info("Got All ChangeLogs", 0);
                }
            });
    }
}

module.exports = {
    CLog: ChangeLog,
    ChangeLogs: ChangeLogs
}