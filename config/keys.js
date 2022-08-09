module.exports = {
    maintenance: {
        current: process.env.MAINTENANCE_MODE
    },
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },
    facebook: {
        facebookAppID: process.env.FACEBOOK_APP_ID,
        facebookAppSecret: process.env.FACEBOOK_APP_SECRET
    },
    mongodb: {
        dbURI: process.env.MONGO_DB
    },
    session: {
        cookieKey: process.env.COOKIE_KEY
    }

};
