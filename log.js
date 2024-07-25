const { writeFile } = require("./file");

const formatLog = function (log, userAccount = "anonymous") {
  return `${new Date().toLocaleString()}\t${userAccount}\t${log}\n`;
};

const logInfo = function (log, userAccount) {
  writeFile("info.log", formatLog(log, userAccount), true);
};

const logError = function (log, userAccount) {
  writeFile("error.log", formatLog(log, userAccount), true);
};

module.exports = {
  logInfo,
  logError,
};
