const shortid = require('shortid');
const Pons = require("./pons");

class Player {
    constructor(nickname, thumbnail, endpoint, playerColor, startDice) {
        this.nickname = nickname;
        this.thumbnail = thumbnail;
        this.endpoint = endpoint;
        this.playerColor = playerColor;
        this.StartDice = startDice;
        this.Pons = [];
    }

    CreatePons() {
        for (let i = 0; i < 4; i++) {
            this.Pons.push(new Pons(this.playerColor, shortid.generate()));
        }
    }

}

module.exports = Player;