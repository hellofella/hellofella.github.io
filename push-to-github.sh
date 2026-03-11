#!/bin/bash

# ========================================
# 摄影作品网站 - GitHub 推送脚本
# ========================================

echo "🚀 准备推送摄影作品网站到 GitHub..."

# 配置变量（请根据您的信息修改）
GITHUB_USERNAME="您的GitHub用户名"  # 修改为您的用户名
REPO_NAME="photography-website"      # 仓库名称
GITHUB_EMAIL="您的邮箱@example.com"  # 修改为您的邮箱
GITHUB_TOKEN="您的GitHub_Token"      # 如使用 Token 认证

# 如果您使用 SSH 方式，无需 Token，使用以下地址：
# REPO_URL="git@github.com:${GITHUB_USERNAME}/${REPO_NAME}.git"

# 如果使用 HTTPS + Token 方式：
# REPO_URL="https://oauth2:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

# ========================================
# 方法一：使用 GitHub CLI (推荐)
# ========================================

echo ""
echo "方法一：使用 GitHub CLI (gh)"
echo "---------------------------"
echo "如果您已安装 gh CLI 并登录，执行以下命令："
echo ""
cat << 'EOF'
# 1. 创建 GitHub 仓库并推送
cd /workspace/photography-website
gh repo create photography-website --public --source=. --push --description "光影之间 - 摄影作品发布网站"

# 2. 启用 GitHub Pages
gh api repos/{owner}/photography-website/pages -X POST -f source='{"branch":"main","path":"/"}'

# 3. 查看仓库地址
gh repo view photography-website --json url
EOF

# ========================================
# 方法二：使用 Git 命令 + 手动创建仓库
# ========================================

echo ""
echo "方法二：使用 Git 命令"
echo "---------------------"
echo "步骤 1: 在 GitHub 网站创建仓库"
echo "  - 访问 https://github.com/new"
echo "  - Repository name: photography-website"
echo "  - 选择 Public"
echo "  - 不要勾选 'Add a README file'"
echo "  - 点击 'Create repository'"
echo ""
echo "步骤 2: 推送代码（选择 HTTPS 或 SSH）"
echo ""
echo "HTTPS 方式（需要 Token）："
cat << 'EOF'
cd /workspace/photography-website
git remote add origin https://github.com/您的用户名/photography-website.git
git branch -M main
git push -u origin main
EOF

echo ""
echo "SSH 方式（需配置 SSH Key）："
cat << 'EOF'
cd /workspace/photography-website
git remote add origin git@github.com:您的用户名/photography-website.git
git branch -M main
git push -u origin main
EOF

# ========================================
# 方法三：使用 Token 直接推送
# ========================================

echo ""
echo "方法三：使用 GitHub Personal Access Token"
echo "-----------------------------------------"
echo "1. 创建 Token:"
echo "   - 访问 https://github.com/settings/tokens"
echo "   - Generate new token (classic)"
echo "   - 勾选 'repo' 权限"
echo "   - 复制生成的 Token"
echo ""
echo "2. 执行以下命令（替换变量）："
echo ""
cat << 'EOF'
# 设置变量
GITHUB_TOKEN="您的Token"
USERNAME="您的用户名"

# 创建仓库（使用 API）
curl -X POST -H "Authorization: token ${GITHUB_TOKEN}" \
  -d '{"name":"photography-website","description":"光影之间 - 摄影作品发布网站","public":true}' \
  https://api.github.com/user/repos

# 推送代码
cd /workspace/photography-website
git remote add origin https://oauth2:${GITHUB_TOKEN}@github.com/${USERNAME}/photography-website.git
git push -u origin main
EOF

# ========================================
# 启用 GitHub Pages
# ========================================

echo ""
echo "=========================================="
echo "启用 GitHub Pages（推送成功后执行）"
echo "=========================================="
echo ""
echo "方式一：网页操作"
echo "  1. 进入仓库 Settings → Pages"
echo "  2. Source: Deploy from a branch"
echo "  3. Branch: main, /(root)"
echo "  4. Save"
echo ""
echo "方式二：使用 API（需要 Token）"
cat << 'EOF'
curl -X POST -H "Authorization: token ${GITHUB_TOKEN}" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{"source":{"branch":"main","path":"/"}}' \
  https://api.github.com/repos/${USERNAME}/photography-website/pages
EOF

echo ""
echo "✅ 推送完成后，访问地址："
echo "   https://您的用户名.github.io/photography-website"
echo ""
