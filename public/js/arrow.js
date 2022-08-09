import { stage, loader } from "/js/index.js";
import { GetGameBoard } from "/js/options.js";
import { Board3_1, Board3_2, Board3_3, Board3_4, Board_1, Board_2, Board_3, Board_4, Board_1_Mobile, Board_2_Mobile, Board_3_Mobile, Board_4_Mobile, Board2_1, Board2_2, Board2_3, Board2_4, Board2_1_Mobile, Board2_2_Mobile, Board2_3_Mobile, Board2_4_Mobile, PawnSpawnCirle1, PawnSpawnCirle2, PawnSpawnCirle3, PawnSpawnCirle4, PawnSpawnCirle1_Mobile, PawnSpawnCirle2_Mobile, PawnSpawnCirle3_Mobile, PawnSpawnCirle4_Mobile, MovementPosition1, MovementPosition2, MovementPosition3, MovementPosition4, MovementPosition1_Mobile, MovementPosition2_Mobile, MovementPosition3_Mobile, MovementPosition4_Mobile } from "/js/board-details.js";


export function PlayerArrow(x, y, scaleX = 1, scaleY = 1, offsetType) {

    let arrow = new createjs.Bitmap(loader.getResult("arrow"));

    arrow.scaleX = scaleX / 82;
    arrow.scaleY = scaleY / 82;

    arrow.visible = true;

    this.arrow = arrow;

    this.update = function (x, y, teamColor) {
        arrow.visible = true;
        SetArrowPosition(x, y, teamColor, this.arrow);
    }

    this.setActive = function (bool) {
        arrow.visible = bool;
    }

    this.update(x, y, offsetType);

    stage.addChild(arrow);

}



function SetArrowPosition(x, y, teamColor, target) {

    let offset = getArrowOffset(teamColor);
    target.x = x * offset.x;
    target.y = y * offset.y;

    switch (offset.type) {
        case "TOPLEFT":
            target.rotation = -90;
            break;
        case "TOPRIGHT":
            target.rotation = -90;
            break;
        case "BOTTOMLEFT":
            target.rotation = 90;
            break;
        case "BOTTOMRIGHT":
            target.rotation = 90;
            break;
        default:
            target.visible = false;
            break;
    }

    createjs.Tween.get(target, { loop: true, override: true })
        .to({ y: target.y * 1.02 }, 200)
        .to({ y: target.y }, 200);

}

let offset = {
    BottomLeftOffset: { x: 1.95, y: 0.94, type: "BOTTOMLEFT" },
    BottomRightOffset: { x: 1.083, y: 0.94, type: "BOTTOMRIGHT" },
    TopLeftOffset: { x: 1.4, y: 2, type: "TOPLEFT" },
    TopRightOffset: { x: 1.035, y: 2, type: "TOPRIGHT" }
}

function getArrowOffset(teamColor) {

    let Board = GetGameBoard();

    if (Board === Board_1 || Board === Board2_1 || Board === Board2_1_Mobile || Board === Board3_1) {
        switch (teamColor) {
            case "red": return offset.BottomLeftOffset;
            case "blue": return offset.BottomRightOffset;
            case "yellow": return offset.TopRightOffset;
            case "green": return offset.TopLeftOffset;
        }
    } else if (Board === Board_2 || Board === Board2_2 || Board === Board2_2_Mobile || Board === Board3_2) {
        switch (teamColor) {
            case "blue": return offset.BottomLeftOffset;
            case "yellow": return offset.BottomRightOffset;
            case "green": return offset.TopRightOffset;
            case "red": return offset.TopLeftOffset;
        }
    } else if (Board === Board_3 || Board === Board2_3 || Board === Board2_3_Mobile || Board === Board3_3) {
        switch (teamColor) {
            case "yellow": return offset.BottomLeftOffset;
            case "green": return offset.BottomRightOffset;
            case "red": return offset.TopRightOffset;
            case "blue": return offset.TopLeftOffset;
        }
    } else if (Board === Board_4 || Board === Board2_4 || Board === Board2_4_Mobile || Board === Board3_4) {
        switch (teamColor) {
            case "green": return offset.BottomLeftOffset;
            case "red": return offset.BottomRightOffset;
            case "blue": return offset.TopRightOffset;
            case "yellow": return offset.TopLeftOffset;
        }
    }



}

