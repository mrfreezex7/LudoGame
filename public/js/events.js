import { init, LoadAssets, PreloadComplete } from "/js/index.js";
import { QuitGame } from "/js/game-manager.js";
import { Dice } from "/js/manage-dice.js";
import { GetAllPawns } from "/js/manage-pawns.js";
import { SetPlayerLeft } from "/js/players.js";

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }

  return "";
}

function post(path, params, method = "post") {
  // The rest of this code assumes you are not using a library.
  // It can be made less wordy if you use one.
  const form = document.createElement("form");
  form.method = method;
  form.action = path;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const hiddenField = document.createElement("input");
      hiddenField.type = "hidden";
      hiddenField.name = key;
      hiddenField.value = params[key];

      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
}

export let vm = new Vue({
  el: "#app",
  data() {
    return {
      GlobalChats: [],
      ChatMessage: "",
      ActiveSession: true,
      ShowCookieConsent: false,
      ShowNetworkError: false,
      LoggedIn: false,
      IsGuest: true,
      PlayerXp: 0,
      PlayerStats: {
        lvl: 0,
        xp: 0,
        nextXP: 0,
        coins: 0,
        wonGames: 0,
        lostGames: 0,
      },

      GamesWonCounter: 0,
      GamesLostCounter: 0,
      PlayerData: {
        id: "",
        playerName: "",
        nickName: "",
        thumbnail: "",
        endpoint: "",
      },
      ShowMenuBG: false,
      ShowContactForm: false,
      ShowChangelog: false,
      ShowSettings: false,
      PlayerNickname: "",
      ShowNicknameLoader: false,
      ShowNicknameSelectionMenu: true,
      ShowModeSelectionMenu: false,
      SelectedMode: 0,
      SelectedPlayers: 0,
      SelectedColor: 0,
      LocalPlayers: {
        red: "",
        blue: "",
        yellow: "",
        green: "",
      },
      FinalOptions: undefined,
      GameQuitAlert: false,
      GameoverLeaderBoardAlert: false,
      GameoverPlayerLeaderboard: {
        Two: {
          isWinner: false,
          isOpponentLeft: false,
        },
        Three: {
          p1: {
            isWinner: false,
            isOpponentLeft: false,
            name: "",
            profilePic: "",
          },
          p2: {
            isWinner: false,
            isOpponentLeft: false,
            name: "",
            profilePic: "",
          },
          p3: {
            isWinner: false,
            isOpponentLeft: false,
            name: "",
            profilePic: "",
          },
        },
        Four: {
          p1: {
            isWinner: false,
            isOpponentLeft: false,
            name: "",
            profilePic: "",
          },
          p2: {
            isWinner: false,
            isOpponentLeft: false,
            name: "",
            profilePic: "",
          },
          p3: {
            isWinner: false,
            isOpponentLeft: false,
            name: "",
            profilePic: "",
          },
          p4: {
            isWinner: false,
            isOpponentLeft: false,
            name: "",
            profilePic: "",
          },
        },
      },
      StartGame: false,
      LobbyJoined: false,
      GameRoomList: [],
      ShowCreateMatchContainer: false,
      ShowRoomDetailsContainer: false,
      CreateRoomDetails: {
        RoomName: "",
        RoomSize: 2,
        PrivateRoom: false,
        PrivateRoomID: "",
      },
      RoomDetails: {
        RoomID: null,
        RoomName: "",
        RoomStatus: "",
        RoomPlayers: {
          Two: {
            Player1: {
              nickname: "",
              thumbnail: "",
              playerColor: "",
              playerLeft: false,
            },
            Player2: {
              nickname: "",
              thumbnail: "",
              playerColor: "",
              playerLeft: false,
            },
          },
          Three: {
            Player1: {
              nickname: "",
              thumbnail: "",
              playerColor: "",
              playerLeft: false,
            },
            Player2: {
              nickname: "",
              thumbnail: "",
              playerColor: "",
              playerLeft: false,
            },
            Player3: {
              nickname: "",
              thumbnail: "",
              playerColor: "",
              playerLeft: false,
            },
          },
          Four: {
            Player1: {
              nickname: "",
              thumbnail: "",
              playerColor: "",
              playerLeft: false,
            },
            Player2: {
              nickname: "",
              thumbnail: "",
              playerColor: "",
              playerLeft: false,
            },
            Player3: {
              nickname: "",
              thumbnail: "",
              playerColor: "",
              playerLeft: false,
            },
            Player4: {
              nickname: "",
              thumbnail: "",
              playerColor: "",
              playerLeft: false,
            },
          },
        },
      },
      WaitForPlayer: false,
      RoomJoinStatus: "",
      AssetsLoaded: false,
    };
  },
  methods: {
    GetRoomList: function () {
      socket.emit("GetGameRoomList");
    },
    CreateRoom: function () {
      this.ShowCreateMatchContainer = false;
      if (this.SelectedMode == "friends-online") {
        this.CreateRoomDetails.PrivateRoom = true;
      }
      socket.emit("CreateRoom", this.CreateRoomDetails, (result) => {
        console.log(result);
        if (result) {
          this.CreateRoomDetails.PrivateRoomID = result.PrivateRoomID;
          this.ShowRoomDetailsContainer = result.RoomSize;
        }
      });
    },
    JoinRoom: function (roomID) {
      socket.emit(
        "JoinRoom",
        roomID,
        {
          nickname: this.PlayerData.nickName,
          thumbnail: this.PlayerData.thumbnail,
          endpoint: this.PlayerData.endpoint,
          privateRoomID: this.CreateRoomDetails.PrivateRoomID,
        },
        (result) => {
          if (result) {
            console.log("joined room sucess");
            this.ShowRoomDetailsContainer = result;
          } else {
            console.log("failed to Join Room");
            this.ShowRoomDetailsContainer = false;
          }
        }
      );
    },
    RefreshRooms: function () {
      this.GetRoomList();
    },
    ExitRoom: function (roomID) {
      socket.emit(
        "ExitRoom",
        roomID,
        {
          nickname: this.PlayerData.nickName,
          endpoint: this.PlayerData.endpoint,
        },
        (result) => {
          if (result) {
            console.log("room exit sucess");
            this.ShowRoomDetailsContainer = false;
          } else {
            console.log("failed to Exit Room");
          }
        }
      );
    },
    GetProfilePicURL: function () {
      console.log("getting profile pic");
      if (this.LoggedIn) {
        if (this.IsGuest) {
          return "/img/avatar/UserAvatar.png";
        } else if (!this.IsGuest) {
          return this.PlayerData.thumbnail;
        }
      }
    },
    SendChatMessage: function () {
      console.log("chat message");
      if (this.ChatMessage.trim()) {
        socket.emit(
          "GlobalChatMessage",
          {
            msg: this.ChatMessage,
          },
          (result) => {
            if (result) {
              this.ChatMessage = "";
            } else {
              console.log("network error");
            }
          }
        );
      }
    },
    scrollToBottom() {
      const chatWrapper = document.getElementById("global-chat-wrapper");
      if (chatWrapper) {
        chatWrapper.scrollTop = chatWrapper.scrollHeight;
      }
    },
    onScroll({ target: { scrollTop, clientHeight, scrollHeight } }) {
      if (scrollTop + clientHeight >= scrollHeight) {
      }
    },
    AcceptCookieConsent: function () {
      document.cookie = "cookieConsent=true";
      this.ShowCookieConsent = false;
    },
    reloadPage() {
      window.location.reload();
    },
    HideActiveMenu: function () {
      if (this.ShowSettings) {
        this.ShowSettings = false;
      }

      if (this.GameQuitAlert) {
        this.GameQuitAlert = false;
      }

      this.ShowMenuBG = false;
    },
    FooterActiveTab: function (tabIndex) {
      if (tabIndex == 1) {
        this.ShowContactForm = false;
        this.ShowChangelog = !this.ShowChangelog;
      } else if (tabIndex == 2) {
        this.ShowChangelog = false;
        this.ShowContactForm = !this.ShowContactForm;
      }
    },
    UpdateNickname: function () {
      this.ShowNicknameLoader = true;
      socket.emit("UpdateNickname", this.PlayerNickname, (result) => {
        if (result) {
          window.location.replace("/relogin"); // post('/relogin', null);
        } else {
          this.ShowNicknameLoader = false;
        }
      });
    },
    ActivateNicknameSelectionMenu: function () {
      this.ShowNicknameSelectionMenu = true;
      this.ShowModeSelectionMenu = false;
      this.ShowSettings = !this.ShowSettings;
      this.ShowMenuBG = this.ShowSettings;
      this.SelectedMode = 0;
      this.SelectedPlayers = 0;
      this.SelectedColor = 0;
    },
    ResetSelection: function () {
      this.ShowNicknameSelectionMenu = false;
      this.ShowModeSelectionMenu = true;
      this.SelectedMode = 0;
      this.SelectedPlayers = 0;
      this.SelectedColor = 0;
    },
    ShowSettingsMenu: function () {
      this.ShowSettings = !this.ShowSettings;
      this.ShowMenuBG = this.ShowSettings;
    },
    ShowModeSelectMenu: function () {
      console.log("modeSeleced");
      const nickname = document.getElementById("nickname");
      if (nickname) {
        if (nickname.innerHTML.trim() !== "(Nickname)") {
          this.PlayerNickname = nickname.innerHTML
            .trim()
            .substring(1, nickname.innerHTML.trim().length - 1);
          this.ShowNicknameSelectionMenu = false;
          this.ShowModeSelectionMenu = true;
        }
      }
    },
    SelectMode: function (option) {
      this.ShowModeSelectionMenu = false;
      this.SelectedMode = option;
      if (this.SelectedMode == "online") {
        console.log("loading lists");
        this.GetRoomList();
      }
    },
    SelectPlayers: function (option) {
      switch (this.SelectedMode) {
        case "computer":
          this.SelectedPlayers = option;
          break;
        case "local":
          this.SelectedPlayers = option;
          break;
        case "online":
          this.GetRoomList();
          this.SelectedPlayers = option;
          this.WaitForPlayer = true;
          // this.JoinRoom();
          break;
      }
    },
    SelectColor: function (option) {
      this.SelectedColor = option;
      this.FinalOptions = {
        SelectedMode: this.SelectedMode,
        SelectedPlayers: this.SelectedPlayers,
        SelectedColor: this.SelectedColor,
      };
      this.StartGame = true;
    },
    ShowQuitAlert: function () {
      if (!this.GameQuitAlert) {
        this.GameQuitAlert = true;
        this.ShowMenuBG = true;
      } else {
        this.GameQuitAlert = false;
        this.ShowMenuBG = false;
      }
    },
    ShowPlayerGameOverScreen: function (
      type,
      PlayerData = null,
      PlayerDataObject = null
    ) {
      // let session = getCookie("GameSession");
      //  console.log(session);
      //  if (session) {
      let DataObject;
      let counter;
      let playerObject;

      switch (type) {
        case 2:
          console.log(PlayerData.TwoPlayerData);
          console.log(PlayerData.TwoPlayerData.winnerData);
          console.log(PlayerData.TwoPlayerData.GameData);
          console.log(PlayerData.TwoPlayerData.winnerData.isWinner);
          console.log(PlayerData.TwoPlayerData.winnerData.isOpponentLeft);

          this.GameoverPlayerLeaderboard.Two.isWinner =
            PlayerData.TwoPlayerData.winnerData.isWinner;
          this.GameoverPlayerLeaderboard.Two.isOpponentLeft =
            PlayerData.TwoPlayerData.winnerData.isOpponentLeft;
          if (PlayerData.TwoPlayerData.winnerData.isWinner) {
            this.GamesWonCounter = this.PlayerStats.wonGames + 1;
            this.GamesLostCounter = this.PlayerStats.lostGames;
          } else if (!PlayerData.TwoPlayerData.winnerData.isWinner) {
            this.GamesWonCounter = this.PlayerStats.wonGames;
            this.GamesLostCounter = this.PlayerStats.lostGames + 1;
          }

          socket.emit("TwoPlayerStatus", {
            GameData: {
              GameMode: "Two",
              PlayerName: PlayerData.TwoPlayerData.playerName,
              Rank: PlayerData.TwoPlayerData.winningRank,
            },
            isWinner: PlayerData.TwoPlayerData.winnerData.isWinner,
            isOpponentLeft: PlayerData.TwoPlayerData.winnerData.isOpponentLeft,
          });

          break;
        case 3:
          console.log(PlayerDataObject);
          DataObject = PlayerDataObject.sort((a, b) => a.rank - b.rank);
          console.log(DataObject);
          counter = 0;
          for (const key in this.GameoverPlayerLeaderboard.Three) {
            if (this.GameoverPlayerLeaderboard.Three.hasOwnProperty(key)) {
              this.GameoverPlayerLeaderboard.Three[key].isWinner =
                DataObject[counter].rank != 0 ? true : false;
              this.GameoverPlayerLeaderboard.Three[key].isOpponentLeft =
                DataObject[counter].playerLeft;
              this.GameoverPlayerLeaderboard.Three[key].name =
                DataObject[counter].name;
              this.GameoverPlayerLeaderboard.Three[key].profilePic =
                DataObject[counter].profilePic;
              counter++;
            }
          }
          console.log(DataObject);
          console.log("(" + this.PlayerData.nickName + ")");

          for (let i = 0; i < PlayerDataObject.length; i++) {
            console.log(PlayerDataObject[i].name);
            if (PlayerDataObject[i].name === this.PlayerData.nickName) {
              playerObject = PlayerDataObject[i];
              break;
            }
          }
          console.log(playerObject);
          if (playerObject) {
            socket.emit("ThreePlayerStatus", {
              GameData: {
                GameMode: "Three",
                PlayerName: playerObject.name,
                Rank: playerObject.rank,
              },
            });
          }
          break;
        case 4:
          console.log(PlayerDataObject);
          DataObject = PlayerDataObject.sort((a, b) => a.rank - b.rank);
          counter = 0;
          for (const key in this.GameoverPlayerLeaderboard.Four) {
            if (this.GameoverPlayerLeaderboard.Four.hasOwnProperty(key)) {
              this.GameoverPlayerLeaderboard.Four[key].isWinner =
                DataObject[counter].rank != 0 ? true : false;
              this.GameoverPlayerLeaderboard.Four[key].isOpponentLeft =
                DataObject[counter].playerLeft;
              this.GameoverPlayerLeaderboard.Four[key].name =
                DataObject[counter].name;
              this.GameoverPlayerLeaderboard.Four[key].profilePic =
                DataObject[counter].profilePic;
              counter++;
            }
          }
          console.log(DataObject);
          console.log("(" + this.PlayerData.nickName + ")");

          for (let i = 0; i < PlayerDataObject.length; i++) {
            console.log(PlayerDataObject[i].name);
            if (PlayerDataObject[i].name === this.PlayerData.nickName) {
              playerObject = PlayerDataObject[i];
              break;
            }
          }
          console.log(playerObject);
          if (playerObject) {
            socket.emit("FourPlayerStatus", {
              GameData: {
                GameMode: "Four",
                PlayerName: playerObject.name,
                Rank: playerObject.rank,
              },
            });
          }
          break;
      }
      console.log("gameoverleaderboadr");
      this.GameoverLeaderBoardAlert = type;
    },
    StartLocalGame: function () {
      if (this.SelectedPlayers == "two") {
        this.LocalPlayers = {
          red: this.LocalPlayers.red == "" ? "Player 1" : this.LocalPlayers.red,
          yellow:
            this.LocalPlayers.yellow == ""
              ? "Player 2"
              : this.LocalPlayers.yellow,
        };
      } else if (this.SelectedPlayers == "three") {
        this.LocalPlayers = {
          red: this.LocalPlayers.red == "" ? "Player 1" : this.LocalPlayers.red,
          yellow:
            this.LocalPlayers.yellow == ""
              ? "Player 3"
              : this.LocalPlayers.yellow,
          green:
            this.LocalPlayers.green == ""
              ? "Player 2"
              : this.LocalPlayers.green,
        };
      } else if (this.SelectedPlayers == "four") {
        this.LocalPlayers = {
          red: this.LocalPlayers.red == "" ? "Player 1" : this.LocalPlayers.red,
          blue:
            this.LocalPlayers.blue == "" ? "Player 4" : this.LocalPlayers.blue,
          yellow:
            this.LocalPlayers.yellow == ""
              ? "Player 3"
              : this.LocalPlayers.yellow,
          green:
            this.LocalPlayers.green == ""
              ? "Player 2"
              : this.LocalPlayers.green,
        };
      }

      this.SelectedColor = "red";
      this.FinalOptions = {
        SelectedMode: this.SelectedMode,
        SelectedPlayers: this.SelectedPlayers,
        SelectedColor: this.SelectedColor,
      };

      this.StartGame = true;
    },
    ResetLocalGameNames: function () {
      this.LocalPlayers = {
        red: "",
        blue: "",
        yellow: "",
        green: "",
      };
    },
    QuitGame: function () {
      this.GameQuitAlert = false;
      this.ShowMenuBG = false;
      QuitGame();
    },
    ResumeGame: function () {
      this.GameQuitAlert = false;
      this.ShowMenuBG = false;
    },
    ShowGameoverLeaderBoardAlert(leaderboardData) {
      this.GameoverPlayerLeaderboard = leaderboardData;
      this.GameoverLeaderBoardAlert = true;
    },
    CalculateExpData: function () {
      let xp = this.PlayerXp;
      let lvl = GetLevel(xp);
      let nextXP = Math.trunc(GetNextXP(lvl));

      this.PlayerStats.lvl = lvl;
      this.PlayerStats.nextXP = nextXP;
      this.PlayerStats.xp = xp;
    },
  },
  watch: {
    AssetsLoaded() {
      console.log("asset-loaded");
      PreloadComplete();
    },
    StartGame() {
      if (this.StartGame === true) {
        // socket.emit("getGameSession", (result) => {
        //   if (result) {
        //       document.cookie = "GameSession=" + result;
        init();
        console.log(this.PlayerNickname);
        //      }
        //  })
      }
    },
    SelectedMode() {
      if (this.SelectedMode === "online") {
        this.LobbyJoined = true;
        socket.emit("JoinLobby");
        console.log("lobby joined");
      } else {
        if (this.LobbyJoined) {
          socket.emit("LeaveLobby");
          this.LobbyJoined = false;
          console.log("lobby leaved");
        }
      }
    },
  },
  mounted() {
    console.log(getCookie("cookieConsent"));
    if (!getCookie("cookieConsent")) {
      this.ShowCookieConsent = true;
    }
    console.log(this.PlayerNickname);
    this.ShowModeSelectMenu();
    this.CalculateExpData();
    LoadAssets();
  },
  computed: {
    GetIndicatorValue: function () {
      let a = this.PlayerStats.xp;
      let b = this.PlayerStats.nextXP;
      let percentage = (a / b) * 100;
      return percentage;
    },
  },
});

function GetLevel(exp) {
  let baseXP = 100;
  let expIncrementPerLevel = 0.1;
  let maxLvl = 500;

  let xp = exp;

  let i = 1;
  let testXP = baseXP;

  while (i < maxLvl) {
    if (testXP >= xp) {
      return i;
    }
    testXP = testXP * 2 + testXP * expIncrementPerLevel;
    i++;
  }

  return maxLvl;
}

function GetNextXP(lvl) {
  let baseXP = 100;
  let expIncrementPerLevel = 0.1;
  let maxLvl = 500;

  if (lvl == 1) return baseXP;
  else {
    let prev = GetNextXP(lvl - 1);
    return prev * 2 + prev * expIncrementPerLevel;
  }
}

function GetTotalXP(lvl) {
  let baseXP = 100;
  let expIncrementPerLevel = 2;
  if (lvl == 1) return baseXP;
  //return the base_exp when reach the first achievable  level
  else {
    return (
      GetTotalXP(lvl - 1) + GetNextXP(lvl - 1) * (1 + expIncrementPerLevel)
    );
  }
}

export function ResetToDefault() {
  vm.PlayerData = {
    id: "",
    playerName: "",
    thumbnail: "",
    endpoint: "",
  };
  vm.ShowModeSelectionMenu = true;
  vm.SelectedMode = 0;
  vm.SelectedPlayers = 0;
  vm.SelectedColor = 0;
  vm.FinalOptions = undefined;
  vm.StartGame = false;
}

export const socket = io({
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 99999,
});

socket.on("connect", () => {
  console.log("a user connected");
  socket.emit("GetPlayerSession", (result) => {
    if (result) {
      vm.ActiveSession = true;
      console.log("this is a original session");
    } else {
      vm.ActiveSession = false;
      console.log("player is already in another session");
    }
  });
});

socket.on("error", function (err) {
  this.ShowNetworkError = true;
});

socket.on("disconnect", function () {
  console.log("disconnected");
});

socket.on("user", function (user) {
  console.log(user);

  if (user) {
    vm.PlayerData.id = user._id;
    vm.PlayerData.playerName = user.username;
    vm.PlayerData.nickName = user.nickname;
    vm.PlayerData.thumbnail = user.thumbnail;
    vm.PlayerData.endpoint = user.endpoint;
  }
});

socket.on("GetGlobalChats", ({ globalChats }) => {
  vm.GlobalChats = globalChats;
  setTimeout(() => {
    vm.scrollToBottom();
  }, 0);
});

socket.on("GlobalChatMessage", ({ username, msg }) => {
  vm.GlobalChats.push({
    username: username,
    msg: msg,
  });
  setTimeout(() => {
    vm.scrollToBottom();
  }, 0);
});

socket.on("GameRoomList", (GameRoomList) => {
  vm.GameRoomList = GameRoomList;
});

socket.on("UpdateGameRoomList", (GameRoomList) => {
  let foundIndex = vm.GameRoomList.findIndex(
    (v) => v.RoomID === GameRoomList.RoomID
  );
  if (foundIndex === -1) {
    vm.GameRoomList.push(GameRoomList);
  } else {
    vm.GameRoomList[foundIndex] = GameRoomList;
  }
});

socket.on("RemoveGameRoomFromList", (GameRoomList) => {
  let foundIndex = vm.GameRoomList.findIndex(
    (v) => v.RoomID === GameRoomList.RoomID
  );
  if (foundIndex !== -1) {
    vm.GameRoomList.splice(foundIndex, 1);
  }
});

socket.on("GetRoomPlayers", (RoomPlayerData) => {
  console.log(RoomPlayerData);
  if (!vm.StartGame) {
    vm.RoomDetails.RoomID = RoomPlayerData.RoomID;
    vm.RoomDetails.RoomName = RoomPlayerData.RoomName;
    vm.RoomDetails.RoomStatus = "Waiting for Players";

    let PlayerCount = RoomPlayerData.RoomPlayers.length;

    if (RoomPlayerData.RoomSize === 2) {
      if (PlayerCount >= 1) {
        vm.RoomDetails.RoomPlayers.Two.Player1.nickname =
          RoomPlayerData.RoomPlayers[0].nickname;
        vm.RoomDetails.RoomPlayers.Two.Player1.thumbnail =
          RoomPlayerData.RoomPlayers[0].thumbnail;
        vm.RoomDetails.RoomPlayers.Two.Player1.playerColor =
          RoomPlayerData.RoomPlayers[0].playerColor;
      } else {
        vm.RoomDetails.RoomPlayers.Two.Player1.nickname = "";
        vm.RoomDetails.RoomPlayers.Two.Player1.thumbnail = "";
        vm.RoomDetails.RoomPlayers.Two.Player1.playerColor = "";
      }

      if (PlayerCount == 2) {
        vm.RoomDetails.RoomPlayers.Two.Player2.nickname =
          RoomPlayerData.RoomPlayers[1].nickname;
        vm.RoomDetails.RoomPlayers.Two.Player2.thumbnail =
          RoomPlayerData.RoomPlayers[1].thumbnail;
        vm.RoomDetails.RoomPlayers.Two.Player2.playerColor =
          RoomPlayerData.RoomPlayers[1].playerColor;
      } else {
        vm.RoomDetails.RoomPlayers.Two.Player2.nickname = "";
        vm.RoomDetails.RoomPlayers.Two.Player2.thumbnail = "";
        vm.RoomDetails.RoomPlayers.Two.Player2.playerColor = "";
      }
    } else if (RoomPlayerData.RoomSize === 3) {
      if (PlayerCount >= 1) {
        vm.RoomDetails.RoomPlayers.Three.Player1.nickname =
          RoomPlayerData.RoomPlayers[0].nickname;
        vm.RoomDetails.RoomPlayers.Three.Player1.thumbnail =
          RoomPlayerData.RoomPlayers[0].thumbnail;
        vm.RoomDetails.RoomPlayers.Three.Player1.playerColor =
          RoomPlayerData.RoomPlayers[0].playerColor;
      } else {
        vm.RoomDetails.RoomPlayers.Three.Player1.nickname = "";
        vm.RoomDetails.RoomPlayers.Three.Player1.thumbnail = "";
        vm.RoomDetails.RoomPlayers.Three.Player1.playerColor = "";
      }

      if (PlayerCount >= 2) {
        vm.RoomDetails.RoomPlayers.Three.Player2.nickname =
          RoomPlayerData.RoomPlayers[1].nickname;
        vm.RoomDetails.RoomPlayers.Three.Player2.thumbnail =
          RoomPlayerData.RoomPlayers[1].thumbnail;
        vm.RoomDetails.RoomPlayers.Three.Player2.playerColor =
          RoomPlayerData.RoomPlayers[1].playerColor;
      } else {
        vm.RoomDetails.RoomPlayers.Three.Player2.nickname = "";
        vm.RoomDetails.RoomPlayers.Three.Player2.thumbnail = "";
        vm.RoomDetails.RoomPlayers.Three.Player2.playerColor = "";
      }

      if (PlayerCount == 3) {
        vm.RoomDetails.RoomPlayers.Three.Player3.nickname =
          RoomPlayerData.RoomPlayers[2].nickname;
        vm.RoomDetails.RoomPlayers.Three.Player3.thumbnail =
          RoomPlayerData.RoomPlayers[2].thumbnail;
        vm.RoomDetails.RoomPlayers.Three.Player3.playerColor =
          RoomPlayerData.RoomPlayers[2].playerColor;
      } else {
        vm.RoomDetails.RoomPlayers.Three.Player3.nickname = "";
        vm.RoomDetails.RoomPlayers.Three.Player3.thumbnail = "";
        vm.RoomDetails.RoomPlayers.Three.Player3.playerColor = "";
      }
    } else if (RoomPlayerData.RoomSize === 4) {
      if (PlayerCount >= 1) {
        vm.RoomDetails.RoomPlayers.Four.Player1.nickname =
          RoomPlayerData.RoomPlayers[0].nickname;
        vm.RoomDetails.RoomPlayers.Four.Player1.thumbnail =
          RoomPlayerData.RoomPlayers[0].thumbnail;
        vm.RoomDetails.RoomPlayers.Four.Player1.playerColor =
          RoomPlayerData.RoomPlayers[0].playerColor;
      } else {
        vm.RoomDetails.RoomPlayers.Four.Player1.nickname = "";
        vm.RoomDetails.RoomPlayers.Four.Player1.thumbnail = "";
        vm.RoomDetails.RoomPlayers.Four.Player1.playerColor = "";
      }

      if (PlayerCount >= 2) {
        vm.RoomDetails.RoomPlayers.Four.Player2.nickname =
          RoomPlayerData.RoomPlayers[1].nickname;
        vm.RoomDetails.RoomPlayers.Four.Player2.thumbnail =
          RoomPlayerData.RoomPlayers[1].thumbnail;
        vm.RoomDetails.RoomPlayers.Four.Player2.playerColor =
          RoomPlayerData.RoomPlayers[1].playerColor;
      } else {
        vm.RoomDetails.RoomPlayers.Four.Player2.nickname = "";
        vm.RoomDetails.RoomPlayers.Four.Player2.thumbnail = "";
        vm.RoomDetails.RoomPlayers.Four.Player2.playerColor = "";
      }

      if (PlayerCount >= 3) {
        vm.RoomDetails.RoomPlayers.Four.Player3.nickname =
          RoomPlayerData.RoomPlayers[2].nickname;
        vm.RoomDetails.RoomPlayers.Four.Player3.thumbnail =
          RoomPlayerData.RoomPlayers[2].thumbnail;
        vm.RoomDetails.RoomPlayers.Four.Player3.playerColor =
          RoomPlayerData.RoomPlayers[2].playerColor;
      } else {
        vm.RoomDetails.RoomPlayers.Four.Player3.nickname = "";
        vm.RoomDetails.RoomPlayers.Four.Player3.thumbnail = "";
        vm.RoomDetails.RoomPlayers.Four.Player3.playerColor = "";
      }

      if (PlayerCount == 4) {
        vm.RoomDetails.RoomPlayers.Four.Player4.nickname =
          RoomPlayerData.RoomPlayers[3].nickname;
        vm.RoomDetails.RoomPlayers.Four.Player4.thumbnail =
          RoomPlayerData.RoomPlayers[3].thumbnail;
        vm.RoomDetails.RoomPlayers.Four.Player4.playerColor =
          RoomPlayerData.RoomPlayers[3].playerColor;
      } else {
        vm.RoomDetails.RoomPlayers.Four.Player4.nickname = "";
        vm.RoomDetails.RoomPlayers.Four.Player4.thumbnail = "";
        vm.RoomDetails.RoomPlayers.Four.Player4.playerColor = "";
      }
    }
  } else {
    let RoomSize = RoomPlayerData.RoomSize;
    let PlayerCount = RoomPlayerData.RoomPlayers.length;

    console.log(RoomSize, PlayerCount);

    if (RoomSize === 2) {
      if (PlayerCount == 1) {
        for (const key in vm.RoomDetails.RoomPlayers.Two) {
          if (vm.RoomDetails.RoomPlayers.Two.hasOwnProperty(key)) {
            if (
              vm.RoomDetails.RoomPlayers.Two[key].playerColor !=
              RoomPlayerData.RoomPlayers[0].playerColor
            ) {
              SetPlayerLeft(vm.RoomDetails.RoomPlayers.Two[key].playerColor);
              vm.RoomDetails.RoomPlayers.Two[key].playerLeft = true;
              console.log(vm.RoomDetails.RoomPlayers.Two[key].playerColor);
            }
          }
        }
      }
    } else if (RoomSize === 3) {
      if (PlayerCount < 3) {
        let availablePlayerColors = [];
        let roomPlayerColors = RoomPlayerData.RoomPlayers.map((player) => {
          return player.playerColor;
        });

        for (const key in vm.RoomDetails.RoomPlayers.Three) {
          if (vm.RoomDetails.RoomPlayers.Three.hasOwnProperty(key)) {
            if (!vm.RoomDetails.RoomPlayers.Three[key].playerLeft) {
              availablePlayerColors.push(
                vm.RoomDetails.RoomPlayers.Three[key].playerColor
              );
            }
          }
        }

        console.log(roomPlayerColors);
        console.log(availablePlayerColors);

        availablePlayerColors.some((color) => {
          if (roomPlayerColors.indexOf(color) === -1) {
            for (const key in vm.RoomDetails.RoomPlayers.Three) {
              if (vm.RoomDetails.RoomPlayers.Three.hasOwnProperty(key)) {
                if (
                  vm.RoomDetails.RoomPlayers.Three[key].playerColor == color
                ) {
                  vm.RoomDetails.RoomPlayers.Three[key].playerLeft = true;
                  SetPlayerLeft(color);
                  return true;
                }
              }
            }
          }
        });
      }
    } else if (RoomSize === 4) {
      if (PlayerCount < 4) {
        let availablePlayerColors = [];
        let roomPlayerColors = RoomPlayerData.RoomPlayers.map((player) => {
          return player.playerColor;
        });

        for (const key in vm.RoomDetails.RoomPlayers.Four) {
          if (vm.RoomDetails.RoomPlayers.Four.hasOwnProperty(key)) {
            if (!vm.RoomDetails.RoomPlayers.Four[key].playerLeft) {
              availablePlayerColors.push(
                vm.RoomDetails.RoomPlayers.Four[key].playerColor
              );
            }
          }
        }

        console.log(roomPlayerColors);
        console.log(availablePlayerColors);

        availablePlayerColors.some((color) => {
          if (roomPlayerColors.indexOf(color) === -1) {
            for (const key in vm.RoomDetails.RoomPlayers.Four) {
              if (vm.RoomDetails.RoomPlayers.Four.hasOwnProperty(key)) {
                if (vm.RoomDetails.RoomPlayers.Four[key].playerColor == color) {
                  vm.RoomDetails.RoomPlayers.Four[key].playerLeft = true;
                  SetPlayerLeft(color);
                  return true;
                }
              }
            }
          }
        });
      }
    }
  }
});

socket.on("AllActiveGameRoomList", (AllActiveGameRoomList) => {
  console.log(AllActiveGameRoomList);
  vm.GameRoomList = AllActiveGameRoomList;
});

socket.on("RoomFullStartingGame", () => {
  vm.RoomDetails.RoomStatus = "Starting Game";
});

socket.on("StartGame", (gameData) => {
  console.log(gameData.gameRoom);

  let Player = gameData.gameRoom.Players.find((player) => {
    if (vm.PlayerData.endpoint === player.endpoint) {
      return player;
    }
  });

  console.log(Player);

  vm.FinalOptions = {
    SelectedMode: "online",
    SelectedPlayers:
      gameData.gameRoom.RoomSize === 2
        ? "two"
        : gameData.gameRoom.RoomSize === 3
        ? "three"
        : "four",
    SelectedColor: Player.playerColor,
    GameRoom: gameData.gameRoom,
  };

  vm.SelectedPlayers = vm.FinalOptions.SelectedPlayers;
  vm.SelectedColor = vm.FinalOptions.SelectedColor;

  vm.StartGame = true;
});

socket.on("RollDice", (diceValue) => {
  Dice.onlineDiceClick(diceValue);
});

socket.on("ponClick", (data) => {
  var pons = GetAllPawns(data.TeamColor);
  pons.forEach((pon) => {
    if (pon.NetworkId == data.NetworkId) {
      pon.OnlinePonClick();
    }
  });
  console.log(data);
});
