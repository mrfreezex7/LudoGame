import {DiceHolder} from "/js/board-details.js";
import {MainPlayer, Players, PlayerData, AllPlayers} from "/js/players.js";
import {GetSelectedGameMode} from "/js/options.js";
import {PlayerDice} from "/js/dice.js";
import {vm, socket} from "/js/events.js";
import {PlayerArrow} from "/js/arrow.js";

export let CurrentPlayerData;
export let CurrentDiceHolder;
export let Dice;
export let Arrow;
let SelectedGameMode;

export function ActivateDice() {
	SelectedGameMode = GetSelectedGameMode();

	if (SelectedGameMode == "computer") {
		CurrentDiceHolder = GetDiceHolder(Players[parseInt(Math.random() * Math.floor(Players.length))].teamColor);
		CurrentPlayerData = GetPlayerData(CurrentDiceHolder.teamColor);

		Dice = new PlayerDice(CurrentDiceHolder.x, CurrentDiceHolder.y, CurrentDiceHolder.size, CurrentDiceHolder.size);
		Arrow = new PlayerArrow(CurrentDiceHolder.x, CurrentDiceHolder.y, CurrentDiceHolder.size, CurrentDiceHolder.size, CurrentDiceHolder.teamColor);

		SwitchTurns();
		return;
	} else if (SelectedGameMode == "local") {
		for (let i = 0; i < Players.length; i++) {
			if (!Players[i].isWinner && Players[i].isOwner) {
				CurrentDiceHolder = GetDiceHolder(Players[i].teamColor);
				CurrentPlayerData = GetPlayerData(CurrentDiceHolder.teamColor);

				Dice = new PlayerDice(CurrentDiceHolder.x, CurrentDiceHolder.y, CurrentDiceHolder.size, CurrentDiceHolder.size);
				Arrow = new PlayerArrow(CurrentDiceHolder.x, CurrentDiceHolder.y, CurrentDiceHolder.size, CurrentDiceHolder.size, CurrentDiceHolder.teamColor);
				SwitchTurns();
				return;
			}
		}
	} else if (SelectedGameMode == "online") {
		for (let i = 0; i < Players.length; i++) {
			if (Players[i].OnlinePlayer.StartDice == "red") {
				CurrentDiceHolder = GetDiceHolder(Players[i].teamColor);
				CurrentPlayerData = GetPlayerData(CurrentDiceHolder.teamColor);

				Dice = new PlayerDice(CurrentDiceHolder.x, CurrentDiceHolder.y, CurrentDiceHolder.size, CurrentDiceHolder.size, true);
				SwitchTurns();
				return;
			} else {
				CurrentDiceHolder = GetDiceHolder(Players[i].teamColor);
				CurrentPlayerData = GetPlayerData(CurrentDiceHolder.teamColor);

				Dice = new PlayerDice(CurrentDiceHolder.x, CurrentDiceHolder.y, CurrentDiceHolder.size, CurrentDiceHolder.size, true);
				SwitchTurns();
				return;
			}
		}
	}
}

export function RerunDice() {
	if (!CurrentPlayerData.isOnline) {
		if (CurrentPlayerData.isOwner) {
			Arrow.setActive(true);
			Dice.isClickable = true;
		} else {
			Arrow.setActive(true);
			setTimeout(() => {
				Dice.diceClick();
			}, 50);
		}
	} else {
		if (CurrentPlayerData.isOwner) {
			Dice.isClickable = true;
		} else {
			Dice.isClickable = false;
		}
	}
}

export function GetNextDiceHolder() {
	const PlayerIndex = RemoveNonPlayers();
	for (let i = 0; i < Players.length; i++) {
		if (CurrentDiceHolder.teamColor == Players[i].teamColor) {
			if (i < Players.length - 1) {
				CurrentDiceHolder = GetDiceHolder(Players[++i].teamColor);
			} else {
				CurrentDiceHolder = GetDiceHolder(Players[0].teamColor);
			}
		}
	}

	CurrentPlayerData = GetPlayerData(CurrentDiceHolder.teamColor);

	if (PlayerIndex != undefined) {
		AllPlayers.push(Players[PlayerIndex]);
		Players.splice(PlayerIndex, 1);
	}

	if (Players.length <= 1) {
		AllPlayers.push(Players[0]);

		//GameOver
		console.log("GameOver");
		Dice.dice.visible = false;
		Dice.isClickable = false;

		createjs.Sound.play("pawnHome");
	}

	if (Players.length <= 1) {
		if (vm.SelectedPlayers == "two") {
			SetTwoPlayerLeaderBoard(AllPlayers);
		} else if (vm.SelectedPlayers == "three") {
			SetThreePlayerLeaderBoard(AllPlayers);
		} else if (vm.SelectedPlayers == "four") {
			SetFourPlayerLeaderBoard(AllPlayers);
		}
		//Show FireWorks

		//go to main menu
		//show ads
	} else {
		SwitchTurns();
	}
}

function SetTwoPlayerLeaderBoard(AllPlayers) {
	let TwoPlayerDataObject = [];

	console.log(AllPlayers);
	AllPlayers.some((player) => {
		if (player.playerLeft && !player.isOwner) {
			TwoPlayerDataObject = {
				isWinner: true,
				isOpponentLeft: true,
			};
			return true;
		}
	});

	if (TwoPlayerDataObject.length === 0) {
		AllPlayers.some((player) => {
			if (player.isOwner) {
				TwoPlayerDataObject = {
					isWinner: player.winningRank == 1 ? true : false,
					isOpponentLeft: false,
				};
				return true;
			}
		});
	}

	console.log(TwoPlayerDataObject);

	const data = {
		winnerData: TwoPlayerDataObject,
		playerName: AllPlayers[0].playerName,
		winningRank: AllPlayers[0].winningRank,
	};
	console.log(data);

	vm.ShowPlayerGameOverScreen(2, {TwoPlayerData: data}, null);
	console.log(TwoPlayerDataObject);
}

function SetThreePlayerLeaderBoard(AllPlayers) {
	const ThreePlayerDataObject = [];
	let rank = 3;

	AllPlayers.forEach((player) => {
		if (player.playerLeft && player.winningRank == 0) {
			player.winningRank = rank--;
		} else if (!player.playerLeft && player.winningRank == 0) {
			player.winningRank = rank--;
		}
	});

	console.log(AllPlayers);

	for (let i = 0; i < AllPlayers.length; i++) {
		console.log(AllPlayers[i].playerName + " Rank = " + AllPlayers[i].winningRank);
		ThreePlayerDataObject.push({
			name: AllPlayers[i].playerName,
			profilePic: AllPlayers[i].playerThumbnail,
			rank: AllPlayers[i].winningRank,
			playerLeft: AllPlayers[i].playerLeft,
		});
	}
	vm.ShowPlayerGameOverScreen(3, null, ThreePlayerDataObject);
}

function SetFourPlayerLeaderBoard(AllPlayers) {
	const FourPlayerDataObject = [];
	let rank = 4;

	AllPlayers.forEach((player) => {
		if (player.playerLeft && player.winningRank == 0) {
			player.winningRank = rank--;
		} else if (!player.playerLeft && player.winningRank == 0) {
			player.winningRank = rank--;
		}
	});

	console.log(AllPlayers);
	//Show learderboard
	for (let i = 0; i < AllPlayers.length; i++) {
		console.log(AllPlayers[i].playerName + " Rank = " + AllPlayers[i].winningRank);
		FourPlayerDataObject.push({
			name: AllPlayers[i].playerName,
			profilePic: AllPlayers[i].playerThumbnail,
			rank: AllPlayers[i].winningRank,
			playerLeft: AllPlayers[i].playerLeft,
		});
	}
	vm.ShowPlayerGameOverScreen(4, null, FourPlayerDataObject);
}

export function SwitchTurns() {
	if (!CurrentPlayerData.isOnline) {
		if (CurrentPlayerData.isOwner) {
			Dice.dice.x = CurrentDiceHolder.x;
			Dice.dice.y = CurrentDiceHolder.y;
			Dice.dice.scaleX = CurrentDiceHolder.size / 82;
			Dice.dice.ScaleY = CurrentDiceHolder.size / 82;
			Arrow.update(CurrentDiceHolder.x, CurrentDiceHolder.y, CurrentDiceHolder.teamColor);
			console.log("position updataed 1");
			Dice.isClickable = true;
		} else {
			Dice.dice.x = CurrentDiceHolder.x;
			Dice.dice.y = CurrentDiceHolder.y;
			Dice.dice.scaleX = CurrentDiceHolder.size / 82;
			Dice.dice.ScaleY = CurrentDiceHolder.size / 82;
			Arrow.update(CurrentDiceHolder.x, CurrentDiceHolder.y, CurrentDiceHolder.teamColor);
			console.log("position updataed 2");
			setTimeout(() => {
				Dice.diceClick();
			}, 500);
		}
	} else {
		if (CurrentPlayerData.isOwner && !CurrentPlayerData.playerLeft) {
			Dice.dice.x = CurrentDiceHolder.x;
			Dice.dice.y = CurrentDiceHolder.y;
			Dice.dice.scaleX = CurrentDiceHolder.size / 82;
			Dice.dice.ScaleY = CurrentDiceHolder.size / 82;
			Dice.isClickable = true;
		} else if (!CurrentPlayerData.playerLeft) {
			Dice.dice.x = CurrentDiceHolder.x;
			Dice.dice.y = CurrentDiceHolder.y;
			Dice.dice.scaleX = CurrentDiceHolder.size / 82;
			Dice.dice.ScaleY = CurrentDiceHolder.size / 82;
			Dice.isClickable = false;
		} else {
			GetNextDiceHolder();
		}
	}
}

export function RemoveNonPlayers() {
	let removePlayerIndex = undefined;
	let nonPlayerIndex = undefined;

	for (let i = 0; i < Players.length; i++) {
		if (Players[i].isWinner || Players[i].playerLeft) {
			nonPlayerIndex = i;
			break;
		}
	}

	if (nonPlayerIndex != undefined) {
		removePlayerIndex = nonPlayerIndex;
		// Players.splice(wonPlayerIndex, 1);
	}

	return removePlayerIndex;
	//Set Leaderboard
}

function GetDiceHolder(teamColor) {
	switch (teamColor) {
		case "red":
			return DiceHolder.red;
		case "blue":
			return DiceHolder.blue;
		case "yellow":
			return DiceHolder.yellow;
		case "green":
			return DiceHolder.green;
	}
}

function GetPlayerData(teamColor) {
	switch (teamColor) {
		case "red":
			return PlayerData.red;
		case "blue":
			return PlayerData.blue;
		case "yellow":
			return PlayerData.yellow;
		case "green":
			return PlayerData.green;
	}
}
