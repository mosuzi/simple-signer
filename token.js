const { readFile, writeFile } = require("./file");

const getTokens = function () {
  const auth = readFile(".auth");
  const tokens =
    (auth &&
      auth.split("\n").reduce((p, c) => {
        if (!c) return p;
        const [k, v] = c.split(":");
        p[k] = v;
        return p;
      }, {})) ||
    {};
  return tokens;
};

const getToken = function (user) {
  return getTokens()[user];
};

const writeToken = function (user, token) {
  const tokens = getTokens();
  tokens[user] = token;
  writeTokens(tokens);
};

const writeTokens = function (tokens) {
  writeFile(
    ".auth",
    Object.keys(tokens).reduce((str, key) => {
      str += `${key}:${tokens[key]}\n`;
      return str;
    }, "")
  );
};

module.exports = {
  getToken,
  getTokens,
  writeToken,
  writeTokens,
};
