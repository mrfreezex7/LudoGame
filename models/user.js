const mongodb = require('mongodb');
const getDb = require('../utility/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
    constructor(Id, username, email, thumbnail) {
        this.userId = Id;
        this.username = username;
        this.email = email;
        this.nickname = "Nickname";
        this.thumbnail = thumbnail;
        this.endpoint = '/' + this.userId.slice(0, 6);
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    static findByDbId(id) {
        const db = getDb();
        return db
            .collection('users')
            .findOne({ "_id": new ObjectId(id) })
            .then(user => {
                return user;
            })
            .catch(err => {
                console.log(err);
            })
    }

    static findByUserId(_userId) {
        const db = getDb();
        return db
            .collection('users')
            .findOne({ userId: _userId })
            .then(user => {
                return user;
            })
            .catch(err => {
                console.log(err);
            })
    }

    static UpdateNickname(_userId, _nickname) {
        const db = getDb();
        return db
            .collection('users')
            .updateOne({ userId: _userId }, { $set: { nickname: _nickname.substring(0, 15) } })
            .then(() => {
                return true;
            })
            .catch(err => {
                return false;
            })
    }

}

module.exports = User;
