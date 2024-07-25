#!/bin/bash
crontab -l > conf
echo "10 0 * * * node `pwd`/schedule.js" >> conf # 每天00:10签到
echo "0 0 1 * * sh `pwd`/scripts/clean-log.sh" >> conf # 每月1号清空日志
crontab conf
rm -f conf