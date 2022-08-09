const date = require("date-and-time");
const fs = require("fs");
const path = require("path");
const now = new Date();

fs.exists("logs", (exists) => {
  console.log(exists, "yes");
  if (!exists) {
    fs.mkdirSync(path.join(__dirname, "../logs"));
    console.log("logs folder created");
  } else {
    //console.log("logs directory exists");
  }
});

exports.error = (msg, id = null) => {
  let output = ` ||||| { [--ERROR--] = [${date.format(
    now,
    "YYYY/MM/DD HH:mm:ss"
  )}] - ${id} - ${msg}}`;

  fs.appendFile("./logs/logs.txt", output.toString(), function (err) {
    if (err) throw err;
  });
};

exports.warn = (msg, id = null) => {
  let output = ` ||||| { [--WARN--] = [${date.format(
    now,
    "YYYY/MM/DD HH:mm:ss"
  )}] - ${id} - ${msg}}`;

  fs.appendFile("./logs/logs.txt", output.toString(), function (err) {
    if (err) throw err;
  });
};

exports.info = (msg, id = null) => {
  let output = ` ||||| { [--INFO--] = [${date.format(
    now,
    "YYYY/MM/DD HH:mm:ss"
  )}] - ${id} - ${msg}}`;

  fs.appendFile("./logs/logs.txt", output.toString(), function (err) {
    if (err) throw err;
  });
};

exports.debug = (msg, id = null) => {
  let output = ` ||||| { [--DEBUG--] = [${date.format(
    now,
    "YYYY/MM/DD HH:mm:ss"
  )}] - ${id} - ${msg}}`;

  fs.appendFile("./logs/logs.txt", output.toString(), function (err) {
    if (err) throw err;
  });
};
