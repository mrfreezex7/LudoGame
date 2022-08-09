let GlobalChats = [];

exports.AddChat = (username, msg) => {
    GlobalChats.push({ username: username, msg: msg });
    console.log(GlobalChats);
}

exports.GetChats = () => {
    return GlobalChats;
}