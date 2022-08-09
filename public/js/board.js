import {scaleFactor, size, StartPositionX, StartPositionY, CurrentDevice} from "/js/index.js";
import {BuildBoardSavePoint, BuildBoardRectPiece, BuildBoardGradientRectPiece, BuildBoardRoundRectPiece, BuildBoardCirclePiece, BuildBoardPlayerText, BuildCenterBoardPiece, BuildBoardPlayerAvatar, BuildBoardPlayerPon, BuildBoardPlayerDice} from "/js/board-piece.js";
import {
	SavePointDesign,
	SavePointDesign_Mobile,
	Board3_1,
	Board3_2,
	Board3_3,
	Board3_4,
	Board3_1_Online,
	Board3_2_Online,
	Board3_3_Online,
	Board_1,
	Board_2,
	Board_3,
	Board_4,
	Board_1_Mobile,
	Board_2_Mobile,
	Board_3_Mobile,
	Board_4_Mobile,
	Board2_1,
	Board2_2,
	Board2_3,
	Board2_4,
	Board2_1_Mobile,
	Board2_2_Mobile,
	Board2_3_Mobile,
	Board2_4_Mobile,
	PawnSpawnCirle1,
	PawnSpawnCirle2,
	PawnSpawnCirle3,
	PawnSpawnCirle4,
	PawnSpawnCirle1_Mobile,
	PawnSpawnCirle2_Mobile,
	PawnSpawnCirle3_Mobile,
	PawnSpawnCirle4_Mobile,
	CenterDesign,
	RedData,
	BlueData,
	YellowData,
	GreenData,
	RedData_Mobile,
	BlueData_Mobile,
	YellowData_Mobile,
	GreenData_Mobile,
	BottomLeftOffset,
	BottomRightOffset,
	TopLeftOffset,
	TopRightOffset,
	Offset_Mobile,
	DiceHolder,
} from "/js/board-details.js";
import {Device} from "/js/utils.js";

let spawnCircleRadius;

export function BuildBoard(BoardTemplate) {
	let rowCounter = 0;
	spawnCircleRadius = size / 1.8;

	BoardTemplate.forEach((row, rowY) => {
		row.forEach((data, rowX) => {
			let x = (StartPositionX + rowX) * scaleFactor;
			let y = (StartPositionY + rowY) * scaleFactor;

			//outsideBoard
			if (data == 111) {
				RedData.ponBg.x = x;
				RedData.ponBg.y = y;

				RedData.ponHolder.x = x;
				RedData.ponHolder.y = y;

				RedData_Mobile.ponBg.x = x;
				RedData_Mobile.ponBg.y = y;

				RedData_Mobile.ponHolder.x = x;
				RedData_Mobile.ponHolder.y = y;
			} else if (data == 116) {
				RedData.diceBg.x = x;
				RedData.diceBg.y = y;

				RedData.diceHolder.x = x;
				RedData.diceHolder.y = y;

				RedData_Mobile.diceBg.x = x;
				RedData_Mobile.diceBg.y = y;

				RedData_Mobile.diceHolder.x = x;
				RedData_Mobile.diceHolder.y = y;
			} else if (data == 112) {
				RedData.playerDataBG.x = x;
				RedData.playerDataBG.y = y;

				RedData.playerIcon.x = x;
				RedData.playerIcon.y = y;

				RedData.playerImage.x = x;
				RedData.playerImage.y = y;
			} else if (data == 113) {
				RedData.playerName.x = x;
				RedData.playerName.y = y;

				RedData.playerLevel.x = x;
				RedData.playerLevel.y = y;
			} else if (data == 221) {
				BlueData.ponBg.x = x;
				BlueData.ponBg.y = y;

				BlueData.ponHolder.x = x;
				BlueData.ponHolder.y = y;

				BlueData_Mobile.ponBg.x = x;
				BlueData_Mobile.ponBg.y = y;

				BlueData_Mobile.ponHolder.x = x;
				BlueData_Mobile.ponHolder.y = y;
			} else if (data == 226) {
				BlueData.diceBg.x = x;
				BlueData.diceBg.y = y;

				BlueData.diceHolder.x = x;
				BlueData.diceHolder.y = y;

				BlueData_Mobile.diceBg.x = x;
				BlueData_Mobile.diceBg.y = y;

				BlueData_Mobile.diceHolder.x = x;
				BlueData_Mobile.diceHolder.y = y;
			} else if (data == 222) {
				BlueData.playerDataBG.x = x;
				BlueData.playerDataBG.y = y;

				BlueData.playerIcon.x = x;
				BlueData.playerIcon.y = y;

				BlueData.playerImage.x = x;
				BlueData.playerImage.y = y;
			} else if (data == 223) {
				BlueData.playerName.x = x;
				BlueData.playerName.y = y;

				BlueData.playerLevel.x = x;
				BlueData.playerLevel.y = y;
			} else if (data == 331) {
				YellowData.ponBg.x = x;
				YellowData.ponBg.y = y;

				YellowData.ponHolder.x = x;
				YellowData.ponHolder.y = y;

				YellowData_Mobile.ponBg.x = x;
				YellowData_Mobile.ponBg.y = y;

				YellowData_Mobile.ponHolder.x = x;
				YellowData_Mobile.ponHolder.y = y;
			} else if (data == 336) {
				YellowData.diceBg.x = x;
				YellowData.diceBg.y = y;

				YellowData.diceHolder.x = x;
				YellowData.diceHolder.y = y;

				YellowData_Mobile.diceBg.x = x;
				YellowData_Mobile.diceBg.y = y;

				YellowData_Mobile.diceHolder.x = x;
				YellowData_Mobile.diceHolder.y = y;
			} else if (data == 332) {
				YellowData.playerDataBG.x = x;
				YellowData.playerDataBG.y = y;

				YellowData.playerIcon.x = x;
				YellowData.playerIcon.y = y;

				YellowData.playerImage.x = x;
				YellowData.playerImage.y = y;
			} else if (data == 333) {
				YellowData.playerName.x = x;
				YellowData.playerName.y = y;

				YellowData.playerLevel.x = x;
				YellowData.playerLevel.y = y;
			} else if (data == 441) {
				GreenData.ponBg.x = x;
				GreenData.ponBg.y = y;

				GreenData.ponHolder.x = x;
				GreenData.ponHolder.y = y;

				GreenData_Mobile.ponBg.x = x;
				GreenData_Mobile.ponBg.y = y;

				GreenData_Mobile.ponHolder.x = x;
				GreenData_Mobile.ponHolder.y = y;
			} else if (data == 446) {
				GreenData.diceBg.x = x;
				GreenData.diceBg.y = y;

				GreenData.diceHolder.x = x;
				GreenData.diceHolder.y = y;

				GreenData_Mobile.diceBg.x = x;
				GreenData_Mobile.diceBg.y = y;

				GreenData_Mobile.diceHolder.x = x;
				GreenData_Mobile.diceHolder.y = y;
			} else if (data == 442) {
				GreenData.playerDataBG.x = x;
				GreenData.playerDataBG.y = y;

				GreenData.playerIcon.x = x;
				GreenData.playerIcon.y = y;

				GreenData.playerImage.x = x;
				GreenData.playerImage.y = y;
			} else if (data == 443) {
				GreenData.playerName.x = x;
				GreenData.playerName.y = y;

				GreenData.playerLevel.x = x;
				GreenData.playerLevel.y = y;
			}

			//inside grid
			if (data == 11) {
				BuildBoardRectPiece(x, y, size, size, "#FF2C28", "black");
			} else if (data == 22) {
				BuildBoardRectPiece(x, y, size, size, "#006CBF", "black");
			} else if (data == 33) {
				BuildBoardRectPiece(x, y, size, size, "#FFDE2D", "black");
			} else if (data == 44) {
				BuildBoardRectPiece(x, y, size, size, "#009E23", "black");
			}
			//normal grid
			else if (data == 0) {
				BuildBoardRectPiece(x, y, size, size, "white", "black");
			}
			//outside grid
			else if (data == 1) {
				BuildBoardRectPiece(x, y, size * 6, size * 6, "#FF2C28");
			} else if (data == 2) {
				BuildBoardRectPiece(x, y, size * 6, size * 6, "#006CBF");
			} else if (data == 3) {
				BuildBoardRectPiece(x, y, size * 6, size * 6, "#FFDE2D");
			} else if (data == 4) {
				BuildBoardRectPiece(x, y, size * 6, size * 6, "#009E23");
			} else if (data == 6) {
				BuildBoardRectPiece(x, y, size * 4, size * 4, "#C5201E");
			} else if (data == 7) {
				BuildBoardRectPiece(x, y, size * 4, size * 4, "#004E8E");
			} else if (data == 8) {
				BuildBoardRectPiece(x, y, size * 4, size * 4, "#FFB325");
			} else if (data == 9) {
				BuildBoardRectPiece(x, y, size * 4, size * 4, "#017920");
			}
			//center piece
			else if (data == 5) {
				switch (rowCounter) {
					case 0:
						CenterDesign.row01.x = x;
						CenterDesign.row01.y = y;
						break;
					case 1:
						CenterDesign.row02.x = x;
						CenterDesign.row02.y = y;
						break;
					case 2:
						CenterDesign.row03.x = x;
						CenterDesign.row03.y = y;
						break;
					case 3:
						CenterDesign.row11.x = x;
						CenterDesign.row11.y = y;
						break;
					case 4:
						CenterDesign.row12.x = x;
						CenterDesign.row12.y = y;
						break;
					case 5:
						CenterDesign.row13.x = x;
						CenterDesign.row13.y = y;
						break;
					case 6:
						CenterDesign.row21.x = x;
						CenterDesign.row21.y = y;
						break;
					case 7:
						CenterDesign.row22.x = x;
						CenterDesign.row22.y = y;
						break;
					case 8:
						CenterDesign.row23.x = x;
						CenterDesign.row23.y = y;
						break;
				}
				rowCounter++;
			}
			//Rounded Rects
			else if (data === 1111) {
				BuildBoardRoundRectPiece(x, y, size * 4, size * 4, "#FF2C28", undefined, 30, 0, 0, 30);
			} else if (data === 1112) {
				BuildBoardRoundRectPiece(x, y, size * 4, size * 4, "#FF2C28", undefined, 0, 30, 30, 0);
			} else if (data === 2221) {
				BuildBoardRoundRectPiece(x, y, size * 4, size * 4, "#006CBF", undefined, 30, 0, 0, 30);
			} else if (data === 2222) {
				BuildBoardRoundRectPiece(x, y, size * 4, size * 4, "#006CBF", undefined, 0, 30, 30, 0);
			} else if (data === 3331) {
				BuildBoardRoundRectPiece(x, y, size * 4, size * 4, "#FFDE2D", undefined, 30, 0, 0, 30);
			} else if (data === 3332) {
				BuildBoardRoundRectPiece(x, y, size * 4, size * 4, "#FFDE2D", undefined, 0, 30, 30, 0);
			} else if (data === 4441) {
				BuildBoardRoundRectPiece(x, y, size * 4, size * 4, "#009E23", undefined, 30, 0, 0, 30);
			} else if (data === 4442) {
				BuildBoardRoundRectPiece(x, y, size * 4, size * 4, "#009E23", undefined, 0, 30, 30, 0);
			} else if (data === 11119) {
				BuildBoardRoundRectPiece(x, y, size * 6, size * 3, "#FF2C28", undefined, 5, 5, 0, 0);
			} else if (data === 11129) {
				BuildBoardRoundRectPiece(x, y, size * 6, size * 3, "#FF2C28", undefined, 0, 0, 5, 5);
			} else if (data === 22219) {
				BuildBoardRoundRectPiece(x, y, size * 6, size * 3, "#006CBF", undefined, 5, 5, 0, 0);
			} else if (data === 22229) {
				BuildBoardRoundRectPiece(x, y, size * 6, size * 3, "#006CBF", undefined, 0, 0, 5, 5);
			} else if (data === 33319) {
				BuildBoardRoundRectPiece(x, y, size * 6, size * 3, "#FFDE2D", undefined, 5, 5, 0, 0);
			} else if (data === 33329) {
				BuildBoardRoundRectPiece(x, y, size * 6, size * 3, "#FFDE2D", undefined, 0, 0, 5, 5);
			} else if (data === 44419) {
				BuildBoardRoundRectPiece(x, y, size * 6, size * 3, "#009E23", undefined, 5, 5, 0, 0);
			} else if (data === 44429) {
				BuildBoardRoundRectPiece(x, y, size * 6, size * 3, "#009E23", undefined, 0, 0, 5, 5);
			}
		});
	});

	//spawn circles
	if (CurrentDevice != Device.MOBILE) {
		DrawPonSpawnCircles(PawnSpawnCirle1);
		DrawPonSpawnCircles(PawnSpawnCirle2);
		DrawPonSpawnCircles(PawnSpawnCirle3);
		DrawPonSpawnCircles(PawnSpawnCirle4);
	} else {
		DrawPonSpawnCircles(PawnSpawnCirle1_Mobile);
		DrawPonSpawnCircles(PawnSpawnCirle2_Mobile);
		DrawPonSpawnCircles(PawnSpawnCirle3_Mobile);
		DrawPonSpawnCircles(PawnSpawnCirle4_Mobile);
	}

	//savePoint
	DrawSavePoint();

	//center piece
	BuildCenterBoardPiece(CenterDesign, BoardTemplate);
	//outside Piece
	DrawDifferenctOutsideData(BoardTemplate);
}

function DrawSavePoint() {
	if (CurrentDevice != Device.MOBILE) {
		for (const key in SavePointDesign) {
			if (SavePointDesign.hasOwnProperty(key)) {
				var x = (StartPositionX + SavePointDesign[key].x) * scaleFactor;
				var y = (StartPositionY + SavePointDesign[key].y) * scaleFactor;

				BuildBoardSavePoint(x, y, scaleFactor, scaleFactor);
			}
		}
	} else {
		for (const key in SavePointDesign_Mobile) {
			if (SavePointDesign.hasOwnProperty(key)) {
				var x = (StartPositionX + SavePointDesign_Mobile[key].x) * scaleFactor;
				var y = (StartPositionY + SavePointDesign_Mobile[key].y) * scaleFactor;

				BuildBoardSavePoint(x, y, scaleFactor, scaleFactor);
			}
		}
	}
}

function DrawPonSpawnCircles(ponPosition) {
	for (var key in ponPosition) {
		if (ponPosition.hasOwnProperty(key)) {
			BuildBoardCirclePiece((StartPositionX + ponPosition[key].x) * scaleFactor, (StartPositionY + ponPosition[key].y) * scaleFactor, spawnCircleRadius, "White");
		}
	}
}

function DrawDifferenctOutsideData(BoardType) {
	switch (BoardType) {
		case Board_1:
			DrawOutsideData(RedData, BottomLeftOffset);
			DrawOutsideData(BlueData, BottomRightOffset);
			DrawOutsideData(YellowData, TopRightOffset);
			DrawOutsideData(GreenData, TopLeftOffset);
			break;
		case Board_2:
			DrawOutsideData(RedData, TopLeftOffset);
			DrawOutsideData(BlueData, BottomLeftOffset);
			DrawOutsideData(YellowData, BottomRightOffset);
			DrawOutsideData(GreenData, TopRightOffset);
			break;
		case Board_3:
			DrawOutsideData(RedData, TopRightOffset);
			DrawOutsideData(BlueData, TopLeftOffset);
			DrawOutsideData(YellowData, BottomLeftOffset);
			DrawOutsideData(GreenData, BottomRightOffset);
			break;
		case Board_4:
			DrawOutsideData(RedData, BottomRightOffset);
			DrawOutsideData(BlueData, TopRightOffset);
			DrawOutsideData(YellowData, TopLeftOffset);
			DrawOutsideData(GreenData, BottomLeftOffset);
			break;
		case Board3_1:
			DrawOutsideData(RedData, BottomLeftOffset);
			DrawOutsideData(BlueData, BottomRightOffset);
			DrawOutsideData(YellowData, TopRightOffset);
			DrawOutsideData(GreenData, TopLeftOffset);
			break;
		case Board3_2:
			DrawOutsideData(RedData, TopLeftOffset);
			DrawOutsideData(BlueData, BottomLeftOffset);
			DrawOutsideData(YellowData, BottomRightOffset);
			DrawOutsideData(GreenData, TopRightOffset);
			break;
		case Board3_3:
			DrawOutsideData(RedData, TopRightOffset);
			DrawOutsideData(BlueData, TopLeftOffset);
			DrawOutsideData(YellowData, BottomLeftOffset);
			DrawOutsideData(GreenData, BottomRightOffset);
			break;
		case Board3_4:
			DrawOutsideData(RedData, BottomRightOffset);
			DrawOutsideData(BlueData, TopRightOffset);
			DrawOutsideData(YellowData, TopLeftOffset);
			DrawOutsideData(GreenData, BottomLeftOffset);
			break;
		case Board3_1_Online:
			DrawOutsideData(RedData, BottomLeftOffset);
			DrawOutsideData(BlueData, BottomRightOffset);
			DrawOutsideData(YellowData, TopRightOffset);
			DrawOutsideData(GreenData, TopLeftOffset);
			break;
		case Board3_2_Online:
			DrawOutsideData(RedData, TopRightOffset);
			DrawOutsideData(BlueData, BottomLeftOffset);
			DrawOutsideData(YellowData, BottomRightOffset);
			DrawOutsideData(GreenData, TopLeftOffset);
			break;
		case Board3_3_Online:
			DrawOutsideData(RedData, TopRightOffset);
			DrawOutsideData(BlueData, BottomRightOffset);
			DrawOutsideData(YellowData, BottomLeftOffset);
			DrawOutsideData(GreenData, TopLeftOffset);
			break;
		case Board2_1:
			DrawOutsideData(RedData, BottomLeftOffset);
			DrawOutsideData(YellowData, TopRightOffset);
			break;
		case Board2_2:
			DrawOutsideData(BlueData, BottomLeftOffset);
			DrawOutsideData(GreenData, TopRightOffset);
			break;
		case Board2_3:
			DrawOutsideData(YellowData, BottomLeftOffset);
			DrawOutsideData(RedData, TopRightOffset);
			break;
		case Board2_4:
			DrawOutsideData(GreenData, BottomLeftOffset);
			DrawOutsideData(BlueData, TopRightOffset);
			break;
		case Board_1_Mobile:
		case Board_2_Mobile:
		case Board_3_Mobile:
		case Board_4_Mobile:
			DrawOutsideData(RedData_Mobile, Offset_Mobile);
			DrawOutsideData(BlueData_Mobile, Offset_Mobile);
			DrawOutsideData(YellowData_Mobile, Offset_Mobile);
			DrawOutsideData(GreenData_Mobile, Offset_Mobile);
			break;
		case Board2_1_Mobile:
			DrawOutsideData(RedData_Mobile, Offset_Mobile);
			DrawOutsideData(YellowData_Mobile, Offset_Mobile);
			break;
		case Board2_2_Mobile:
			DrawOutsideData(BlueData_Mobile, Offset_Mobile);
			DrawOutsideData(GreenData_Mobile, Offset_Mobile);
			break;
		case Board2_3_Mobile:
			DrawOutsideData(YellowData_Mobile, Offset_Mobile);
			DrawOutsideData(RedData_Mobile, Offset_Mobile);
			break;
		case Board2_4_Mobile:
			DrawOutsideData(GreenData_Mobile, Offset_Mobile);
			DrawOutsideData(BlueData_Mobile, Offset_Mobile);
			break;
	}
}

function DrawOutsideData(bgPosition, offset) {
	for (var key in bgPosition) {
		if (bgPosition.hasOwnProperty(key)) {
			switch (key) {
				case "ponBg":
					if (bgPosition[key].x != undefined) BuildBoardRectPiece(bgPosition[key].x + offset.ponBg.x * scaleFactor, bgPosition[key].y + offset.ponBg.y * scaleFactor, size * offset.ponBg.size, size * offset.ponBg.size, bgPosition[key].color);
					break;
				case "diceBg":
					if (bgPosition[key].x != undefined) BuildBoardRectPiece(bgPosition[key].x + offset.diceBg.x * scaleFactor, bgPosition[key].y + offset.diceBg.y * scaleFactor, size * offset.diceBg.size, size * offset.diceBg.size, bgPosition[key].color);
					break;
				case "ponHolder":
					if (bgPosition[key].x != undefined) {
						var x = bgPosition[key].x + offset.ponHolder.x * scaleFactor;
						var y = bgPosition[key].y + offset.ponHolder.y * scaleFactor;
						var _size = size * offset.ponHolder.size;
						BuildBoardGradientRectPiece(x, y, _size, _size, undefined, bgPosition[key].colors, [0, 1], x + _size / 2, y + _size / 2, 0, x + _size / 2, y + scaleFactor / 2, _size);
						BuildBoardPlayerPon(x + _size / 4.5, y + _size / 9, _size, _size, bgPosition[key].ponColor);
					}
					break;
				case "diceHolder":
					if (bgPosition[key].x != undefined) {
						var x = bgPosition[key].x + offset.diceHolder.x * scaleFactor;
						var y = bgPosition[key].y + offset.diceHolder.y * scaleFactor;
						var _size = size * offset.diceHolder.size;
						BuildBoardGradientRectPiece(x, y, _size, _size, undefined, bgPosition[key].colors, [0, 1], x + _size / 2, y + _size / 2, 0, x + _size / 2, y + scaleFactor / 2, _size);

						SetDiceHolderPos(bgPosition[key].ponColor, x - _size / 2.27, y - _size / 2.4, _size);
					}
					break;
				case "playerDataBG":
					if (bgPosition[key].x != undefined) {
						BuildBoardRoundRectPiece(bgPosition[key].x + offset.playerDataBG.x * scaleFactor, bgPosition[key].y + offset.playerDataBG.y * scaleFactor, size * offset.playerDataBG.width, size * offset.playerDataBG.height, bgPosition[key].color, undefined, 10, 10, 10, 10);
					}
					break;
				case "playerIcon":
					if (bgPosition[key].x != undefined) {
						var x = bgPosition[key].x + offset.playerIcon.x * scaleFactor;
						var y = bgPosition[key].y + offset.playerIcon.y * scaleFactor;
						var _size = size * offset.playerIcon.size;
						BuildBoardGradientRectPiece(x, y, _size, _size, undefined, bgPosition[key].colors, [0, 1], x + _size / 2, y + _size / 2, 0, x + _size / 2, y + scaleFactor / 2, _size);
					}
					break;
				case "playerImage":
					if (bgPosition[key].x != undefined) {
						BuildBoardRectPiece(bgPosition[key].x + offset.playerImage.x * scaleFactor, bgPosition[key].y + offset.playerImage.y * scaleFactor, size * offset.playerImage.size, size * offset.playerImage.size, bgPosition[key].color);
						BuildBoardPlayerAvatar(bgPosition[key].x + offset.playerImage.x * scaleFactor, bgPosition[key].y + offset.playerImage.y * scaleFactor, size * offset.playerImage.size, size * offset.playerImage.size, bgPosition[key].thumbnail);
					}
					break;
				case "playerName":
					if (bgPosition[key].x != undefined) BuildBoardPlayerText(bgPosition[key].x + offset.playerName.x * scaleFactor, bgPosition[key].y + offset.playerName.y * scaleFactor, bgPosition[key].text, bgPosition[key].font, bgPosition[key].color);
					break;
				case "playerLevel":
					if (bgPosition[key].x != undefined) BuildBoardPlayerText(bgPosition[key].x + offset.playerLevel.x * scaleFactor, bgPosition[key].y + offset.playerLevel.y * scaleFactor, bgPosition[key].text, bgPosition[key].font, bgPosition[key].color);
					break;
				default:
					break;
			}
		}
	}
}

function SetDiceHolderPos(ponColor, x, y, size) {
	switch (ponColor) {
		case "red":
			DiceHolder.red.x = x;
			DiceHolder.red.y = y;
			DiceHolder.red.size = size;
			DiceHolder.red.teamColor = ponColor;
			break;
		case "blue":
			DiceHolder.blue.x = x;
			DiceHolder.blue.y = y;
			DiceHolder.blue.size = size;
			DiceHolder.blue.teamColor = ponColor;
			break;
		case "yellow":
			DiceHolder.yellow.x = x;
			DiceHolder.yellow.y = y;
			DiceHolder.yellow.size = size;
			DiceHolder.yellow.teamColor = ponColor;
			break;
		case "green":
			DiceHolder.green.x = x;
			DiceHolder.green.y = y;
			DiceHolder.green.size = size;
			DiceHolder.green.teamColor = ponColor;
			break;
	}
}
