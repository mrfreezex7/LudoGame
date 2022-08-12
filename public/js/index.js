import { ConvertToOneDecimal, Device } from "/js/utils.js";
import { StartGame } from "/js/game-manager.js";
import { vm } from "/js/events.js";

export let CurrentDevice = innerWidth > 750 ? Device.PC : Device.MOBILE;

export let size =
  CurrentDevice == Device.PC ? Device.PC.size : Device.MOBILE.size;
export let GAME_WIDTH =
  size * (CurrentDevice == Device.PC ? Device.PC.width : Device.MOBILE.width);
export let GAME_HEIGHT =
  size * (CurrentDevice == Device.PC ? Device.PC.height : Device.MOBILE.height);
export let scaleFactor = size;
export let StartPositionX = 0; // ConvertToOneDecimal(Math.abs((GAME_WIDTH - (size * 23)) / size) / 2);
export let StartPositionY = 0; //ConvertToOneDecimal((Math.abs((GAME_HEIGHT - Math.abs(GAME_HEIGHT - (GAME_HEIGHT % 100))) / size) / 2));

console.log(innerWidth + " = " + innerHeight);

export let stage;
export var loader;
var diceSpriteSheet;
var ponSelectorSpriteSheet;
var AssetsLoaded = false;

window.onload = function () {
  //ResponsiveCanvas();
};

window.addEventListener("resize", () => {
  ResponsiveCanvas();
  console.log("resizing");
});

export function PreloadComplete() {
  let preloader = document.querySelector(".preloader-bg");
  preloader.addEventListener(
    "webkitAnimationEnd",
    function (event) {
      preloader.style.display = "none";
    },
    false
  );
  preloader.classList.add("fadeOut");
  console.log("preloadComplete");
}

function ResponsiveCanvas() {
  if (vm.StartGame && AssetsLoaded) {
    let NewCurrentDevice = innerWidth > 750 ? Device.PC : Device.MOBILE;
    if (CurrentDevice != NewCurrentDevice) {
      document.location.reload(false);
      console.log("loaded");
    }
  }
}

export function init() {
  if (AssetsLoaded) {
    let canvas = document.getElementById("gameScreen");
    stage = new createjs.Stage("gameScreen");
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    StartGame();
  }
}

export function LoadAssets() {
  loader = new createjs.LoadQueue();
  const Manifest = [
    { id: "randomImage1", src: "img/avatar/avatar-1.png" },
    { id: "randomImage2", src: "img/avatar/avatar-2.png" },
    { id: "randomImage3", src: "img/avatar/avatar-3.png" },
    { id: "userAvatar", src: "img/avatar/UserAvatar.png" },
    { id: "dice", src: "img/Dice.png" },
    { id: "ponSelector", src: "img/PonSelector.png" },
    { id: "gameRedPon", src: "img/pons/gamePons/RedPon.png" },
    { id: "gameBluePon", src: "img/pons/gamePons/BluePon.png" },
    { id: "gameYellowPon", src: "img/pons/gamePons/YellowPon.png" },
    { id: "gameGreenPon", src: "img/pons/gamePons/GreenPon.png" },
    { id: "sideRedPon", src: "img/pons/sidePons/RedPon.png" },
    { id: "sideBluePon", src: "img/pons/sidePons/BluePon.png" },
    { id: "sideYellowPon", src: "img/pons/sidePons/YellowPon.png" },
    { id: "sideGreenPon", src: "img/pons/sidePons/GreenPon.png" },
    { id: "arrow", src: "img/arrow.png" },
    { id: "savePoint", src: "img/savepoint.png" },
    { id: "diceRoll", src: "sfx/Dice.wav" },
    { id: "pawnMove", src: "sfx/Pop1.mp3" },
    { id: "pawnDead", src: "sfx/PonDead.mp3" },
    { id: "pawnSecure", src: "sfx/Secure_Pawn.mp3" },
    { id: "pawnHome", src: "sfx/Win_House.wav" },
  ];

  loader.installPlugin(createjs.Sound);
  loader.on("complete", handleComplete, this);
  handlefileprogress(loader, Manifest.length);

  loader.loadManifest(Manifest, true, "/assets/");
}

function handlefileprogress(loader, maxFiles) {
  let preloaderFill = document.getElementById("preloader-fill");
  let fileLoadComplete = [];
  let loadProgress = 0;
  loader.on("fileprogress", function (progress) {
    loadProgress += progress.loaded;

    console.log(loadProgress);
    if (progress.loaded == 1 && !fileLoadComplete.includes[progress.item.id]) {
      fileLoadComplete.push(progress.item.id);
      preloaderFill.style.width = loadProgress + "%";
    }
    if (fileLoadComplete.length >= maxFiles) {
      console.log("all file loaded successfully");
      preloaderFill.style.width = "100%";
    }
  });
}

function handleComplete() {
  diceSpriteSheet = new createjs.SpriteSheet({
    framerate: 30,
    images: [loader.getResult("dice")],
    frames: {
      width: 154,
      height: 158,
      count: 25,
      regX: 0,
      regY: 0,
      spacing: 0,
      margin: 0,
    },
    animations: {
      roll: [0, 18, false, 1],
      start: [20, 20],
    },
  });

  ponSelectorSpriteSheet = new createjs.SpriteSheet({
    framerate: 60,
    images: [loader.getResult("ponSelector")],
    frames: {
      width: 78,
      height: 79,
      count: 8,
      regX: 0,
      regY: 0,
      spacing: 0,
      margin: 0,
    },
    animations: {
      rotate: [0, 7, true, 1],
    },
  });

  console.log("AssetsLoaded");
  AssetsLoaded = true;
  vm.AssetsLoaded = AssetsLoaded;
  //init();
}

export function GetDiceSpriteSheet() {
  return diceSpriteSheet;
}

export function GetPonSelectorSpriteSheet() {
  return ponSelectorSpriteSheet;
}

window.addEventListener("keydown", (event) => {
  if (event.keyCode == 27 && vm.StartGame) {
    //ShowQuitAlert();
    vm.ShowQuitAlert();
    console.log("quit alert");
  }
});
