import { SetBoardPlayerDetails } from "/js/players.js";
import { GetGameBoard, GetFinalOptions } from "/js/options.js";
import { BuildBoard } from "/js/board.js";
import { StoreSpawnedPonsOnPlayers, SpawnAllPawns } from "/js/manage-pawns.js";
import { ActivateDice } from "/js/manage-dice.js";
import { stage } from "/js/index.js";

export let currentTurn = "";
export let diceValue = "";

export function StartGame() {

    SetBoardPlayerDetails(GetFinalOptions());
    BuildBoard(GetGameBoard());
    SpawnAllPawns();
    StoreSpawnedPonsOnPlayers();
    ActivateDice();


    createjs.Ticker.on("tick", stage);
    createjs.Ticker.timingMode = createjs.Ticker.RAF;

}


//Getter And Setters
export function SetCurrentTurn(teamColor) {
    currentTurn = teamColor;
}

export function SetDiceValue(value) {
    diceValue = value;
}

export function GetCurrentTurn(teamColor) {
    return currentTurn;
}

export function GetDiceValue(value) {
    return diceValue;
}

export function QuitGame() {
    //remove current gameSession
    document.location.reload(false);
}