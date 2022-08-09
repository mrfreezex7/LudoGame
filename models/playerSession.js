let ActiveSession = [];

exports.AddPlayerInSession = function (id) {
    if (ActiveSession.indexOf(id) === -1) {
        ActiveSession.push(id);
    }
}

exports.RemovePlayerFromSession = function (id) {
    let index = ActiveSession.indexOf(id);
    if (index !== -1) {
        ActiveSession.splice(index, 1);
    }
}

exports.IsPlayerInSession = function (id) {
    if (ActiveSession.indexOf(id) !== -1) {
        return true;
    } else {
        return false;
    }
}

exports.GetAllSessions = function () {
    return ActiveSession;
}




