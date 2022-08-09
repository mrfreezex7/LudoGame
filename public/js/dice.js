import { stage, GetDiceSpriteSheet } from "/js/index.js";
import { SetCurrentTurn, SetDiceValue } from "/js/game-manager.js";
import {
  CheckPawns,
  DeactivateAllPawns,
  GetAllClickablePawns,
  CheckBotPon,
  GetAllLockedPons,
  AllUnlockedPons,
} from "/js/manage-pawns.js";
import { Arrow, CurrentDiceHolder, SwitchTurns } from "/js/manage-dice.js";
import { vm, socket } from "/js/events.js";
import { Players } from "/js/players.js";

export function PlayerDice(x, y, scaleX = 1, scaleY = 1, isOnline = false) {
  let dice = new createjs.Sprite(GetDiceSpriteSheet(), "start");

  this.dice = dice;
  this.diceRolled = false;
  this.isClickable = false;
  this.diceValue = 22;
  this.bot = false;
  this.isOnline = isOnline;
  this.onlineDiceValue = 0;
  dice.x = x;
  dice.y = y;
  dice.scaleX = scaleX / 82;
  dice.scaleY = scaleY / 82;

  dice.addEventListener("click", () => {
    if (!this.isOnline) {
      if (this.isClickable) {
        Arrow.setActive(false);
        createjs.Sound.play("diceRoll");
        console.log("soundPlaying");
        DeactivateAllPawns();
        dice.gotoAndPlay("roll");
        SetCurrentTurn(CurrentDiceHolder.teamColor);
        this.diceRolled = true;
        this.isClickable = false;
      }
    } else {
      if (this.isClickable) {
        this.isClickable = false;
        socket.emit("RollDice", vm.FinalOptions.GameRoom.RoomName);
        console.log("rollDiceEmitted");
        return;
      }
      //emit and get dice data from server
    }
  });

  this.diceClick = function () {
    Arrow.setActive(false);
    createjs.Sound.play("diceRoll");
    DeactivateAllPawns();
    dice.gotoAndPlay("roll");
    SetCurrentTurn(CurrentDiceHolder.teamColor);
    this.diceRolled = true;
    this.isClickable = false;
    this.bot = true;
  };

  this.onlineDiceClick = function (diceValue) {
    createjs.Sound.play("diceRoll");
    this.onlineDiceValue = diceValue;
    DeactivateAllPawns();
    this.diceRolled = true;
    dice.gotoAndPlay("roll");
    SetCurrentTurn(CurrentDiceHolder.teamColor);
    this.isClickable = false;
  };

  dice.addEventListener("animationend", () => {
    if (this.isOnline) {
      if (this.diceRolled) {
        var diceValue = this.onlineDiceValue;

        SetDiceValue(diceValue - 18);
        // this.diceValue = diceValue-18;
        dice.gotoAndStop(diceValue);
        CheckPawns(CurrentDiceHolder.teamColor);
        this.diceRolled = false;
      }
      return;
    } else if (this.diceRolled && !this.bot) {
      console.log("playerpon-click");

      if (!AllUnlockedPons(CurrentDiceHolder.teamColor)) {
        var diceValue = Math.round(Math.random() * 6) + 19;
        diceValue = diceValue >= 24 ? 24 : diceValue;
        console.log("lucky 6");
      } else {
        var diceValue = Math.round(Math.random() * 5) + 19;
        console.log("Random 6");
      }

      SetDiceValue(diceValue - 18);
      dice.gotoAndStop(diceValue);
      this.diceValue = diceValue;
      CheckPawns(CurrentDiceHolder.teamColor);
      this.diceRolled = false;
      return;
    } else if (this.bot) {
      if (!AllUnlockedPons(CurrentDiceHolder.teamColor)) {
        var diceValue = Math.round(Math.random() * 6) + 19;
        diceValue = diceValue >= 24 ? 24 : diceValue;
        console.log("lucky 6");
      } else {
        var diceValue = Math.round(Math.random() * 5) + 19;
        console.log("Random 6");
      }

      SetDiceValue(diceValue - 18);
      dice.gotoAndStop(diceValue);
      this.diceValue = diceValue;
      CheckPawns(CurrentDiceHolder.teamColor);
      this.diceRolled = false;

      diceValue = diceValue - 18;

      this.bot = false;
      this.BotLogic(diceValue);
    }
  });

  this.BotLogic = function (diceValue) {
    var pons = GetAllClickablePawns(CurrentDiceHolder.teamColor);

    if (pons.length == 1) {
      pons[0].PonClick;
      return;
    }

    var lockedPons = GetAllLockedPons(CurrentDiceHolder.teamColor);

    if (pons.length > 1) {
      for (let i = 0; i < pons.length; i++) {
        if (diceValue == 6 && lockedPons.length > 0) {
          if (CheckBotPon(pons[i], diceValue, 1)) {
            pons[i].PonClick();
            return;
          }
        } else if (CheckBotPon(pons[i], diceValue, 0)) {
          pons[i].PonClick();
          return;
        }

        if (i == pons.length - 1) {
          pons[Math.floor(Math.random() * pons.length)].PonClick();
          return;
        }
      }
    }
  };

  stage.addChild(dice);
}
