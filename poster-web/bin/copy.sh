#!/bin/bash
# 获取脚本所在目录的父目录的父目录（即项目根目录）
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# 复制poster文件夹到poster-web/public目录
cp -r "$PROJECT_ROOT/poster" "$PROJECT_ROOT/poster-web/public/"