import { loader, stage, scaleFactor, GetDiceSpriteSheet } from "/js/index.js";
import { GetSidePonImagePath } from "/js/utils.js";
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
} from "/js/board-details.js";

export function BuildBoardRectPiece(
  x,
  y,
  width,
  height,
  fillColor,
  strokeColor = undefined
) {
  var rectangle = new createjs.Shape();
  if (strokeColor != undefined) {
    rectangle.graphics
      .beginStroke(strokeColor)
      .beginFill(fillColor)
      .drawRect(x, y, width, height);
  } else {
    rectangle.graphics.beginFill(fillColor).drawRect(x, y, width, height);
  }
  stage.addChild(rectangle);
}

export function BuildBoardGradientRectPiece(
  x,
  y,
  width,
  height,
  strokeColor = undefined,
  colors,
  ratios,
  x0,
  y0,
  r0,
  x1,
  y1,
  r1
) {
  var rectangle = new createjs.Shape();
  if (strokeColor != undefined) {
    rectangle.graphics
      .beginRadialGradientFill(colors, ratios, x0, y0, r0, x1, y1, r1)
      .beginStroke(strokeColor)
      .beginFill(fillColor)
      .drawRect(x, y, width, height);
  } else {
    rectangle.graphics
      .beginRadialGradientFill(colors, ratios, x0, y0, r0, x1, y1, r1)
      .drawRect(x, y, width, height);
  }
  stage.addChild(rectangle);
}

export function BuildBoardRoundRectPiece(
  x,
  y,
  width,
  height,
  fillColor,
  strokeColor = undefined,
  radiusTL,
  radiusTR,
  radiusBR,
  radiusBL
) {
  var rectangle = new createjs.Shape();
  if (strokeColor != undefined) {
    rectangle.graphics
      .beginStroke(strokeColor)
      .beginFill(fillColor)
      .drawRoundRectComplex(
        x,
        y,
        width,
        height,
        radiusTL,
        radiusTR,
        radiusBR,
        radiusBL
      );
  } else {
    rectangle.graphics
      .beginFill(fillColor)
      .drawRoundRectComplex(
        x,
        y,
        width,
        height,
        radiusTL,
        radiusTR,
        radiusBR,
        radiusBL
      );
  }
  stage.addChild(rectangle);
}

export function BuildBoardCirclePiece(
  x,
  y,
  radius,
  fillColor,
  strokeColor = undefined
) {
  var circle = new createjs.Shape();
  if (strokeColor != undefined) {
    circle.graphics
      .beginStroke(strokeColor)
      .beginFill(fillColor)
      .drawCircle(x, y, radius);
  } else {
    circle.graphics.beginFill(fillColor).drawCircle(x, y, radius);
  }
  stage.addChild(circle);
}

export function BuildBoardSavePoint(x, y, scaleX = 1, scaleY = 1) {
  var bitmap = new createjs.Bitmap(loader.getResult("savePoint"));
  bitmap.scaleX = scaleX / 130;
  bitmap.scaleY = scaleY / 130;
  bitmap.x = x;
  bitmap.y = y;
  stage.addChild(bitmap);
}

export function BuildBoardPlayerText(
  x,
  y,
  text = "Guest",
  font = "0.1em Arial",
  color = "#ff7700"
) {
  var text = new createjs.Text(text, font, color);
  text.x = x;
  text.y = y;
  text.textBaseline = "alphabetic";
  stage.addChild(text);
}

export function BuildBoardPlayerAvatar(
  x,
  y,
  scaleX = 1,
  scaleY = 1,
  thumbnail = undefined
) {
  let img = new Image();
  if (typeof thumbnail === "string") {
    img.src = thumbnail;
  } else {
    img = thumbnail;
  }

  img.onload = function () {
    console.log(img);
  };
  console.log(img);
  console.log(img.width);
  console.log(img.height);

  var bitmap = new createjs.Bitmap(thumbnail);
  bitmap.x = x;
  bitmap.y = y;
  bitmap.scaleX = scaleX / img.width;
  bitmap.scaleY = scaleY / img.height;
  stage.addChild(bitmap);
}

export function BuildBoardPlayerPon(x, y, scaleX = 1, scaleY = 1, ponColor) {
  var bitmap = new createjs.Bitmap(GetSidePonImagePath(ponColor));
  bitmap.scaleX = scaleX / 82;
  bitmap.scaleY = scaleY / 82;
  bitmap.x = x;
  bitmap.y = y;
  stage.addChild(bitmap);
}

export function BuildBoardPlayerDice(x, y, scaleX = 1, scaleY = 1) {
  var dice = new createjs.Sprite(GetDiceSpriteSheet(), "start");
  dice.x = x;
  dice.y = y;
  dice.scaleX = scaleX / 82;
  dice.scaleY = scaleY / 82;

  dice.addEventListener("click", () => {
    dice.gotoAndPlay("roll");
  });

  dice.addEventListener("animationend", () => {
    dice.gotoAndStop(Math.round(Math.random() * 5) + 19);
  });

  stage.addChild(dice);
}

export function BuildCenterBoardPiece(CenterDesign, BoardTemplate) {
  if (
    BoardTemplate == Board2_1 ||
    BoardTemplate == Board2_1_Mobile ||
    BoardTemplate == Board_1_Mobile ||
    BoardTemplate == Board3_1
  ) {
    BoardTemplate = Board_1;
  } else if (
    BoardTemplate == Board2_2 ||
    BoardTemplate == Board2_2_Mobile ||
    BoardTemplate == Board_2_Mobile ||
    BoardTemplate == Board3_2
  ) {
    BoardTemplate = Board_2;
  } else if (
    BoardTemplate == Board2_3 ||
    BoardTemplate == Board2_3_Mobile ||
    BoardTemplate == Board_3_Mobile ||
    BoardTemplate == Board3_3
  ) {
    BoardTemplate = Board_3;
  } else if (
    BoardTemplate == Board2_4 ||
    BoardTemplate == Board2_4_Mobile ||
    BoardTemplate == Board_4_Mobile ||
    BoardTemplate == Board3_4
  ) {
    BoardTemplate = Board_4;
  } else {
    BoardTemplate = Board_1;
  }

  // red = #FF2C28
  // blue = #1781BF
  // yellow = #FFDE2D
  // green = #009E23

  switch (BoardTemplate) {
    case Board_1:
      var shape1 = new createjs.Shape();
      shape1.graphics
        .beginFill("#FFDE2D")
        .beginStroke("black")
        .moveTo(CenterDesign.row01.x, CenterDesign.row01.y)
        .lineTo(CenterDesign.row03.x + scaleFactor, CenterDesign.row03.y)
        .lineTo(
          CenterDesign.row12.x + scaleFactor / 2,
          CenterDesign.row12.y + scaleFactor / 2
        )
        .lineTo(CenterDesign.row01.x, CenterDesign.row01.y)
        .endStroke();
      stage.addChild(shape1);

      var shape2 = new createjs.Shape();
      shape1.graphics
        .beginFill("#009E23")
        .beginStroke("black")
        .moveTo(CenterDesign.row01.x, CenterDesign.row01.y)
        .lineTo(CenterDesign.row21.x, CenterDesign.row21.y + scaleFactor)
        .lineTo(
          CenterDesign.row12.x + scaleFactor / 2,
          CenterDesign.row12.y + scaleFactor / 2
        )
        .lineTo(CenterDesign.row01.x, CenterDesign.row01.y)
        .endStroke();
      stage.addChild(shape2);

      var shape3 = new createjs.Shape();
      shape1.graphics
        .beginFill("#FF2C28")
        .beginStroke("black")
        .moveTo(CenterDesign.row21.x, CenterDesign.row21.y + scaleFactor)
        .lineTo(
          CenterDesign.row23.x + scaleFactor,
          CenterDesign.row23.y + scaleFactor
        )
        .lineTo(
          CenterDesign.row12.x + scaleFactor / 2,
          CenterDesign.row12.y + scaleFactor / 2
        )
        .lineTo(CenterDesign.row21.x, CenterDesign.row21.y + scaleFactor)
        .endStroke();
      stage.addChild(shape3);

      var shape4 = new createjs.Shape();
      shape1.graphics
        .beginFill("#1781BF")
        .beginStroke("black")
        .moveTo(CenterDesign.row03.x + scaleFactor, CenterDesign.row01.y)
        .lineTo(
          CenterDesign.row23.x + scaleFactor,
          CenterDesign.row23.y + scaleFactor
        )
        .lineTo(
          CenterDesign.row12.x + scaleFactor / 2,
          CenterDesign.row12.y + scaleFactor / 2
        )
        .lineTo(CenterDesign.row03.x + scaleFactor, CenterDesign.row01.y)
        .endStroke();
      stage.addChild(shape4);
      break;
    case Board_2:
      var shape1 = new createjs.Shape();
      shape1.graphics
        .beginFill("#009E23")
        .beginStroke("black")
        .moveTo(CenterDesign.row01.x, CenterDesign.row01.y)
        .lineTo(CenterDesign.row03.x + scaleFactor, CenterDesign.row03.y)
        .lineTo(
          CenterDesign.row12.x + scaleFactor / 2,
          CenterDesign.row12.y + scaleFactor / 2
        )
        .lineTo(CenterDesign.row01.x, CenterDesign.row01.y)
        .endStroke();
      stage.addChild(shape1);

      var shape2 = new createjs.Shape();
      shape1.graphics
        .beginFill("#FF2C28")
        .beginStroke("black")
        .moveTo(CenterDesign.row01.x, CenterDesign.row01.y)
        .lineTo(CenterDesign.row21.x, CenterDesign.row21.y + scaleFactor)
        .lineTo(
          CenterDesign.row12.x + scaleFactor / 2,
          CenterDesign.row12.y + scaleFactor / 2
        )
        .lineTo(CenterDesign.row01.x, CenterDesign.row01.y)
        .endStroke();
      stage.addChild(shape2);

      var shape3 = new createjs.Shape();
      shape1.graphics
        .beginFill("#1781BF")
        .beginStroke("black")
        .moveTo(CenterDesign.row21.x, CenterDesign.row21.y + scaleFactor)
        .lineTo(
          CenterDesign.row23.x + scaleFactor,
          CenterDesign.row23.y + scaleFactor
        )
        .lineTo(
          CenterDesign.row12.x + scaleFactor / 2,
          CenterDesign.row12.y + scaleFactor / 2
        )
        .lineTo(CenterDesign.row21.x, CenterDesign.row21.y + scaleFactor)
        .endStroke();
      stage.addChild(shape3);

      var shape4 = new createjs.Shape();
      shape1.graphics
        .beginFill("#FFDE2D")
        .beginStroke("black")
        .moveTo(CenterDesign.row03.x + scaleFactor, CenterDesign.row01.y)
        .lineTo(
          CenterDesign.row23.x + scaleFactor,
          CenterDesign.row23.y + scaleFactor
        )
        .lineTo(
          CenterDesign.row12.x + scaleFactor / 2,
          CenterDesign.row12.y + scaleFactor / 2
        )
        .lineTo(CenterDesign.row03.x + scaleFactor, CenterDesign.row01.y)
        .endStroke();
      stage.addChild(shape4);
      break;
    case Board_3:
      var shape1 = new createjs.Shape();
      shape1.graphics
        .beginFill("#FF2C28")
        .beginStroke("black")
        .moveTo(CenterDesign.row01.x, CenterDesign.row01.y)
        .lineTo(CenterDesign.row03.x + scaleFactor, CenterDesign.row03.y)
        .lineTo(
          CenterDesign.row12.x + scaleFactor / 2,
          CenterDesign.row12.y + scaleFactor / 2
        )
        .lineTo(CenterDesign.row01.x, CenterDesign.row01.y)
        .endStroke();
      stage.addChild(shape1);

      var shape2 = new createjs.Shape();
      shape1.graphics
        .beginFill("#1781BF")
        .beginStroke("black")
        .moveTo(CenterDesign.row01.x, CenterDesign.row01.y)
        .lineTo(CenterDesign.row21.x, CenterDesign.row21.y + scaleFactor)
        .lineTo(
          CenterDesign.row12.x + scaleFactor / 2,
          CenterDesign.row12.y + scaleFactor / 2
        )
        .lineTo(CenterDesign.row01.x, CenterDesign.row01.y)
        .endStroke();
      stage.addChild(shape2);

      var shape3 = new createjs.Shape();
      shape1.graphics
        .beginFill("#FFDE2D")
        .beginStroke("black")
        .moveTo(CenterDesign.row21.x, CenterDesign.row21.y + scaleFactor)
        .lineTo(
          CenterDesign.row23.x + scaleFactor,
          CenterDesign.row23.y + scaleFactor
        )
        .lineTo(
          CenterDesign.row12.x + scaleFactor / 2,
          CenterDesign.row12.y + scaleFactor / 2
        )
        .lineTo(CenterDesign.row21.x, CenterDesign.row21.y + scaleFactor)
        .endStroke();
      stage.addChild(shape3);

      var shape4 = new createjs.Shape();
      shape1.graphics
        .beginFill("#009E23")
        .beginStroke("black")
        .moveTo(CenterDesign.row03.x + scaleFactor, CenterDesign.row01.y)
        .lineTo(
          CenterDesign.row23.x + scaleFactor,
          CenterDesign.row23.y + scaleFactor
        )
        .lineTo(
          CenterDesign.row12.x + scaleFactor / 2,
          CenterDesign.row12.y + scaleFactor / 2
        )
        .lineTo(CenterDesign.row03.x + scaleFactor, CenterDesign.row01.y)
        .endStroke();
      stage.addChild(shape4);
      break;
    case Board_4:
      var shape1 = new createjs.Shape();
      shape1.graphics
        .beginFill("#1781BF")
        .beginStroke("black")
        .moveTo(CenterDesign.row01.x, CenterDesign.row01.y)
        .lineTo(CenterDesign.row03.x + scaleFactor, CenterDesign.row03.y)
        .lineTo(
          CenterDesign.row12.x + scaleFactor / 2,
          CenterDesign.row12.y + scaleFactor / 2
        )
        .lineTo(CenterDesign.row01.x, CenterDesign.row01.y)
        .endStroke();
      stage.addChild(shape1);

      var shape2 = new createjs.Shape();
      shape1.graphics
        .beginFill("#FFDE2D")
        .beginStroke("black")
        .moveTo(CenterDesign.row01.x, CenterDesign.row01.y)
        .lineTo(CenterDesign.row21.x, CenterDesign.row21.y + scaleFactor)
        .lineTo(
          CenterDesign.row12.x + scaleFactor / 2,
          CenterDesign.row12.y + scaleFactor / 2
        )
        .lineTo(CenterDesign.row01.x, CenterDesign.row01.y)
        .endStroke();
      stage.addChild(shape2);

      var shape3 = new createjs.Shape();
      shape1.graphics
        .beginFill("#009E23")
        .beginStroke("black")
        .moveTo(CenterDesign.row21.x, CenterDesign.row21.y + scaleFactor)
        .lineTo(
          CenterDesign.row23.x + scaleFactor,
          CenterDesign.row23.y + scaleFactor
        )
        .lineTo(
          CenterDesign.row12.x + scaleFactor / 2,
          CenterDesign.row12.y + scaleFactor / 2
        )
        .lineTo(CenterDesign.row21.x, CenterDesign.row21.y + scaleFactor)
        .endStroke();
      stage.addChild(shape3);

      var shape4 = new createjs.Shape();
      shape1.graphics
        .beginFill("#FF2C28")
        .beginStroke("black")
        .moveTo(CenterDesign.row03.x + scaleFactor, CenterDesign.row01.y)
        .lineTo(
          CenterDesign.row23.x + scaleFactor,
          CenterDesign.row23.y + scaleFactor
        )
        .lineTo(
          CenterDesign.row12.x + scaleFactor / 2,
          CenterDesign.row12.y + scaleFactor / 2
        )
        .lineTo(CenterDesign.row03.x + scaleFactor, CenterDesign.row01.y)
        .endStroke();
      stage.addChild(shape4);
      break;
  }
}
