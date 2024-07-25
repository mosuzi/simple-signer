const fs = require("fs");
const path = require("path");
const getLocalPath = function (filename) {
  return path.resolve(__dirname + "/" + filename);
};

const readFile = function (filename) {
  return fs.readFileSync(getLocalPath(filename), {
    encoding: "utf8",
    flag: "a+",
  });
};

const writeFile = function (filename, data, append = false) {
  fs.writeFileSync(getLocalPath(filename), data, {
    encoding: "utf8",
    flag: append ? "a" : "w",
  });
};

module.exports = {
  readFile,
  writeFile,
};
