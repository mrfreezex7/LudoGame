const mongodb = require('mongodb');
const getDb = require('../utility/database').getDb;

const ObjectId = mongodb.ObjectId;

class Contact {
    constructor(name, mail, subject) {
        this.name = name;
        this.mail = mail;
        this.subject = subject;
    }

    save() {
        const db = getDb();
        return db.collection('contact').insertOne(this);
    }
}

module.exports = Contact;