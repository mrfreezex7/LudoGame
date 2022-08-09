import { GetGamePonImagePath } from "/js/utils.js";
import { stage, scaleFactor, StartPositionX, StartPositionY, GetPonSelectorSpriteSheet } from "/js/index.js";
import { GetDiceValue } from "/js/game-manager.js";
import { RerunDice, Dice } from "/js/manage-dice.js";
import { GetMovementPositions } from "/js/options.js";
import { ReorganizeAllPawns, OrganizeAllPons, DeactivateAllPawns, ValidatePons, CheckAllPonInStackAndOrganize, LayerOrderAllPons } from "/js/manage-pawns.js";
import { vm, socket } from "/js/events.js";

export function Pawn(ponName, isOwner = false, x, y, scaleX = 1, scaleY = 1, ponColor, networkId, isOnline = false) {

    this.NetworkId = networkId;

    this.PonHomePosition = {
        scaleX: scaleX / 70,
        scaleY: scaleY / 70,
        x: x - (scaleX / 19),
        y: y - (scaleY / 8)
    }

    this.PonHomeSelectorPosition = {
        scaleX: scaleX / 100,
        scaleY: scaleY / 100,
        x: x - (scaleX / 9),
        y: y + (scaleY / 3.5)
    }

    var ponSelector = new createjs.Sprite(GetPonSelectorSpriteSheet(), "rotate");

    ponSelector.scaleX = scaleX / 100;
    ponSelector.scaleY = scaleY / 100;
    ponSelector.x = x - (scaleX / 9);
    ponSelector.y = y + (scaleY / 3.5);
    ponSelector.visible = false;
    stage.addChild(ponSelector)

    var pon = new createjs.Bitmap(GetGamePonImagePath(ponColor));

    this.displayObject = pon;
    this.ponName = ponName;
    this.pon = pon;
    this.ponSelector = ponSelector;
    this.ponColor = ponColor;
    this.isOwner = isOwner;
    this.isCurrentTurn = false;
    this.isUnlocked = false;
    this.currentIndex = 0;
    this.commonIndex = 0;
    this.maxLayerIndex = stage.children.length;
    this.layerIndex = 0;
    this.oldCommonIndex = 0;
    this.offsetX = 0.9;
    this.offsetY = 1.5;
    this.isWon = false;
    this.isOnline = isOnline;

    pon.scaleX = scaleX / 70;
    pon.scaleY = scaleY / 70;
    pon.x = x - (scaleX / 19);
    pon.y = y - (scaleY / 8);
    stage.addChild(pon);

    const OriginalState = {
        scaleX: pon.scaleX,
        scaleY: pon.scaleY,
        x: pon.x,
        y: pon.y
    }


    this.UpdatePonPosition = function () {
        var movePosition = GetMovementPositions(this.ponColor);
        var moveIndex = this.currentIndex < 1 ? 0 : this.currentIndex - 1;
        if (this.currentIndex <= 0) {
            this.setOriginalState(this.PonHomePosition.x, this.PonHomePosition.y);
            this.ResetToHomeState();
            this.currentIndex = 0;
            this.oldCommonIndex = 0;
            return;
        } else {
            var x = (StartPositionX + movePosition[moveIndex].x - this.offsetX) * scaleFactor;
            var y = (StartPositionY + movePosition[moveIndex].y - this.offsetY) * scaleFactor;
            pon.x = x;
            pon.y = y;
            ponSelector.x = x - (scaleX / 18);
            ponSelector.y = y + (scaleY / 2.4);
            this.setOriginalState(x, y);
        }
        CheckAllPonInStackAndOrganize();

    }

    if (isOwner) {
        pon.addEventListener("click", () => {
            if (!this.isOnline) {
                if (this.isCurrentTurn) {
                    // stage.getChildIndex(this.pon);
                    // stage.setChildIndex(this.pon, 130);
                    // var index = stage.getChildIndex(this.pon);
                    // console.log(stage.children.length);
                    var movePosition = GetMovementPositions(this.ponColor);

                    if (!this.isUnlocked) {
                        this.SetAnimatePosition(movePosition, 1, 1);
                    } else if (GetDiceValue() == 6) {
                        var moveIndex = (this.currentIndex + 6);
                        this.SetAnimatePosition(movePosition, moveIndex, 6);
                    } else {
                        var moveIndex = (this.currentIndex + GetDiceValue());
                        this.SetAnimatePosition(movePosition, moveIndex, GetDiceValue());
                    }
                    this.isCurrentTurn = false;
                    DeactivateAllPawns();
                }
            } else {
                if (this.isCurrentTurn) {
                    socket.emit("ponClick", {
                        "RoomName": vm.FinalOptions.GameRoom.RoomName,
                        "TeamColor": this.ponColor,
                        "NetworkId": this.NetworkId
                    });
                    this.OnlinePonClick();
                }
            }
        })
    }

    this.PonClick = function () {
        if (!this.isOnline) {
            if (this.isCurrentTurn) {
                var movePosition = GetMovementPositions(this.ponColor);

                if (!this.isUnlocked) {
                    this.SetAnimatePosition(movePosition, 1, 1);
                } else if (GetDiceValue() == 6) {
                    var moveIndex = (this.currentIndex + 6);
                    this.SetAnimatePosition(movePosition, moveIndex, 6);
                } else {
                    var moveIndex = (this.currentIndex + GetDiceValue());
                    this.SetAnimatePosition(movePosition, moveIndex, GetDiceValue());
                }
                this.isCurrentTurn = false;
                DeactivateAllPawns();
            }
        } else {
            if (this.isCurrentTurn) {
                socket.emit("ponClick", {
                    "RoomName": vm.FinalOptions.GameRoom.RoomName,
                    "TeamColor": this.ponColor,
                    "NetworkId": this.NetworkId
                });
                this.OnlinePonClick();
            }
        }
    }

    this.OnlinePonClick = function () {
        if (this.isCurrentTurn) {
            var movePosition = GetMovementPositions(this.ponColor);

            if (!this.isUnlocked) {
                this.SetAnimatePosition(movePosition, 1, 1);
            } else if (GetDiceValue() == 6) {
                var moveIndex = (this.currentIndex + 6);
                this.SetAnimatePosition(movePosition, moveIndex, 6);
            } else {
                var moveIndex = (this.currentIndex + GetDiceValue());
                this.SetAnimatePosition(movePosition, moveIndex, GetDiceValue());
            }
            this.isCurrentTurn = false;
            DeactivateAllPawns();
        }
    }

    this.SetAnimatePosition = function (movePosition, index, difference) {

        var x = [];
        var y = [];

        for (let i = 1; i <= difference; i++) {
            x.push((StartPositionX + movePosition[index - i].x - this.offsetX) * scaleFactor);
            y.push((StartPositionY + movePosition[index - i].y - this.offsetY) * scaleFactor);
        }


        this.currentIndex = index;
        this.commonIndex = movePosition[this.currentIndex - 1].commonIndex;
        this.layerIndex = movePosition[this.currentIndex - 1].layerIndex;

        ponSelector.x = x[0] - (scaleX / 18);
        ponSelector.y = y[0] + (scaleY / 2.4);


        switch (difference) {
            case 1:
                this.ResetToOriginalState();
                ReorganizeAllPawns(this.commonIndex, this.ponColor);
                OrganizeAllPons(this.oldCommonIndex);
                createjs.Tween.get(pon, { loop: false, override: true }).to({ x: x[0], y: y[0] }, 200).call(() => {
                    createjs.Sound.play("pawnMove");
                }).wait(50)
                    .call(() => {
                        this.setOriginalState(x[0], y[0]);
                        ValidatePons(this, this.commonIndex, 1);

                        LayerOrderAllPons(this.ponColor);
                    })
                break;
            case 2:
                this.ResetToOriginalState();
                ReorganizeAllPawns(this.commonIndex, this.ponColor);
                OrganizeAllPons(this.oldCommonIndex);
                createjs.Tween.get(pon, { loop: false, override: true })
                    .to({ x: x[difference - 1], y: y[difference - 1] }, 200).call(() => {
                        createjs.Sound.play("pawnMove");
                    }).wait(50)
                    .to({ x: x[difference - 2], y: y[difference - 2] }, 200).call(() => {
                        createjs.Sound.play("pawnMove");
                    }).wait(50)
                    .call(() => {
                        this.setOriginalState(x[difference - 2], y[difference - 2]);
                        ValidatePons(this, this.commonIndex, 2);
                        LayerOrderAllPons(this.ponColor);
                    })
                break;

            case 3:
                this.ResetToOriginalState();
                ReorganizeAllPawns(this.commonIndex, this.ponColor);
                OrganizeAllPons(this.oldCommonIndex);
                createjs.Tween.get(pon, { loop: false, override: true })
                    .to({ x: x[difference - 1], y: y[difference - 1] }, 200).call(() => {
                        createjs.Sound.play("pawnMove");
                    }).wait(50)
                    .to({ x: x[difference - 2], y: y[difference - 2] }, 200).call(() => {
                        createjs.Sound.play("pawnMove");
                    }).wait(50)
                    .to({ x: x[difference - 3], y: y[difference - 3] }, 200).call(() => {
                        createjs.Sound.play("pawnMove");
                    }).wait(50)
                    .call(() => {
                        this.setOriginalState(x[difference - 3], y[difference - 3]);
                        ValidatePons(this, this.commonIndex, 3);
                        LayerOrderAllPons(this.ponColor);
                    })
                break;

            case 4:
                this.ResetToOriginalState();
                ReorganizeAllPawns(this.commonIndex, this.ponColor);
                OrganizeAllPons(this.oldCommonIndex);
                createjs.Tween.get(pon, { loop: false, override: true })
                    .to({ x: x[difference - 1], y: y[difference - 1] }, 200).call(() => {
                        createjs.Sound.play("pawnMove");
                    }).wait(50)
                    .to({ x: x[difference - 2], y: y[difference - 2] }, 200).call(() => {
                        createjs.Sound.play("pawnMove");
                    }).wait(50)
                    .to({ x: x[difference - 3], y: y[difference - 3] }, 200).call(() => {
                        createjs.Sound.play("pawnMove");
                    }).wait(50)
                    .to({ x: x[difference - 4], y: y[difference - 4] }, 200).call(() => {
                        createjs.Sound.play("pawnMove");
                    }).wait(50)
                    .call(() => {
                        this.setOriginalState(x[difference - 4], y[difference - 4]);
                        ValidatePons(this, this.commonIndex, 4);
                        LayerOrderAllPons(this.ponColor);
                    })
                break;

            case 5:
                this.ResetToOriginalState();
                ReorganizeAllPawns(this.commonIndex, this.ponColor);
                OrganizeAllPons(this.oldCommonIndex);
                createjs.Tween.get(pon, { loop: false, override: true })
                    .to({ x: x[difference - 1], y: y[difference - 1] }, 200).call(() => {
                        createjs.Sound.play("pawnMove");
                    }).wait(50)
                    .to({ x: x[difference - 2], y: y[difference - 2] }, 200).call(() => {
                        createjs.Sound.play("pawnMove");
                    }).wait(50)
                    .to({ x: x[difference - 3], y: y[difference - 3] }, 200).call(() => {
                        createjs.Sound.play("pawnMove");
                    }).wait(50)
                    .to({ x: x[difference - 4], y: y[difference - 4] }, 200).call(() => {
                        createjs.Sound.play("pawnMove");
                    }).wait(50)
                    .to({ x: x[difference - 5], y: y[difference - 5] }, 200).call(() => {
                        createjs.Sound.play("pawnMove");
                    }).wait(50)
                    .call(() => {
                        this.setOriginalState(x[difference - 5], y[difference - 5]);
                        ValidatePons(this, this.commonIndex, 5);

                        LayerOrderAllPons(this.ponColor);
                    })

                break;
            case 6:
                this.ResetToOriginalState();
                ReorganizeAllPawns(this.commonIndex, this.ponColor);
                OrganizeAllPons(this.oldCommonIndex);
                createjs.Tween.get(pon, { loop: false, override: true })
                    .to({ x: x[difference - 1], y: y[difference - 1] }, 200).call(() => {
                        createjs.Sound.play("pawnMove");
                    }).wait(50)
                    .to({ x: x[difference - 2], y: y[difference - 2] }, 200).call(() => {
                        createjs.Sound.play("pawnMove");
                    }).wait(50)
                    .to({ x: x[difference - 3], y: y[difference - 3] }, 200).call(() => {
                        createjs.Sound.play("pawnMove");
                    }).wait(50)
                    .to({ x: x[difference - 4], y: y[difference - 4] }, 200).call(() => {
                        createjs.Sound.play("pawnMove");
                    }).wait(50)
                    .to({ x: x[difference - 5], y: y[difference - 5] }, 200).call(() => {
                        createjs.Sound.play("pawnMove");
                    }).wait(50)
                    .to({ x: x[difference - 6], y: y[difference - 6] }, 200).call(() => {
                        createjs.Sound.play("pawnMove");
                    }).wait(50)
                    .call(() => {
                        this.setOriginalState(x[difference - 6], y[difference - 6]);
                        ValidatePons(this, this.commonIndex, 6);

                        LayerOrderAllPons(this.ponColor);
                    })
                break;
        }
    }

    this.setPawnStack = function (x, y, scaleX, scaleY) {
        this.ResetToOriginalState();

        pon.x = pon.x + x;
        pon.y = pon.y + y;
        pon.scaleX = pon.scaleX / scaleX;
        pon.scaleY = pon.scaleY / scaleY;


    }

    this.ResetToOriginalState = function () {
        pon.x = OriginalState.x;
        pon.y = OriginalState.y;
        pon.scaleX = OriginalState.scaleX;
        pon.scaleY = OriginalState.scaleY;
    }

    this.setOriginalState = function (x, y) {
        OriginalState.x = x;
        OriginalState.y = y;
    }

    this.ResetToHomeState = function () {
        pon.x = this.PonHomePosition.x;
        pon.y = this.PonHomePosition.y;
        pon.scaleX = this.PonHomePosition.scaleX;
        pon.scaleY = this.PonHomePosition.scaleY;

        ponSelector.x = this.PonHomeSelectorPosition.x;
        ponSelector.y = this.PonHomeSelectorPosition.y;
        ponSelector.scaleX = this.PonHomeSelectorPosition.scaleX;
        ponSelector.scaleY = this.PonHomeSelectorPosition.scaleY;
    }

    this.KillIt = function () {

        createjs.Sound.play('pawnDead');
        this.commonIndex = 0;
        this.isUnlocked = false;

        var x = [];
        var y = [];

        const maxLength = this.currentIndex;
        var movePosition = GetMovementPositions(this.ponColor);
        for (let i = 1; i <= maxLength; i++) {
            x.push((StartPositionX + movePosition[maxLength - i].x - this.offsetX) * scaleFactor);
            y.push((StartPositionY + movePosition[maxLength - i].y - this.offsetY) * scaleFactor);
        }

        this.ResetToOriginalState();
        OrganizeAllPons(this.oldCommonIndex);

        var ponTween = createjs.Tween.get(pon, { loop: false, override: true })

        for (let i = 0; i < x.length; i++) {
            ponTween.to({ x: x[i], y: y[i] }, 50);

        }

        ponTween.to({ x: this.PonHomePosition.x, y: this.PonHomePosition.y }, 300).wait(200);

        ponTween.call(() => {


            RerunDice();
            this.setOriginalState(this.PonHomePosition.x, this.PonHomePosition.y);
            this.ResetToHomeState();
            this.currentIndex = 0;
            this.oldCommonIndex = 0;
        })

    }

}