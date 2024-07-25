# 自动签到脚本

环境要求：linux 环境下：nodejs = 16，可选：`pnpm`

**自动签到需要开启 crontab 服务**

windows 用户建议使用`WSL`运行

1. 填写配置文件 user-info.json 中的 `phone` 和 `password` 字段，分别对应社区登录的手机号和密码。

(可选)：填写`name`字段，可以在发送通知时显示特殊的用户名。设置`disableNotify`字段为`true`，可以禁用通知

user-info.json 也支持定义一个包含 `phone` 和 `password` 字段的对象数组，这样就可以实现多账号签到。

2. 填写 api.js 文件中的 api 信息，包括基础请求地址、登录url、签到url、飞书通知 bot 地址（可选）

3. 安装依赖

```shell
pnpm install
# 或者使用 npm
# npm install
```

4. 创建定时任务自动执行

```shell
./scripts/auto.sh
```

##### 手动执行

手动执行签到任务则可以直接运行 `schedule.js` 文件
