const path = require("path");
const shelljs = require("shelljs");
const { logError } = require("./log");
const { getTokens } = require("./token");
const { notify } = require("./notify");
const signPath = path.resolve(__dirname, "./sign.js");
const loadUserInfo = function () {
  let users = [];
  const chain = [".local", ""];
  chain.some((suffix) => {
    try {
      readUsers = require(`./user-info${suffix}.json`);
      if (!readUsers) return;
      if (!Array.isArray(readUsers)) {
        users = [readUsers];
      } else {
        users = readUsers;
      }
      return true;
    } catch (e) {}
  });
  if (!users || !users.length) {
    const error = "用户信息缺失";
    logError(error);
    process.exit(1);
  }
  return users;
};

const doLoginEveryUser = function (users) {
  const all = [];
  const tokens = getTokens();
  users.forEach((user) => {
    all.push(
      new Promise((resolve, reject) => {
        shelljs.exec(
          `node ${signPath} ${user.phone} ${user.password} ${
            tokens[user.phone] || ""
          }`,
          { async: true },
          function (code) {
            if (code === 0) {
              resolve(user);
            } else {
              reject(user);
            }
          }
        );
      })
    );
  });
  Promise.allSettled(all).then((result) => {
    const success = result
      .filter(
        (r) => r.status === "fulfilled" && r.value && !r.value.disableNotify
      )
      .map((r) => r.value);
    const fail = result
      .filter(
        (r) => r.status === "rejected" && r.reason && !r.reason.disableNotify
      )
      .map((r) => r.reason);
    notify(success);
    notify(fail, false);
  });
};

const users = loadUserInfo();
doLoginEveryUser(users);
