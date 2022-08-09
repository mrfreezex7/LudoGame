const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const keys = require("./keys");
const User = require("../models/user");
const shortid = require("shortid");
const PlayerStats = require("../models/playerStats");

passport.serializeUser((user, done) => {
  User.findByUserId(user.userId).then((currentUser) => {
    if (currentUser) {
      done(null, currentUser);
    } else {
      done(null, user);
    }
  });
});

passport.deserializeUser((userdata, done) => {
  done(null, userdata);
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "username",
    },
    function (username, password, done) {
      const newUser = new User(
        shortid.generate(),
        username.substring(0, 15) + "(Guest)",
        "test@guest.com",
        "/img/Geust-Icon.png"
      );
      newUser.g_id = shortid.generate();
      newUser.type = "guest";
      return done(null, newUser);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: keys.facebook.facebookAppID,
      clientSecret: keys.facebook.facebookAppSecret,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "displayName", "picture.type(large)"],
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      User.findByUserId(profile.id).then((currentUser) => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          new User(
            profile.id,
            profile.displayName,
            profile.emails[0].value,
            "https://graph.facebook.com/" +
              profile.id +
              "/picture?width=80&height=80"
          ) //profile._json.picture.data.url)
            .save()
            .then((newUser) => {
              new PlayerStats(profile.id, profile.displayName)
                .save()
                .then(() => {
                  return done(null, newUser.ops[0]);
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        }
      });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      // options for google strategy
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
      callbackURL: "/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      User.findByUserId(profile.id).then((currentUser) => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          new User(
            profile.id,
            profile.displayName,
            profile.emails[0].value,
            profile._json.picture + "=s80"
          )
            .save()
            .then((newUser) => {
              new PlayerStats(profile.id, profile.displayName)
                .save()
                .then(() => {
                  return done(null, newUser.ops[0]);
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        }
      });
    }
  )
);
