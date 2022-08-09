import {loader} from "/js/index.js";

export const Device = {
	PC: {
		size: (innerWidth + innerHeight) / 50,
		width: 23,
		height: 17,
	},
	MOBILE: {
		size: (innerWidth - innerWidth / 25) / 15,
		width: 15,
		height: 23,
	},

	//widht and height are based on block size
};

export function ConvertToOneDecimal(value) {
	return Math.round(value * 10) / 10;
}

export function GetGamePonImagePath(PonColor) {
	switch (PonColor) {
		case "red":
			return loader.getResult("gameRedPon");
		case "blue":
			return loader.getResult("gameBluePon");
		case "yellow":
			return loader.getResult("gameYellowPon");
		case "green":
			return loader.getResult("gameGreenPon");
	}
}

export function GetSidePonImagePath(PonColor) {
	switch (PonColor) {
		case "red":
			return loader.getResult("sideRedPon");
		case "blue":
			return loader.getResult("sideBluePon");
		case "yellow":
			return loader.getResult("sideYellowPon");
		case "green":
			return loader.getResult("sideGreenPon");
	}
}

export function GetRandomImagePath() {
	var imageName = ["randomImage1", "randomImage2", "randomImage3"];

	return loader.getResult(imageName[Math.floor(Math.random() * imageName.length)]);
}

export function GenerateId(length) {
	var result = "";
	var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
