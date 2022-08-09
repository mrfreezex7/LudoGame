const Player = require("./player");
const GameRoomStatus = require("./GameRoomStatus");
const shortId = require("shortid");

const Rooms = [];
const PrivateRooms = {};

let io;

exports.SocketConnect = (S_io) => {
	io = S_io;
};

//manages games like player data and pons
class GameRoom {
	constructor(roomID, roomName, roomSize, privateRoom) {
		this.RoomID = roomID;
		this.RoomName = roomName;
		this.Players = [];
		this.RoomSize = roomSize;
		this.StartDiceColor = this.GetStartDiceColor();
		this.GameRoomStatus = GameRoomStatus.AddToGameRoomList(roomID, roomName, 0, roomSize, privateRoom);
		this.GameStarted = false;
		this.PrivateRoom = privateRoom;
		this.PrivateRoomID = null;
	}

	AddPlayer({nickname, thumbnail, endpoint}) {
		if (this.Players.length < this.RoomSize) {
			const player = new Player(nickname, thumbnail, endpoint, this.GetAvaliablePlayerColor(this.RoomSize), this.StartDiceColor);
			player.CreatePons();
			this.Players.push(player);
			if (!this.PrivateRoom) {
				this.GameRoomStatus.IncreasePlayerCount();
				io.in("GameLobby").emit("UpdateGameRoomList", this.GameRoomStatus);
			}
		}

		console.log(this.Players);
	}

	RemovePlayer({nickname, endpoint}) {
		this.Players.splice(
			this.Players.findIndex((v) => v.endpoint === endpoint),
			1
		);
		if (!this.PrivateRoom) {
			this.GameRoomStatus.DecreasePlayerCount();
		}
		console.log(this.Players);

		if (this.Players.length <= 0) {
			this.RemoveRoomFromRooms(this.RoomID);
			if (!this.PrivateRoom) {
				this.GameRoomStatus.RemoveFromGameRoomList(this.RoomID);
				io.in("GameLobby").emit("RemoveGameRoomFromList", this.GameRoomStatus);
			}
		} else {
			if (!this.PrivateRoom) {
				io.in("GameLobby").emit("UpdateGameRoomList", this.GameRoomStatus);
			}
		}
	}

	RemoveRoomFromRooms(roomID) {
		Rooms.splice(
			Rooms.findIndex((v) => v.RoomID === roomID),
			1
		);
	}

	GetRoomPlayers() {
		return this.Players;
	}

	GetRoomName() {
		return this.RoomName;
	}

	StartGame() {
		setTimeout(() => {
			if (this.IsRoomFull()) {
				console.log("starting game");
				console.log(this);
				io.in(this.RoomID).emit("StartGame", {gameRoom: this});
				this.GameStarted = true;
				if (!this.PrivateRoom) {
					this.GameRoomStatus.RemoveFromGameRoomList(this.RoomID);
					io.in("GameLobby").emit("RemoveGameRoomFromList", this.GameRoomStatus);
				}
			}
		}, 3000);
	}

	GetGameRoomData() {
		return {
			RoomID: this.RoomID,
			RoomName: this.RoomName,
			RoomPlayers: this.Players,
			RoomSize: this.RoomSize,
		};
	}

	IsRoomFull() {
		if (this.Players.length == this.RoomSize) {
			return true;
		} else {
			return false;
		}
	}

	GetAvaliablePlayerColor(roomSize) {
		if (roomSize == 2) {
			switch (this.Players.length + 1) {
				case 1:
					return "red";
				case 2:
					return "yellow";
			}
		} else if (roomSize == 3) {
			switch (this.Players.length + 1) {
				case 1:
					return "red";
				case 2:
					return "blue";
				case 3:
					return "yellow";
			}
		} else if (roomSize == 4) {
			switch (this.Players.length + 1) {
				case 1:
					return "red";
				case 2:
					return "blue";
				case 3:
					return "yellow";
				case 4:
					return "green";
			}
		}
	}

	RollDice() {
		return Math.round(Math.random() * 5) + 19;
	}

	GetStartDiceColor() {
		return "red";
	}
}

exports.CreateRoom = (roomName, roomSize, privateRoom = false) => {
	let room;
	let RoomSize = parseInt(roomSize);
	if (!isNaN(RoomSize)) {
		room = new GameRoom(Rooms.length + 1, roomName, RoomSize, privateRoom);
	} else {
		room = new GameRoom(Rooms.length + 1, roomName, 2, privateRoom);
	}
	if (room.PrivateRoom) {
		room.PrivateRoomID = shortId.generate(6);
		PrivateRooms[room.PrivateRoomID] = room.RoomID;
	}
	Rooms.push(room);
	console.log(PrivateRooms);
	console.log("New Room Created");
	return room;
};

exports.GetRoom = (roomName) => {
	for (let i = 0; i < Rooms.length; i++) {
		if (Rooms[i].RoomName == roomName) {
			return Rooms[i];
		}
	}

	return null;
};

exports.GetAllRooms = () => {
	return Rooms;
};

exports.GetPrivateRoomID = (privateRoomID) => {
	return PrivateRooms[privateRoomID];
};

exports.JoinRoom = (roomID, userData, callback) => {
	let room = Rooms[Rooms.findIndex((v) => v.RoomID === roomID)];

	if (room) {
		if (room.IsRoomFull()) {
			callback(false);
		} else {
			room.AddPlayer(userData);
			callback(room);
		}
	} else {
		console.log("no room with that id available");
		callback(null);
	}
};

exports.LeaveRoom = (roomID, userData, callback) => {
	let room = Rooms[Rooms.findIndex((v) => v.RoomID === roomID)];

	if (room) {
		room.RemovePlayer(userData);
		callback(room);
	} else {
		console.log("no room with that id available");
		callback(null);
	}
};
