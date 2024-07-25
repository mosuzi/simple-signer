const axios = require("axios");
const { logError, logInfo } = require("./log");
const { getToken, writeToken } = require("./token");
const { baseURL, loginUrl, signUrl } = require("./api");

const userInfo = {};

const exitWhenNoUserInfo = function () {
  if (!userInfo.phone || !userInfo.password) {
    const error = "用户信息缺失";
    logError(error);
    process.exit(1);
  }
};

const addRequestInterceptors = function (instance) {
  instance.interceptors.request.use(function (request) {
    const token = userInfo.token || getToken(userInfo.phone);
    if (token) {
      if (!request.headers) {
        request.headers = {};
      }
      request.headers.Token = token;
    }
    return request;
  });
};

const addResponseInterceptors = function (instance) {
  instance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response && [401].includes(error.response.status)) {
        loginAndSign(instance);
      } else {
        logError("" + error, userInfo.phone);
        // 终止异常
        process.exit(1);
      }
    }
  );
};

const initAxios = function () {
  const instance = axios.create({
    baseURL,
    timeout: 60 * 1000,
    headers: {
      "Content-Type": "application/json",
    },
  });
  addRequestInterceptors(instance);
  addResponseInterceptors(instance);
  return instance;
};

const getUserInfo = function () {
  const fields = ["phone", "password", "token"];
  fields.forEach((key) => {
    userInfo[key] = process.argv.splice(2, 1)[0];
  });
  exitWhenNoUserInfo();
};

const loginIn = function (axiosInstance) {
  const type = "account";
  return axiosInstance
    .post(loginUrl, {
      type,
      phone: userInfo.phone,
      password: userInfo.password,
    })
    .then((resp) => {
      if (resp.data.code !== "ok" || !resp.data.data) {
        throw new Error(resp.data.message);
      } else {
        writeToken(userInfo.phone, resp.data.data.token);
        userInfo.token = resp.data.data.token;
        logInfo(`以${userInfo.phone}身份登录成功`, userInfo.phone);
      }
    })
    .catch((err) => {
      logError(
        `以${userInfo.phone}身份登录失败，错误${"" + err}`,
        userInfo.phone
      );
      throw new Error(err);
    });
};

const sign = function (axiosInstance) {
  axiosInstance
    .get(signUrl)
    .then((resp) => {
      if (resp.data.code !== "ok") {
        if (resp.data.bizCode === "3007") {
          logInfo("今天已经签到过了", userInfo.phone);
        } else {
          logError("签到失败: " + resp.data.message, userInfo.phone);
        }
      } else {
        logInfo("签到成功", userInfo.phone);
      }
    })
    .catch((err) => {
      const message = "签到出错: " + err;
      logError(message, userInfo.phone);
    });
};

const loginAndSign = function (axiosInstance) {
  loginIn(axiosInstance).then(() => {
    sign(axiosInstance);
  });
};

getUserInfo();
const axiosInstance = initAxios();
if (userInfo.token) {
  sign(axiosInstance);
} else {
  loginAndSign(axiosInstance);
}
