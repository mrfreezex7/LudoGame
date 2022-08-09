import {Board_1, Board_2, Board_3, Board_4, PawnSpawnCirle1, PawnSpawnCirle2, PawnSpawnCirle3, PawnSpawnCirle4, CenterDesign, RedData, BlueData, YellowData, GreenData, BottomLeftOffset, BottomRightOffset, TopLeftOffset, TopRightOffset, DiceHolder} from "/js/board-details.js";
import {vm} from "/js/events.js";
import {DefaultTeamColors, GetThreePlayerTeamColor} from "/js/options.js";
import {GetBoardDataObject, GetSecondPlayerColor} from "/js/board-utility.js";
import {GetRandomImagePath} from "/js/utils.js";
import {SetRankValue} from "/js/manage-pawns.js";
import {CurrentDiceHolder, GetNextDiceHolder} from "/js/manage-dice.js";

export let MainPlayer;

let rank = 1;

export let Players = [];
export let AllPlayers = [];
export let PlayerData = {
	red: {isOwner: false, isOnline: false},
	blue: {isOwner: false, isOnline: false},
	yellow: {isOwner: false, isOnline: false},
	green: {isOwner: false, isOnline: false},
};

export function SetBoardPlayerDetails(FinalOption) {
	Players = [];

	switch (FinalOption.SelectedMode) {
		case "computer":
			switch (FinalOption.SelectedPlayers) {
				case "two":
					CreatePlayerAndBot("two", FinalOption.SelectedColor);
					break;
				case "three":
					CreatePlayerAndBot("three", FinalOption.SelectedColor);
					break;
				case "four":
					CreatePlayerAndBot("four", FinalOption.SelectedColor);
					break;
			}
			break;
		case "local":
			switch (FinalOption.SelectedPlayers) {
				case "two":
					CreateLocalPlayers("two", FinalOption.SelectedColor);
					break;
				case "three":
					CreateLocalPlayers("three", FinalOption.SelectedColor);
					break;
				case "four":
					CreateLocalPlayers("four", FinalOption.SelectedColor);
					break;
			}
			break;
		case "online":
			switch (FinalOption.SelectedPlayers) {
				case "two":
					CreateOnlinePlayers("two", FinalOption.GameRoom.Players);
					break;
				case "three":
					CreateOnlinePlayers("three", FinalOption.GameRoom.Players);
					break;
				case "four":
					CreateOnlinePlayers("four", FinalOption.GameRoom.Players);
					break;
			}
			break;
	}
}

function CreatePlayerAndBot(PlayerCount, PlayerColor) {
	if (PlayerCount == "two") {
		MainPlayer = Players.push(new Player(vm.PlayerNickname == "" ? "Guest" : vm.PlayerNickname, vm.GetProfilePicURL(), PlayerColor, true, false));
		Players.push(new Player("Bot" + 1, GetRandomImagePath(), GetSecondPlayerColor(PlayerColor), false, false));
		console.log(Players);
	} else if (PlayerCount == "three") {
		let TeamColor = GetThreePlayerTeamColor();
		console.log(TeamColor);
		for (let i = 0; i < TeamColor.length; i++) {
			if (PlayerColor == TeamColor[i]) {
				MainPlayer = Players.unshift(new Player(vm.PlayerNickname == "" ? "Guest" : vm.PlayerNickname, vm.GetProfilePicURL(), PlayerColor, true, false));
			} else {
				Players.unshift(new Player("Bot" + i, GetRandomImagePath(), TeamColor[i], false, false));
			}
		}
	} else if (PlayerCount == "four") {
		for (let i = 0; i < DefaultTeamColors.length; i++) {
			if (PlayerColor == DefaultTeamColors[i]) {
				MainPlayer = Players.unshift(new Player(vm.PlayerNickname == "" ? "Guest" : vm.PlayerNickname, vm.GetProfilePicURL(), PlayerColor, true, false));
			} else {
				Players.unshift(new Player("Bot" + i, GetRandomImagePath(), DefaultTeamColors[i], false, false));
			}
		}
	}
}

function CreateLocalPlayers(PlayerCount, PlayerColor) {
	console.log(PlayerCount);
	if (PlayerCount == "two") {
		Players.push(new Player(vm.LocalPlayers.red, GetRandomImagePath(), "red", true, false));
		Players.push(new Player(vm.LocalPlayers.yellow, GetRandomImagePath(), "yellow", true, false));
	} else if (PlayerCount == "three") {
		console.log("creating local player");
		Players.unshift(new Player(vm.LocalPlayers.red, GetRandomImagePath(), "red", true, false));
		Players.unshift(new Player(vm.LocalPlayers.yellow, GetRandomImagePath(), "yellow", true, false));
		Players.unshift(new Player(vm.LocalPlayers.green, GetRandomImagePath(), "green", true, false));
	} else if (PlayerCount == "four") {
		for (const key in vm.LocalPlayers) {
			if (vm.LocalPlayers.hasOwnProperty(key)) {
				const name = vm.LocalPlayers[key];
				Players.unshift(new Player(name, GetRandomImagePath(), key, true, false));
			}
		}
	}
}

function CreateOnlinePlayers(PlayerCount, PlayerData) {
	console.log(PlayerData);
	if (PlayerCount == "two") {
		console.log(PlayerData);
		PlayerData.forEach((player) => {
			if (vm.PlayerData.endpoint == player.endpoint) {
				MainPlayer = Players.push(new Player(player.nickname == "" ? "Guest" : player.nickname, player.thumbnail == "" ? "/img/avatar/UserAvatar.png" : player.thumbnail, player.playerColor, true, true, player));
			} else {
				Players.push(new Player(player.nickname == "" ? "Guest" : player.nickname, player.thumbnail == "" ? "/img/avatar/UserAvatar.png" : player.thumbnail, player.playerColor, false, true, player));
			}
		});
	} else if (PlayerCount == "three") {
		PlayerData.forEach((player, index) => {
			console.log(player.playerColor);
			if (vm.PlayerData.endpoint == player.endpoint) {
				MainPlayer = Players.push(new Player(player.nickname == "" ? "Guest" : player.nickname, player.thumbnail == "" ? "/img/avatar/UserAvatar.png" : player.thumbnail, player.playerColor, true, true, player));
			} else {
				Players.push(new Player(player.nickname == "" ? "Guest" : player.nickname, player.thumbnail == "" ? "/img/avatar/UserAvatar.png" : player.thumbnail, player.playerColor, false, true, player));
			}
		});
	} else if (PlayerCount == "four") {
		PlayerData.forEach((player, index) => {
			console.log(player.playerColor);
			if (vm.PlayerData.endpoint == player.endpoint) {
				MainPlayer = Players.push(new Player(player.nickname == "" ? "Guest" : player.nickname, player.thumbnail == "" ? "/img/avatar/UserAvatar.png" : player.thumbnail, player.playerColor, true, true, player));
			} else {
				Players.push(new Player(player.nickname == "" ? "Guest" : player.nickname, player.thumbnail == "" ? "/img/avatar/UserAvatar.png" : player.thumbnail, player.playerColor, false, true, player));
			}
		});
	}

	console.log(Players);
}

//Player Object
function Player(playerName, playerThumbnail, teamColor, isOwner, isOnline = false, player = null) {
	this.playerName = playerName;
	this.playerThumbnail = playerThumbnail;
	this.teamColor = teamColor;
	this.isOwner = isOwner;
	//this.playerLvl = playerLvl;
	this.isOnline = isOnline;
	this.OnlinePlayer = player;
	this.pons = [];
	this.isWinner = false;
	this.winningRank = 0;
	this.playerLeft = false;

	GetBoardDataObject(teamColor).playerName.text = this.playerName;
	GetBoardDataObject(teamColor).playerImage.thumbnail = this.playerThumbnail;
	//GetBoardDataObject(teamColor).playerLevel.text = this.playerLvl;
	SetPlayerObjectData(teamColor, this.isOwner, this.isOnline);
	//set pon object color here
}

function SetPlayerObjectData(teamColor, isOwner, isOnline) {
	switch (teamColor) {
		case "red":
			PlayerData.red.isOwner = isOwner;
			PlayerData.red.isOnline = isOnline;
			break;
		case "blue":
			PlayerData.blue.isOwner = isOwner;
			PlayerData.blue.isOnline = isOnline;
			break;
		case "yellow":
			PlayerData.yellow.isOwner = isOwner;
			PlayerData.yellow.isOnline = isOnline;
			break;
		case "green":
			PlayerData.green.isOwner = isOwner;
			PlayerData.green.isOnline = isOnline;
			break;
	}
}

export function SetPlayerLeft(playerColor) {
	Players.forEach((player) => {
		if (player.teamColor == playerColor) {
			player.playerLeft = true;
			if (CurrentDiceHolder.teamColor == player.teamColor) {
				GetNextDiceHolder();
			} else if (vm.SelectedPlayers === "two") {
				GetNextDiceHolder();
			}
		}
	});
}
