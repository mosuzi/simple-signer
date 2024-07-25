const axios = require("axios");
const { logError, logInfo } = require("./log");
const { larkBotApi } = require("./api");

const notifyByLarkBot = function (message) {
  axios
    .post(larkBotApi, {
      msg_type: "text",
      content: {
        text: message,
      },
    })
    .then((resp) => {
      if (resp.data.code === 0) {
        logInfo("通知发送成功：" + message);
      } else {
        logError("通知发送失败：" + message);
      }
    })
    .catch((error) => {
      logError("通知发送失败：" + message);
    });
};

const formatMessage = function (users, success = true) {
  return `${users.join("、")}签到${success ? "成功" : "失败"}`;
};

const notify = function (users, success = true) {
  if (!larkBotApi) return;
  if (!users || !users.length) return;
  notifyByLarkBot(
    formatMessage(
      users.map((item) => item.name || item.phone || item),
      success
    )
  );
};

module.exports = {
  notify,
};
