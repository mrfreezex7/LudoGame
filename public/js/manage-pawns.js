import { SavePointPos } from "/js/board-details.js";
import { stage, scaleFactor, StartPositionX, StartPositionY } from "/js/index.js";
import { Players, AllPlayers } from "/js/players.js";
import { GetCurrentTurn, GetDiceValue } from "/js/game-manager.js";
import { GetNextDiceHolder, RerunDice } from "/js/manage-dice.js";
import { GetPawnSpawnCirclePos } from "/js/options.js";
import { Pawn } from "/js/pawn.js";
import { GenerateId } from "/js/utils.js";

var RedPawns = [];
var BluePawns = [];
var YellowPawns = [];
var GreenPawns = [];

let NetworkIDs = {
    "red": [GenerateId(5), GenerateId(5), GenerateId(5), GenerateId(5)],
    "blue": [GenerateId(5), GenerateId(5), GenerateId(5), GenerateId(5)],
    "yellow": [GenerateId(5), GenerateId(5), GenerateId(5), GenerateId(5)],
    "green": [GenerateId(5), GenerateId(5), GenerateId(5), GenerateId(5)]
}

export function SpawnAllPawns() {
    Players.forEach(player => {
        if (!player.isOnline) {
            console.log(player);
            SpawnPawn(player.teamColor, player.playerName, player.isOwner, player.isOnline);
        } else {
            SpawnNetworkPawn(player.teamColor, player.playerName, player.isOwner, player.isOnline, player.OnlinePlayer.Pons);
        }
    })
}

export function SpawnPawn(ponColor, ponName, isOwner = false, isOnline = false) {
    var ponPosition = GetPawnSpawnCirclePos(ponColor);
    console.log(ponPosition);
    let counter = 0;
    for (const key in ponPosition) {
        if (ponPosition.hasOwnProperty(key)) {
            CreateAndStorePawns(ponName, isOwner, (StartPositionX + ponPosition[key].x) * scaleFactor - (scaleFactor / 3), (StartPositionY + ponPosition[key].y) * scaleFactor - (scaleFactor / 1.2), scaleFactor * 1.2, scaleFactor * 1.2, ponColor, NetworkIDs[ponColor][counter], isOnline);
            counter++;
            if (counter >= 4) {
                counter = 0;
            }
        }
    }
}

export function SpawnNetworkPawn(ponColor, ponName, isOwner = false, isOnline = false, pons) {
    var ponPosition = GetPawnSpawnCirclePos(ponColor);
    let counter = 0;
    for (const key in ponPosition) {
        if (ponPosition.hasOwnProperty(key)) {
            CreateAndStorePawns(ponName, isOwner, (StartPositionX + ponPosition[key].x) * scaleFactor - (scaleFactor / 3), (StartPositionY + ponPosition[key].y) * scaleFactor - (scaleFactor / 1.2), scaleFactor * 1.2, scaleFactor * 1.2, ponColor, pons[counter].NetworkId, isOnline);
            console.log(pons[counter].NetworkId);
            counter++;
        }
    }
}

function CreateAndStorePawns(ponName, isOwner = false, x, y, scaleX = 1, scaleY = 1, ponColor, NetworkID, isOnline = false) {
    switch (ponColor) {
        case "red": RedPawns.push(new Pawn(ponName, isOwner, x, y, scaleX, scaleY, ponColor, NetworkID, isOnline)); break;
        case "blue": BluePawns.push(new Pawn(ponName, isOwner, x, y, scaleX, scaleY, ponColor, NetworkID, isOnline)); break;
        case "yellow": YellowPawns.push(new Pawn(ponName, isOwner, x, y, scaleX, scaleY, ponColor, NetworkID, isOnline)); break;
        case "green": GreenPawns.push(new Pawn(ponName, isOwner, x, y, scaleX, scaleY, ponColor, NetworkID, isOnline)); break;
    }
}

export function StoreSpawnedPonsOnPlayers() {
    Players.forEach(player => {
        AddPonsToPlayer(player);
    })
}

function AddPonsToPlayer(player) {
    switch (player.teamColor) {
        case "red":
            player.pons = RedPawns;
            break;
        case "blue":
            player.pons = BluePawns;
            break;
        case "yellow":
            player.pons = YellowPawns;
            break;
        case "green":
            player.pons = GreenPawns;
            break;
    }
}


export function DestroyPons(player) {

}


var checkCounter = 0;
var unlockedPawns = 0;

export function CheckPawns(TeamColor) {

    var diceValue = GetDiceValue();
    checkCounter = 0;
    unlockedPawns = 0;

    CheckPawnInStack(TeamColor, diceValue);

    switch (GetCurrentTurn()) {
        case "red": RedPawns.forEach(pon => { CheckPawn(pon, diceValue); });
            break;
        case "blue": BluePawns.forEach(pon => { CheckPawn(pon, diceValue); });
            break;
        case "yellow": YellowPawns.forEach(pon => { CheckPawn(pon, diceValue); });
            break;
        case "green": GreenPawns.forEach(pon => { CheckPawn(pon, diceValue); });
            break;
    }

    AutoMovePon(TeamColor);
}

function CheckPawn(pon, diceValue) {
    checkCounter++;
    if ((pon.currentIndex + diceValue) <= 57) {
        if (diceValue == 6) {
            ActivateAllCurrentPawn(pon);
        } else if (diceValue != 6) {
            CheckUnlockedPon(pon)
        }
    }

    if (checkCounter >= 4) {
        if (unlockedPawns == 0) {
            setTimeout(() => {
                GetNextDiceHolder();
            }, 500);
        }
    }
}

export function CheckUnlockedPon(pon) {
    if (pon.isUnlocked) {
        pon.isCurrentTurn = true;
        pon.ponSelector.visible = true;
        unlockedPawns++;
    }
}

export function ActivateAllCurrentPawn(pon) {
    pon.isCurrentTurn = true;
    pon.ponSelector.visible = true;
    unlockedPawns++;
}

export function ValidatePons(pon, commonIndex, diceValue) {

    const enemyPons = GetEnemyPon(pon.ponColor, commonIndex);

    if (!pon.isUnlocked) {
        pon.isUnlocked = true;
        RerunDice();
        OrganizeAllPons(commonIndex);
        pon.oldCommonIndex = commonIndex;
        return;
    }

    //check savepoint = reorganizepon
    else if (CheckPonOnSavePoint(commonIndex)) {
        createjs.Sound.play('pawnSecure');
        OrganizeAllPons(commonIndex);
    }


    //check reached home
    else if (ReachedHome(pon.currentIndex)) {
        pon.isWon = true;
        CheckWonPlayer(pon.ponColor);
        OrganizeAllPons(commonIndex);
        return;
    }

    //check enemy pon = killpon = if kill pon give one rerun
    else if (enemyPons.length > 0) {
        enemyPons.forEach(pon => {
            pon.KillIt();
        })

        OrganizeAllPons(commonIndex);
        return;
    }

    //check friendlypon = organize pon
    OrganizeAllPons(commonIndex);

    //check dice value  = 6 =  rerun
    if (diceValue == 6) {
        RerunDice();
    } else {
        GetNextDiceHolder();
    }

    pon.oldCommonIndex = commonIndex;

}

export function OrganizeAllPons(commonIndex) {
    var Pons = GetAllPawnsInCommonIndex(commonIndex);
    OrganizePons(Pons);
}

function CheckPonOnSavePoint(commonIndex) {
    for (const key in SavePointPos) {
        if (SavePointPos.hasOwnProperty(key)) {
            if (SavePointPos[key].CommonIndex == commonIndex) {
                return true;
            }
        }
    }
    return false;
}

function CheckSavePoint(commonIndex) {
    for (const key in SavePointPos) {
        if (SavePointPos.hasOwnProperty(key)) {
            if (SavePointPos[key].CommonIndex == commonIndex) {
                return true;
            }
        }
    }
    return false;
}

function ReachedHome(currentIndex) {
    if (currentIndex == 57) {
        createjs.Sound.play("pawnSecure");
        return true;
    } else {
        return false;
    }
}


function ReachedHomeCheck(currentIndex) {
    if (currentIndex == 57) {
        return true;
    } else {
        return false;
    }
}

let Rank = 1;

export function SetRankValue(value) {
    Rank = value;
}

function CheckWonPlayer(teamColor) {
    let homePons = 0;
    Players.forEach(player => {
        if (player.teamColor == teamColor) {
            player.pons.forEach(pon => {
                if (pon.currentIndex == 57) {
                    homePons++;
                    if (homePons == 4) {
                        player.isWinner = true;
                        player.winningRank = Rank;
                        GetNextDiceHolder();
                        //setsomething on player name like rank or king icon
                        Rank++;
                        return;
                    }
                } else {
                    RerunDice();
                    return;
                }
            });
        }
    })

}


export function GetEnemyPon(teamColor, commonIndex) {
    if (commonIndex > 57) return [];
    const Pons = [];
    const pons = GetAllPawnsInCommonIndex(commonIndex);

    pons.forEach(pon => {
        if (pon.ponColor != teamColor) {
            Pons.push(pon);
        }
    })

    return Pons;
}

export function AutoMovePon(TeamColor) {
    const ClickablePons = GetAllClickablePawns(TeamColor);
    console.log("automoving");
    if (ClickablePons.length == 1) {
        ClickablePons[0].PonClick();
    }
}

export function GetAllClickablePawns(TeamColor) {
    const ClickablePons = [];
    let tempCommonIndex = undefined;

    switch (TeamColor) {
        case "red":
            RedPawns.forEach(pon => {
                if (pon.isCurrentTurn && (pon.commonIndex != tempCommonIndex)) {
                    ClickablePons.push(pon);
                    tempCommonIndex = pon.commonIndex;
                }
            });
            break;
        case "blue":
            BluePawns.forEach(pon => {
                if (pon.isCurrentTurn && (pon.commonIndex != tempCommonIndex)) {
                    ClickablePons.push(pon);
                    tempCommonIndex = pon.commonIndex;
                }
            });
            break;
        case "yellow":
            YellowPawns.forEach(pon => {
                if (pon.isCurrentTurn && (pon.commonIndex != tempCommonIndex)) {
                    ClickablePons.push(pon);
                    tempCommonIndex = pon.commonIndex;
                }
            });
            break;
        case "green":
            GreenPawns.forEach(pon => {
                if (pon.isCurrentTurn && (pon.commonIndex != tempCommonIndex)) {
                    ClickablePons.push(pon);
                    tempCommonIndex = pon.commonIndex;
                }
            });
            break;
    }

    return ClickablePons;
}

export function GetAllPawns(TeamColor) {
    const Pons = [];


    switch (TeamColor) {
        case "red":
            RedPawns.forEach(pon => {
                if (pon.isCurrentTurn) {
                    Pons.push(pon);
                }
            });
            break;
        case "blue":
            BluePawns.forEach(pon => {
                if (pon.isCurrentTurn) {
                    Pons.push(pon);
                }
            });
            break;
        case "yellow":
            YellowPawns.forEach(pon => {
                if (pon.isCurrentTurn) {
                    Pons.push(pon);
                }
            });
            break;
        case "green":
            GreenPawns.forEach(pon => {
                if (pon.isCurrentTurn) {
                    Pons.push(pon);
                }
            });
            break;
    }

    return Pons;
}

export function GetAllLockedPons(TeamColor) {
    const lockedPons = [];

    switch (TeamColor) {
        case "red":
            RedPawns.forEach(pon => {
                if (!pon.isUnlocked) {
                    lockedPons.push(pon);
                }
            });
            break;
        case "blue":
            BluePawns.forEach(pon => {
                if (!pon.isUnlocked) {
                    lockedPons.push(pon);
                }
            });
            break;
        case "yellow":
            YellowPawns.forEach(pon => {
                if (!pon.isUnlocked) {
                    lockedPons.push(pon);
                }
            });
            break;
        case "green":
            GreenPawns.forEach(pon => {
                if (!pon.isUnlocked) {
                    lockedPons.push(pon);
                }
            });
            break;
    }

    return lockedPons;
}
export function CheckBotPon(pon, diceValue, flag = 0) {

    const enemyPons = GetEnemyPon(pon.ponColor, pon.commonIndex + diceValue);

    if (flag == 0) {

        if (diceValue == 6 && !pon.isUnlocked) {
            console.log("Got Six");
            return true;
        }
        else if (enemyPons.length > 0 && !CheckSavePoint(pon.commonIndex + diceValue)) {
            console.log("enemy pon ahead");
            return true;
        }
        else if (ReachedHomeCheck(pon.currentIndex + diceValue)) {
            console.log("Reached home");
            return true;
        }
        else if (CheckSavePoint(pon.commonIndex + diceValue)) {
            console.log("Got SavePoint");
            return true;
        }
        else if (CheckSavePoint(pon.commonIndex)) {
            console.log("On SavePoint");
            return false;
        }
        else {
            console.log("no match");
            return false;
        }
    } else {
        if (enemyPons.length > 0) {
            console.log("enemy pon ahead");
            return true;
        }
        else if (diceValue == 6 && !pon.isUnlocked) {
            console.log("Got Six");
            return true;
        } else {
            console.log("no match");
            return false;
        }
    }


}


var PonIndex = [];
var UniqueIndex = [];

export function CheckPawnInStack(teamColor, diceValue) {
    PonIndex = [];
    UniqueIndex = [];

    switch (teamColor) {
        case "red":
            RedPawns.forEach(pon => {
                if (pon.commonIndex != 0 && !pon.isWon && ((pon.currentIndex + diceValue) <= 57)) {
                    PonIndex.push({ "index": pon.commonIndex, "pon": pon });
                }
            });
            break;
        case "blue":
            BluePawns.forEach(pon => {
                if (pon.commonIndex != 0 && !pon.isWon && ((pon.currentIndex + diceValue) <= 57)) {
                    PonIndex.push({ "index": pon.commonIndex, "pon": pon });
                }
            });
            break;
        case "yellow":
            YellowPawns.forEach(pon => {
                if (pon.commonIndex != 0 && !pon.isWon && ((pon.currentIndex + diceValue) <= 57)) {
                    PonIndex.push({ "index": pon.commonIndex, "pon": pon });
                }
            });
            break;
        case "green":
            GreenPawns.forEach(pon => {
                if (pon.commonIndex != 0 && !pon.isWon && ((pon.currentIndex + diceValue) <= 57)) {
                    PonIndex.push({ "index": pon.commonIndex, "pon": pon });
                }
            });
            break;
    }


    UniqueIndex = removeDuplicates(PonIndex, "index");

    UniqueIndex.forEach(item => {
        item.pon.ResetToOriginalState();
        stage.setChildIndex(item.pon.displayObject, stage.numChildren - 1);
    })

}

let StackCounter = 0;
export function CheckAllPonInStackAndOrganize() {

    PonIndex = [];
    UniqueIndex = [];


    StackCounter++;
    console.log(StackCounter);
    if (StackCounter >= Players.length * 4) {
        console.log("checked");
        Players.forEach(player => {
            switch (player.teamColor) {
                case "red":
                    RedPawns.forEach(pon => {
                        if (pon.commonIndex != 0 && !pon.isWon && pon.currentIndex <= 57) {
                            PonIndex.push({ "index": pon.commonIndex, "pon": pon });
                        }
                    });
                    break;
                case "blue":
                    BluePawns.forEach(pon => {
                        if (pon.commonIndex != 0 && !pon.isWon && pon.currentIndex <= 57) {
                            PonIndex.push({ "index": pon.commonIndex, "pon": pon });
                        }
                    });
                    break;
                case "yellow":
                    YellowPawns.forEach(pon => {
                        if (pon.commonIndex != 0 && !pon.isWon && pon.currentIndex <= 57) {
                            PonIndex.push({ "index": pon.commonIndex, "pon": pon });
                        }
                    });
                    break;
                case "green":
                    GreenPawns.forEach(pon => {
                        if (pon.commonIndex != 0 && !pon.isWon && pon.currentIndex <= 57) {
                            PonIndex.push({ "index": pon.commonIndex, "pon": pon });
                        }
                    });
                    break;
            }
        })

        UniqueIndex = removeDuplicates(PonIndex, "index");

        UniqueIndex.forEach(item => {
            const Pons = GetAllPawnsInCommonIndex(item.index);
            console.log(Pons);
            OrganizePons(Pons);

        })
    }

}

export function ReorganizeStack(skipIndex) {
    PonIndex = [];
    UniqueIndex = [];

    UniqueIndex.forEach(item => {
        if (item.index != skipIndex) {
            OrganizePonStack(item.index, item.pon.teamColor);
        }
    })

}

function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) >= pos;
    });
}



export function OrganizePonStack(CommonIndex, TeamColor) {
    const Pons = GetPawnsInCommonIndex(CommonIndex, TeamColor);
    OrganizePons(Pons);
    console.log(Pons.length);
}

export function OrganizePons(Pons) {

    if (Pons.length > 0) {

        if (Pons.length == 1) {
            Pons.forEach((pon, index) => {
                pon.ResetToOriginalState();
                stage.setChildIndex(pon.displayObject, stage.numChildren - 1);
            })
        }
        else if (Pons.length == 2) {
            Pons.forEach((pon, index) => {

                if (index == 0) {
                    pon.setPawnStack(-scaleFactor / 20, (scaleFactor / 3), 1.5, 1.5);
                    stage.setChildIndex(pon.displayObject, stage.numChildren - 1);
                }
                else if (index == 1) {
                    pon.setPawnStack(scaleFactor / 3.5, (scaleFactor / 3), 1.5, 1.5);
                    stage.setChildIndex(pon.displayObject, stage.numChildren - 1);
                }
            })
        } else if (Pons.length == 3) {
            Pons.forEach((pon, index) => {

                if (index == 0) {
                    pon.setPawnStack(-scaleFactor / 20, (scaleFactor / 3), 1.5, 1.5);
                    stage.setChildIndex(pon.displayObject, stage.numChildren - 1);
                }
                else if (index == 1) {
                    pon.setPawnStack(scaleFactor / 8, (scaleFactor / 3), 1.5, 1.5);
                    stage.setChildIndex(pon.displayObject, stage.numChildren - 1);
                }
                else if (index == 2) {
                    pon.setPawnStack(scaleFactor / 3.5, (scaleFactor / 3), 1.5, 1.5);
                    stage.setChildIndex(pon.displayObject, stage.numChildren - 1);
                }
            })
        } else if (Pons.length == 4) {
            Pons.forEach((pon, index) => {

                if (index == 0) {
                    pon.setPawnStack(-scaleFactor / 14, (scaleFactor / 3), 1.5, 1.5);
                    stage.setChildIndex(pon.displayObject, stage.numChildren - 1);
                }
                else if (index == 1) {
                    pon.setPawnStack(scaleFactor / 14, (scaleFactor / 3), 1.5, 1.5);
                    stage.setChildIndex(pon.displayObject, stage.numChildren - 1);
                }
                else if (index == 2) {
                    pon.setPawnStack(scaleFactor / 4.5, (scaleFactor / 3), 1.5, 1.5);
                    stage.setChildIndex(pon.displayObject, stage.numChildren - 1);
                }
                else if (index == 3) {
                    pon.setPawnStack(scaleFactor / 2.5, (scaleFactor / 3), 1.5, 1.5);
                    stage.setChildIndex(pon.displayObject, stage.numChildren - 1);
                }
            })
        } else {
            Pons.forEach((pon, index) => {
                if (index == 0) {
                    pon.setPawnStack(-scaleFactor / 14, (scaleFactor / 3), 1.5, 1.5);
                    stage.setChildIndex(pon.displayObject, stage.numChildren - 1);
                }
                else if (index == 1) {
                    pon.setPawnStack(scaleFactor / 14, (scaleFactor / 3), 1.5, 1.5);
                    stage.setChildIndex(pon.displayObject, stage.numChildren - 1);
                }
                else if (index == 2) {
                    pon.setPawnStack(scaleFactor / 4.5, (scaleFactor / 3), 1.5, 1.5);
                    stage.setChildIndex(pon.displayObject, stage.numChildren - 1);
                }
                else if (index == 3) {
                    pon.setPawnStack(scaleFactor / 2.5, (scaleFactor / 3), 1.5, 1.5);
                    stage.setChildIndex(pon.displayObject, stage.numChildren - 1);
                } else {
                    pon.setPawnStack(scaleFactor / 2.5, (scaleFactor / 3), 1.5, 1.5);
                    stage.setChildIndex(pon.displayObject, stage.numChildren - 1);
                }
            })
        }
    }
}

export function ReorganizeAllPawns(skipIndex, TeamColor) {

    switch (TeamColor) {
        case "red":
            RedPawns.forEach(pon => {
                if (pon.commonIndex != skipIndex) {
                    OrganizeAllPons(pon.commonIndex);
                }
            })
            break;
        case "blue":
            BluePawns.forEach(pon => {
                if (pon.commonIndex != skipIndex) {
                    OrganizeAllPons(pon.commonIndex);
                }
            })
            break;
        case "yellow":
            YellowPawns.forEach(pon => {
                if (pon.commonIndex != skipIndex) {
                    OrganizeAllPons(pon.commonIndex);
                }
            })
            break;
        case "green":
            GreenPawns.forEach(pon => {
                if (pon.commonIndex != skipIndex) {
                    OrganizeAllPons(pon.commonIndex);
                }
            })
            break;
    }
}

function GetPawnsInCommonIndex(CommonIndex, TeamColor) {

    const Pons = [];

    switch (TeamColor) {
        case "red":
            RedPawns.forEach(pon => {
                console.log("common index is" + pon.commonIndex);
                if (pon.commonIndex != 0 && pon.commonIndex == CommonIndex) {
                    Pons.push(pon);
                }
            })
            break;
        case "blue":
            BluePawns.forEach(pon => {
                if (pon.commonIndex != 0 && pon.commonIndex == CommonIndex) {
                    Pons.push(pon);
                }
            })
            break;
        case "yellow":
            YellowPawns.forEach(pon => {
                if (pon.commonIndex != 0 && pon.commonIndex == CommonIndex) {
                    Pons.push(pon);
                }
            })
            break;
        case "green":
            GreenPawns.forEach(pon => {
                if (pon.commonIndex != 0 && pon.commonIndex == CommonIndex) {
                    Pons.push(pon);
                }
            })
            break;
    }

    return Pons;

}

function GetAllPawnsInCommonIndex(CommonIndex) {


    const Pons = [];

    RedPawns.forEach(pon => {
        if (pon.commonIndex != 0 && pon.commonIndex == CommonIndex) {
            Pons.push(pon);
        }
    })
    BluePawns.forEach(pon => {
        if (pon.commonIndex != 0 && pon.commonIndex == CommonIndex) {
            Pons.push(pon);
        }
    })
    YellowPawns.forEach(pon => {
        if (pon.commonIndex != 0 && pon.commonIndex == CommonIndex) {
            Pons.push(pon);
        }
    })
    GreenPawns.forEach(pon => {
        if (pon.commonIndex != 0 && pon.commonIndex == CommonIndex) {
            Pons.push(pon);
        }
    })


    return Pons;

}

export function DeactivateAllPawns() {
    RedPawns.forEach(pon => { DeactivatePon(pon); })
    BluePawns.forEach(pon => { DeactivatePon(pon); })
    YellowPawns.forEach(pon => { DeactivatePon(pon); })
    GreenPawns.forEach(pon => { DeactivatePon(pon); })
}

function DeactivatePon(pon) {
    pon.isCurrentTurn = false;
    pon.ponSelector.visible = false;
}

export function LayerOrderAllPons(TeamColor) {
    switch (TeamColor) {
        case "red":
            RedPawns.forEach(pon => {
                stage.setChildIndex(pon, pon.maxLayerIndex - pon.layerIndex);
            })
            break;
        case "blue":
            BluePawns.forEach(pon => {
                stage.setChildIndex(pon, pon.maxLayerIndex - pon.layerIndex);
            })
            break;
        case "yellow":
            YellowPawns.forEach(pon => {
                stage.setChildIndex(pon, pon.maxLayerIndex - pon.layerIndex);
            })
            break;
        case "green":
            GreenPawns.forEach(pon => {
                stage.setChildIndex(pon, pon.maxLayerIndex - pon.layerIndex);
            })
            break;
    }
}

export function AllUnlockedPons(TeamColor) {
    let count = 0;
    switch (TeamColor) {
        case "red":
            RedPawns.forEach(pon => {
                if (pon.isUnlocked) {
                    count++;
                }
            })
            break;
        case "blue":
            BluePawns.forEach(pon => {
                if (pon.isUnlocked) {
                    count++;
                }
            })
            break;
        case "yellow":
            YellowPawns.forEach(pon => {
                if (pon.isUnlocked) {
                    count++;
                }
            })
            break;
        case "green":
            GreenPawns.forEach(pon => {
                if (pon.isUnlocked) {
                    count++;
                }
            })
            break;
    }

    if (count >= 4) {
        return true;
    } else {
        return false;
    }

}