let User = require("./models/user");
let GameRoom = require("./models/GameRoom");
let PlayerStats = require("./models/playerStats");
let PlayerSession = require("./models/playerSession");
let Logging = require("./utility/logging");
let GlobalChat = require("./models/globalChats");
let GameRoomStatus = require("./models/GameRoomStatus");

exports.SocketConnect = (io) => {
	io.on("connection", (socket) => {
		let userObject = false;
		let gameRoom = false;
		console.log(socket.handshake.session.passport);
		if (typeof socket.handshake.session.passport !== "undefined" && typeof socket.handshake.session.passport.user !== "undefined" && (typeof socket.handshake.session.passport.user._id !== "undefined" || typeof socket.handshake.session.passport.user.s_id !== "undefined")) {
			userObject = socket.handshake.session.passport.user;
			console.log(userObject.username + " connected");

			socket.emit("user", userObject);

			// console.log(socket.id);
			let playerSession = PlayerSession.IsPlayerInSession(userObject.userId);

			Logging.info(userObject.username + " connected", userObject.userId);

			socket.on("GetPlayerSession", (callback) => {
				if (playerSession == false) {
					PlayerSession.AddPlayerInSession(userObject.userId);
					Logging.info("Original Session", userObject.userId);
					playerSession = true;
				} else if (playerSession == true) {
					playerSession = false;
					Logging.info("Same Session Opened on Another tab", userObject.userId);
				}
				callback(playerSession);
			});

			socket.emit("GetGlobalChats", {globalChats: GlobalChat.GetChats()});

			socket.on("UpdateNickname", (nickname, callback) => {
				User.UpdateNickname(userObject.userId, nickname)
					.then((result) => {
						callback(result);
					})
					.catch((err) => {
						console.log(err);
						callback(false);
					});
			});

			socket.on("getGameSession", (callback) => {
				callback(userObject.userId);
			});

			socket.on("TwoPlayerStatus", (result) => {
				if (result.isWinner) {
					PlayerStats.PlayerWon(userObject.userId);
					PlayerStats.GiveXPCoins(userObject.userId, 110, 80);
					Logging.info("Got 110 Xp and 80 Coins", userObject.userId);
				} else if (!result.isWinner) {
					PlayerStats.PlayerLost(userObject.userId);
					PlayerStats.GiveXPCoins(userObject.userId, 60, 30);
					Logging.info("Got 60 Xp and 30 Coins", userObject.userId);
				}

				if (result.GameData) {
					PlayerStats.SavePlayedGamesResult(userObject.userId, result.GameData);
				}
			});

			socket.on("ThreePlayerStatus", (result) => {
				let PlayerObject = result.GameData;

				if (PlayerObject) {
					if (PlayerObject.Rank === 1) {
						PlayerStats.GiveXPCoins(userObject.userId, 200, 150);
						Logging.info("Got 200 Xp and 150 Coins", userObject.userId);
					} else if (PlayerObject.Rank === 2) {
						PlayerStats.GiveXPCoins(userObject.userId, 150, 100);
						Logging.info("Got 150 Xp and 100 Coins", userObject.userId);
					} else {
						PlayerStats.GiveXPCoins(userObject.userId, 80, 50);
						Logging.info("Got 80 Xp and 50 Coins", userObject.userId);
					}

					PlayerStats.SavePlayedGamesResult(userObject.userId, PlayerObject);
				}
			});

			socket.on("FourPlayerStatus", (result) => {
				let PlayerObject = result.GameData;

				if (PlayerObject) {
					if (PlayerObject.Rank === 1) {
						PlayerStats.GiveXPCoins(userObject.userId, 300, 250);
						Logging.info("Got 300 Xp and 250 Coins", userObject.userId);
					} else if (PlayerObject.Rank === 2) {
						PlayerStats.GiveXPCoins(userObject.userId, 200, 150);
						Logging.info("Got 200 Xp and 150 Coins", userObject.userId);
					} else if (PlayerObject.Rank === 3) {
						PlayerStats.GiveXPCoins(userObject.userId, 150, 100);
						Logging.info("Got 150 Xp and 100 Coins", userObject.userId);
					} else {
						PlayerStats.GiveXPCoins(userObject.userId, 80, 50);
						Logging.info("Got 80 Xp and 50 Coins", userObject.userId);
					}

					PlayerStats.SavePlayedGamesResult(userObject.userId, PlayerObject);
				}
			});

			socket.on("GlobalChatMessage", ({msg}, callback) => {
				if (msg.trim()) {
					GlobalChat.AddChat(userObject.username, msg);
					io.emit("GlobalChatMessage", {username: userObject.username, msg: msg});
					callback(true);
				} else {
					callback(false);
				}
			});

			//online play
			socket.on("JoinLobby", () => {
				JoinLobby(socket);
			});

			socket.on("LeaveLobby", () => {
				LeaveLobby(socket);
			});

			socket.on("GetGameRoomList", () => {
				socket.emit("AllActiveGameRoomList", GameRoomStatus.GetGameRoomList());
			});

			socket.on("CreateRoom", (CreateRoomDetails, callback) => {
				console.log(CreateRoomDetails);
				gameRoom = GameRoom.CreateRoom(CreateRoomDetails.RoomName, CreateRoomDetails.RoomSize, CreateRoomDetails.PrivateRoom);
				if (gameRoom) {
					//  const rooms = Object.keys(socket.rooms);
					socket.join(gameRoom.RoomID, () => {
						gameRoom.AddPlayer(userObject);
						socket.emit("GetRoomPlayers", gameRoom.GetGameRoomData());
						// io.in("GameLobby").emit("AddToGameRoomList", gameRoom.GameRoomStatus);
						callback({RoomSize: gameRoom.RoomSize, PrivateRoomID: gameRoom.PrivateRoomID});

						// if (gameRoom.IsRoomFull()) {
						//     io.in(gameRoom.RoomName).emit('StartGame', { gameRoom });
						// }
					});
				} else {
					callback(false);
				}
			});

			socket.on("JoinRoom", (roomID, userData, callback) => {
				// const rooms = Object.keys(socket.rooms);
				let finalRoomID;
				if (userData.privateRoomID !== "") {
					finalRoomID = GameRoom.GetPrivateRoomID(userData.privateRoomID);
				} else {
					finalRoomID = roomID;
				}
				console.log(finalRoomID);
				GameRoom.JoinRoom(finalRoomID, userData, (room) => {
					gameRoom = room;
					if (gameRoom) {
						socket.join(gameRoom.RoomID, () => {
							io.in(gameRoom.RoomID).emit("GetRoomPlayers", gameRoom.GetGameRoomData());
							callback(gameRoom.RoomSize);
							if (gameRoom.IsRoomFull()) {
								io.in(gameRoom.RoomID).emit("RoomFullStartingGame");
								gameRoom.StartGame();
							}
						});
					} else {
						callback(false);
					}
				});
			});

			socket.on("ExitRoom", (roomID, userData, callback) => {
				GameRoom.LeaveRoom(roomID, userData, (gameRoom) => {
					if (gameRoom) {
						socket.leave(gameRoom.RoomID, () => {
							io.in(gameRoom.RoomID).emit("GetRoomPlayers", gameRoom.GetGameRoomData());
							callback(true);
						});
					} else {
						callback(false);
					}
				});
			});

			socket.on("RollDice", () => {
				var diceValue = gameRoom.RollDice();
				console.log(diceValue);
				io.in(gameRoom.RoomID).emit("RollDice", diceValue);
			});

			socket.on("ponClick", (data) => {
				console.log(data);
				socket.to(gameRoom.RoomID).emit("ponClick", {TeamColor: data.TeamColor, NetworkId: data.NetworkId});
			});

			socket.on("disconnect", () => {
				if (userObject) {
					Logging.info(+userObject.username + " disconnected", userObject.userId);
					if (gameRoom) {
						socket.leave(gameRoom.RoomID);
						GameRoom.LeaveRoom(gameRoom.RoomID, userObject, (gameRoom) => {
							if (gameRoom) {
								socket.leave(gameRoom.RoomID, () => {
									io.in(gameRoom.RoomID).emit("GetRoomPlayers", gameRoom.GetGameRoomData());
								});
							}
						});
					}
					if (playerSession) {
						PlayerSession.RemovePlayerFromSession(userObject.userId);
					}
					console.log(PlayerSession.GetAllSessions());
				}

				console.log("a user disconnected");
			});
		}
	});
};

function JoinLobby(socket) {
	socket.join("GameLobby");
}

function LeaveLobby(socket) {
	socket.leave("GameLobby");
}
