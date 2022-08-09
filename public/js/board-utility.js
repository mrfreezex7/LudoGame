import { Board_1, Board_2, Board_3, Board_4, Board2_1, Board2_2, Board2_3, Board2_4, PawnSpawnCirle1, PawnSpawnCirle2, PawnSpawnCirle3, PawnSpawnCirle4, CenterDesign, RedData, BlueData, YellowData, GreenData, RedData_Mobile, BlueData_Mobile, YellowData_Mobile, GreenData_Mobile, BottomLeftOffset, BottomRightOffset, TopLeftOffset, TopRightOffset } from "/js/board-details.js";
import { CurrentDevice } from "/js/index.js";
import { Device } from "/js/utils.js";

export function GetBoardDataObject(color) {
    switch (color) {
        case 'red': return CurrentDevice != Device.MOBILE ? RedData : RedData_Mobile;
        case 'blue': return CurrentDevice != Device.MOBILE ? BlueData : BlueData_Mobile;
        case 'yellow': return CurrentDevice != Device.MOBILE ? YellowData : YellowData_Mobile;
        case 'green': return CurrentDevice != Device.MOBILE ? GreenData : GreenData_Mobile;
    }
}

export function GetSecondPlayerColor(SelectedColor) {
    if (SelectedColor == "red") return "yellow";
    else if (SelectedColor == "blue") return "green";
    else if (SelectedColor == "yellow") return "red";
    else if (SelectedColor == "green") return "blue";
}