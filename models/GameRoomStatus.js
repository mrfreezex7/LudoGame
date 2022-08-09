const GameRoomLists = [];

//manages GameRoom Status like player connected or discrcooned or room createed
class GameRoomStatus {
  constructor(roomID, roomName, playerCount, roomSize) {
    this.RoomID = roomID;
    this.RoomName = roomName;
    this.PlayerCount = playerCount;
    this.RoomSize = roomSize;
  }

  IncreasePlayerCount() {
    if (this.PlayerCount < this.RoomSize) {
      this.PlayerCount++;
    } else {
      //hide or dont show the this room on the room list;
      //start the game
    }
  }

  DecreasePlayerCount() {
    this.PlayerCount--;
  }

  RemoveFromGameRoomList(roomID) {
    GameRoomLists.splice(
      GameRoomLists.findIndex((v) => v.RoomID === roomID),
      1
    );
  }
}

exports.AddToGameRoomList = (
  roomID,
  roomName,
  playerCount,
  roomSize,
  privateRoom
) => {
  if (!privateRoom) {
    let roomlist = new GameRoomStatus(roomID, roomName, playerCount, roomSize);
    GameRoomLists.push(roomlist);
    return roomlist;
  } else {
    return null;
  }
};

exports.GetGameRoomList = () => {
  return GameRoomLists;
};
