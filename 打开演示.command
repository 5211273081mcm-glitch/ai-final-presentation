#!/bin/bash
cd "$(dirname "$0")"
PORT=8080
echo "正在启动演示服务器 http://localhost:$PORT"
echo "按 Ctrl+C 停止"
python3 -m http.server "$PORT" &
PID=$!
sleep 1
open "http://localhost:$PORT"
wait $PID
