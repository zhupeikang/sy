#!/bin/bash
set -x  # 打印执行的命令
set -e  # 遇到错误停止脚本

# 你的脚本内容

if git diff --quiet && git diff --cached --quiet; then
  echo "没有要提交的修改，直接推送"
else
  echo "有修改，进行提交..."
  # 提交修改（可以根据需要修改提交信息）
  git add .
  git commit -m "自动提交"
fi
# 推送到远程仓库
git push -v  origin v2pro
echo "脚本执行结束..."
