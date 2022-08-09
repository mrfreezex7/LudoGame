import {vm} from "/js/events.js";
import {
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
	MovementPosition1,
	MovementPosition2,
	MovementPosition3,
	MovementPosition4,
	MovementPosition1_Mobile,
	MovementPosition2_Mobile,
	MovementPosition3_Mobile,
	MovementPosition4_Mobile,
} from "/js/board-details.js";
import {CurrentDevice} from "/js/index.js";
import {Device} from "/js/utils.js";

export const DefaultTeamColors = ["red", "blue", "yellow", "green"];

export function GetThreePlayerTeamColor() {
	switch (GetGameBoard()) {
		case Board3_1:
			return ["red", "yellow", "green"];
		case Board3_2:
			return ["blue", "green", "red"];
		case Board3_3:
			return ["yellow", "red", "blue"];
		case Board3_4:
			return ["green", "red", "blue"];
		//set diffent test case logic for online games
	}
}

export function GetGameBoard() {
	const FinalOption = vm.FinalOptions;

	switch (FinalOption.SelectedMode) {
		case "computer":
			switch (FinalOption.SelectedPlayers) {
				case "two":
					switch (FinalOption.SelectedColor) {
						case "red":
							return CurrentDevice != Device.MOBILE ? Board2_1 : Board2_1_Mobile;
						case "blue":
							return CurrentDevice != Device.MOBILE ? Board2_2 : Board2_2_Mobile;
						case "yellow":
							return CurrentDevice != Device.MOBILE ? Board2_3 : Board2_3_Mobile;
						case "green":
							return CurrentDevice != Device.MOBILE ? Board2_4 : Board2_4_Mobile;
					}
					break;
				case "three":
					switch (FinalOption.SelectedColor) {
						case "red":
							return Board3_1;
						case "blue":
							return Board3_2;
						case "yellow":
							return Board3_3;
						case "green":
							return Board3_4;
					}
					break;
				case "four":
					switch (FinalOption.SelectedColor) {
						case "red":
							return CurrentDevice != Device.MOBILE ? Board_1 : Board_1_Mobile;
						case "blue":
							return CurrentDevice != Device.MOBILE ? Board_2 : Board_2_Mobile;
						case "yellow":
							return CurrentDevice != Device.MOBILE ? Board_3 : Board_3_Mobile;
						case "green":
							return CurrentDevice != Device.MOBILE ? Board_4 : Board_4_Mobile;
					}
					break;
			}
			break;
		case "local":
			switch (FinalOption.SelectedPlayers) {
				case "two":
					switch (FinalOption.SelectedColor) {
						case "red":
							return CurrentDevice != Device.MOBILE ? Board2_1 : Board2_1_Mobile;
						case "blue":
							return CurrentDevice != Device.MOBILE ? Board2_2 : Board2_2_Mobile;
						case "yellow":
							return CurrentDevice != Device.MOBILE ? Board2_3 : Board2_3_Mobile;
						case "green":
							return CurrentDevice != Device.MOBILE ? Board2_4 : Board2_4_Mobile;
					}
					break;
				case "three":
					switch (FinalOption.SelectedColor) {
						case "red":
							return Board3_1;
					}
					break;
				case "four":
					switch (FinalOption.SelectedColor) {
						case "red":
							return CurrentDevice != Device.MOBILE ? Board_1 : Board_1_Mobile;
						case "blue":
							return CurrentDevice != Device.MOBILE ? Board_2 : Board_2_Mobile;
						case "yellow":
							return CurrentDevice != Device.MOBILE ? Board_3 : Board_3_Mobile;
						case "green":
							return CurrentDevice != Device.MOBILE ? Board_4 : Board_4_Mobile;
					}
					break;
			}
			break;
		case "online":
			switch (FinalOption.SelectedPlayers) {
				case "two":
					switch (FinalOption.SelectedColor) {
						case "red":
							return Board2_1;
						case "blue":
							return Board2_2;
						case "yellow":
							return Board2_3;
						case "green":
							return Board2_4;
					}
					break;
				case "three":
					switch (FinalOption.SelectedColor) {
						case "red":
							return Board3_1_Online;
						case "blue":
							return Board3_2_Online;
						case "yellow":
							return Board3_3_Online;
					}
					break;
				case "four":
					switch (FinalOption.SelectedColor) {
						case "red":
							return Board_1;
						case "blue":
							return Board_2;
						case "yellow":
							return Board_3;
						case "green":
							return Board_4;
					}
					break;
			}
			break;
	}
}
export function GetSelectedGameMode() {
	return vm.FinalOptions.SelectedMode;
}

export function GetFinalOptions() {
	return vm.FinalOptions;
}

export function GetPawnSpawnCirclePos(teamColor) {
	switch (GetGameBoard()) {
		case Board_1:
			switch (teamColor) {
				case "red":
					return PawnSpawnCirle1;
				case "blue":
					return PawnSpawnCirle2;
				case "yellow":
					return PawnSpawnCirle3;
				case "green":
					return PawnSpawnCirle4;
			}
			break;
		case Board_2:
			switch (teamColor) {
				case "blue":
					return PawnSpawnCirle1;
				case "yellow":
					return PawnSpawnCirle2;
				case "green":
					return PawnSpawnCirle3;
				case "red":
					return PawnSpawnCirle4;
			}
			break;
		case Board_3:
			switch (teamColor) {
				case "yellow":
					return PawnSpawnCirle1;
				case "green":
					return PawnSpawnCirle2;
				case "red":
					return PawnSpawnCirle3;
				case "blue":
					return PawnSpawnCirle4;
			}
			break;
		case Board_4:
			switch (teamColor) {
				case "green":
					return PawnSpawnCirle1;
				case "red":
					return PawnSpawnCirle2;
				case "blue":
					return PawnSpawnCirle3;
				case "yellow":
					return PawnSpawnCirle4;
			}
			break;
		case Board3_1:
			switch (teamColor) {
				case "red":
					return PawnSpawnCirle1;
				case "blue":
					return PawnSpawnCirle2;
				case "yellow":
					return PawnSpawnCirle3;
				case "green":
					return PawnSpawnCirle4;
			}
			break;
		case Board3_2:
			switch (teamColor) {
				case "blue":
					return PawnSpawnCirle1;
				case "yellow":
					return PawnSpawnCirle2;
				case "green":
					return PawnSpawnCirle3;
				case "red":
					return PawnSpawnCirle4;
			}
			break;
		case Board3_3:
			switch (teamColor) {
				case "yellow":
					return PawnSpawnCirle1;
				case "green":
					return PawnSpawnCirle2;
				case "red":
					return PawnSpawnCirle3;
				case "blue":
					return PawnSpawnCirle4;
			}
			break;
		case Board3_4:
			switch (teamColor) {
				case "green":
					return PawnSpawnCirle1;
				case "red":
					return PawnSpawnCirle2;
				case "blue":
					return PawnSpawnCirle3;
				case "yellow":
					return PawnSpawnCirle4;
			}
			break;
		case Board3_1_Online:
			switch (teamColor) {
				case "red":
					return PawnSpawnCirle1;
				case "blue":
					return PawnSpawnCirle2;
				case "yellow":
					return PawnSpawnCirle3;
				case "green":
					return PawnSpawnCirle4;
			}
			break;
		case Board3_2_Online:
			switch (teamColor) {
				case "blue":
					return PawnSpawnCirle1;
				case "yellow":
					return PawnSpawnCirle2;
				case "red":
					return PawnSpawnCirle3;
				case "green":
					return PawnSpawnCirle4;
			}
			break;
		case Board3_3_Online:
			switch (teamColor) {
				case "yellow":
					return PawnSpawnCirle1;
				case "blue":
					return PawnSpawnCirle2;
				case "red":
					return PawnSpawnCirle3;
				case "green":
					return PawnSpawnCirle4;
			}
			break;
		case Board2_1:
			switch (teamColor) {
				case "red":
					return PawnSpawnCirle1;
				case "yellow":
					return PawnSpawnCirle3;
			}
			break;
		case Board2_2:
			switch (teamColor) {
				case "blue":
					return PawnSpawnCirle1;
				case "green":
					return PawnSpawnCirle3;
			}
			break;
		case Board2_3:
			switch (teamColor) {
				case "yellow":
					return PawnSpawnCirle1;
				case "red":
					return PawnSpawnCirle3;
			}
			break;
		case Board2_4:
			switch (teamColor) {
				case "blue":
					return PawnSpawnCirle3;
				case "green":
					return PawnSpawnCirle1;
			}
			break;
		case Board_1_Mobile:
			switch (teamColor) {
				case "red":
					return PawnSpawnCirle1_Mobile;
				case "blue":
					return PawnSpawnCirle2_Mobile;
				case "yellow":
					return PawnSpawnCirle3_Mobile;
				case "green":
					return PawnSpawnCirle4_Mobile;
			}
			break;
		case Board_2_Mobile:
			switch (teamColor) {
				case "blue":
					return PawnSpawnCirle1_Mobile;
				case "yellow":
					return PawnSpawnCirle2_Mobile;
				case "green":
					return PawnSpawnCirle3_Mobile;
				case "red":
					return PawnSpawnCirle4_Mobile;
			}
			break;
		case Board_3_Mobile:
			switch (teamColor) {
				case "yellow":
					return PawnSpawnCirle1_Mobile;
				case "green":
					return PawnSpawnCirle2_Mobile;
				case "red":
					return PawnSpawnCirle3_Mobile;
				case "blue":
					return PawnSpawnCirle4_Mobile;
			}
			break;
		case Board_4_Mobile:
			switch (teamColor) {
				case "green":
					return PawnSpawnCirle1_Mobile;
				case "red":
					return PawnSpawnCirle2_Mobile;
				case "blue":
					return PawnSpawnCirle3_Mobile;
				case "yellow":
					return PawnSpawnCirle4_Mobile;
			}
			break;
		case Board2_1_Mobile:
			switch (teamColor) {
				case "red":
					return PawnSpawnCirle1_Mobile;
				case "yellow":
					return PawnSpawnCirle3_Mobile;
			}
			break;
		case Board2_2_Mobile:
			switch (teamColor) {
				case "blue":
					return PawnSpawnCirle1_Mobile;
				case "green":
					return PawnSpawnCirle3_Mobile;
			}
			break;
		case Board2_3_Mobile:
			switch (teamColor) {
				case "yellow":
					return PawnSpawnCirle1_Mobile;
				case "red":
					return PawnSpawnCirle3_Mobile;
			}
			break;
		case Board2_4_Mobile:
			switch (teamColor) {
				case "green":
					return PawnSpawnCirle1_Mobile;
				case "blue":
					return PawnSpawnCirle3_Mobile;
			}
			break;
	}
}

export function GetMovementPositions(teamColor) {
	switch (GetGameBoard()) {
		case Board_1:
			switch (teamColor) {
				case "red":
					return MovementPosition1;
				case "blue":
					return MovementPosition2;
				case "yellow":
					return MovementPosition3;
				case "green":
					return MovementPosition4;
			}
			break;
		case Board_2:
			switch (teamColor) {
				case "blue":
					return MovementPosition1;
				case "yellow":
					return MovementPosition2;
				case "green":
					return MovementPosition3;
				case "red":
					return MovementPosition4;
			}
			break;
		case Board_3:
			switch (teamColor) {
				case "yellow":
					return MovementPosition1;
				case "green":
					return MovementPosition2;
				case "red":
					return MovementPosition3;
				case "blue":
					return MovementPosition4;
			}
			break;
		case Board_4:
			switch (teamColor) {
				case "green":
					return MovementPosition1;
				case "red":
					return MovementPosition2;
				case "blue":
					return MovementPosition3;
				case "yellow":
					return MovementPosition4;
			}
			break;
		case Board3_1:
			switch (teamColor) {
				case "red":
					return MovementPosition1;
				case "blue":
					return MovementPosition2;
				case "yellow":
					return MovementPosition3;
				case "green":
					return MovementPosition4;
			}
			break;
		case Board3_2:
			switch (teamColor) {
				case "blue":
					return MovementPosition1;
				case "yellow":
					return MovementPosition2;
				case "green":
					return MovementPosition3;
				case "red":
					return MovementPosition4;
			}
			break;
		case Board3_3:
			switch (teamColor) {
				case "yellow":
					return MovementPosition1;
				case "green":
					return MovementPosition2;
				case "red":
					return MovementPosition3;
				case "blue":
					return MovementPosition4;
			}
			break;
		case Board3_4:
			switch (teamColor) {
				case "green":
					return MovementPosition1;
				case "red":
					return MovementPosition2;
				case "blue":
					return MovementPosition3;
				case "yellow":
					return MovementPosition4;
			}
			break;
		case Board3_1_Online:
			switch (teamColor) {
				case "red":
					return MovementPosition1;
				case "blue":
					return MovementPosition2;
				case "yellow":
					return MovementPosition3;
				case "green":
					return MovementPosition4;
			}
			break;
		case Board3_2_Online:
			switch (teamColor) {
				case "blue":
					return MovementPosition1;
				case "yellow":
					return MovementPosition2;
				case "red":
					return MovementPosition3;
				case "green":
					return MovementPosition4;
			}
			break;
		case Board3_3_Online:
			switch (teamColor) {
				case "yellow":
					return MovementPosition1;
				case "blue":
					return MovementPosition2;
				case "red":
					return MovementPosition3;
				case "green":
					return MovementPosition4;
			}
			break;
		case Board2_1:
			switch (teamColor) {
				case "red":
					return MovementPosition1;
				case "yellow":
					return MovementPosition3;
			}
			break;
		case Board2_2:
			switch (teamColor) {
				case "blue":
					return MovementPosition1;
				case "green":
					return MovementPosition3;
			}
			break;
		case Board2_3:
			switch (teamColor) {
				case "yellow":
					return MovementPosition1;
				case "red":
					return MovementPosition3;
			}
			break;
		case Board2_4:
			switch (teamColor) {
				case "blue":
					return MovementPosition3;
				case "green":
					return MovementPosition1;
			}
			break;
		case Board_1_Mobile:
			switch (teamColor) {
				case "red":
					return MovementPosition1_Mobile;
				case "blue":
					return MovementPosition2_Mobile;
				case "yellow":
					return MovementPosition3_Mobile;
				case "green":
					return MovementPosition4_Mobile;
			}
			break;
		case Board_2_Mobile:
			switch (teamColor) {
				case "blue":
					return MovementPosition1_Mobile;
				case "yellow":
					return MovementPosition2_Mobile;
				case "green":
					return MovementPosition3_Mobile;
				case "red":
					return MovementPosition4_Mobile;
			}
			break;
		case Board_3_Mobile:
			switch (teamColor) {
				case "yellow":
					return MovementPosition1_Mobile;
				case "green":
					return MovementPosition2_Mobile;
				case "red":
					return MovementPosition3_Mobile;
				case "blue":
					return MovementPosition4_Mobile;
			}
			break;
		case Board_4_Mobile:
			switch (teamColor) {
				case "green":
					return MovementPosition1_Mobile;
				case "red":
					return MovementPosition2_Mobile;
				case "blue":
					return MovementPosition3_Mobile;
				case "yellow":
					return MovementPosition4_Mobile;
			}
			break;
		case Board2_1_Mobile:
			switch (teamColor) {
				case "red":
					return MovementPosition1_Mobile;
				case "yellow":
					return MovementPosition3_Mobile;
			}
			break;
		case Board2_2_Mobile:
			switch (teamColor) {
				case "blue":
					return MovementPosition1_Mobile;
				case "green":
					return MovementPosition3_Mobile;
			}
			break;
		case Board2_3_Mobile:
			switch (teamColor) {
				case "yellow":
					return MovementPosition1_Mobile;
				case "red":
					return MovementPosition3_Mobile;
			}
			break;
		case Board2_4_Mobile:
			switch (teamColor) {
				case "green":
					return MovementPosition1_Mobile;
				case "blue":
					return MovementPosition3_Mobile;
			}
			break;
	}
}
