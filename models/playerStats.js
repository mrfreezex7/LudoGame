const mongodb = require("mongodb");
const getDb = require("../utility/database").getDb;
const shortId = require("shortid");

const ObjectId = mongodb.ObjectId;

const LvlMaxXP = 600;

class PlayerStats {
  constructor(Id, username) {
    this.userId = Id;
    this.username = username;
    this.coins = 0;
    this.xp = 100;
    this.GamesWon = 0;
    this.GamesLost = 0;
    this.AllGames = [];
    this.endpoint = "/" + this.userId.slice(0, 6);
  }

  save() {
    const db = getDb();
    return db.collection("PlayerStats").insertOne(this);
  }

  static findByDbId(id) {
    const db = getDb();
    return db
      .collection("PlayerStats")
      .findOne({ _id: new ObjectId(id) })
      .then((playerStats) => {
        return playerStats;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findByUserId(_userId) {
    const db = getDb();
    return db
      .collection("PlayerStats")
      .findOne({ userId: _userId })
      .then((PlayerStatsData) => {
        //  const lvl = this.GetCurrentLvl(PlayerStatsData.currentXP)
        // const nextXP = this.GetXPValueForNextLvl(lvl);
        const playerStats = {
          //    lvl: lvl,
          xp: PlayerStatsData.xp, //this.GetCurrentLvlXP(lvl, PlayerStatsData.currentXP, nextXP),
          //    nextXP: nextXP,
          coins: PlayerStatsData.coins,
          wonGames: PlayerStatsData.GamesWon,
          lostGames: PlayerStatsData.GamesLost,
        };
        return playerStats;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static PlayerWon(_userId) {
    const db = getDb();
    return db
      .collection("PlayerStats")
      .updateOne({ userId: _userId }, { $inc: { GamesWon: 1 } })
      .then(() => {
        return true;
      })
      .catch((err) => {
        return false;
      });
  }

  static PlayerLost(_userId) {
    const db = getDb();
    return db
      .collection("PlayerStats")
      .updateOne({ userId: _userId }, { $inc: { GamesLost: 1 } })
      .then(() => {
        return true;
      })
      .catch((err) => {
        return false;
      });
  }

  static GiveCoins(_userId, coinsValue) {
    const db = getDb();
    return db
      .collection("PlayerStats")
      .updateOne({ userId: _userId }, { $inc: { coins: coinsValue } })
      .then(() => {
        return true;
      })
      .catch((err) => {
        return false;
      });
  }

  static GiveXPCoins(_userId, xpValue, coinsValue) {
    const db = getDb();
    return db
      .collection("PlayerStats")
      .updateOne(
        { userId: _userId },
        { $inc: { xp: xpValue, coins: coinsValue } }
      )
      .then(() => {
        return true;
      })
      .catch((err) => {
        return false;
      });
  }

  static SavePlayedGamesResult(_userId, result) {
    const db = getDb();
    return db
      .collection("PlayerStats")
      .updateOne({ userId: _userId }, { $push: { AllGames: result } })
      .then(() => {
        return true;
      })
      .catch((err) => {
        return false;
      });
  }
}

module.exports = PlayerStats;
