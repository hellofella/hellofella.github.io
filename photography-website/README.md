# 光影之间 - 摄影作品发布网站

一个现代化的摄影作品展示网站，支持瀑布流布局、分类筛选、图片上传等功能，可部署到 GitHub Pages。

![Preview](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop)

## ✨ 功能特点

- 🎨 **现代暗色主题** - 深色背景突出摄影作品
- 📸 **瀑布流布局** - 自适应瀑布流图片展示
- 🔍 **分类筛选** - 支持按风景、人像、街拍等分类浏览
- 💡 **点击放大** - Lightbox 图片放大查看
- ❤️ **点赞功能** - 为喜欢的作品点赞
- 📱 **响应式设计** - 完美适配移动端
- 🔌 **预留上传接口** - 可对接真实后端服务
- 💾 **本地存储** - 支持本地预览和数据导出

## 🚀 快速开始

### 方式一：直接打开

1. 下载项目文件
2. 用浏览器打开 `index.html` 即可预览

### 方式二：本地服务器

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js
npx serve

# 访问 http://localhost:8000
```

## 📦 部署到 GitHub Pages

### 步骤 1: 创建 GitHub 仓库

1. 登录 GitHub
2. 点击右上角 "+" → "New repository"
3. 填写仓库名称（如：`photography-website`）
4. 点击 "Create repository"

### 步骤 2: 上传代码

```bash
# 初始化 Git 仓库
cd photography-website
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: 摄影作品网站"

# 关联远程仓库（替换 YOUR_USERNAME 和 YOUR_REPO）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 推送到 GitHub
git push -u origin main
```

### 步骤 3: 启用 GitHub Pages

1. 进入仓库的 **Settings** 页面
2. 左侧菜单找到 **Pages**
3. Source 选择 **Deploy from a branch**
4. Branch 选择 **main**，目录选择 **/(root)**
5. 点击 **Save**
6. 等待几分钟后，访问 `https://YOUR_USERNAME.github.io/YOUR_REPO`

## 🔌 图片上传接口配置

当前为本地预览模式，作品数据保存在浏览器 localStorage 中。您可以配置后端 API 实现真实上传：

### 修改 API 配置

编辑 `js/api.js` 文件：

```javascript
const API_CONFIG = {
    // 后端 API 基础地址
    baseUrl: 'https://your-api.com',

    // API 端点
    endpoints: {
        upload: '/api/photos/upload',
        getPhotos: '/api/photos',
        getPhotoById: '/api/photos/:id',
        deletePhoto: '/api/photos/:id',
        likePhoto: '/api/photos/:id/like'
    },

    // 设置为 false 使用真实 API
    useLocalStorage: false
};
```

### 后端 API 规范

#### 上传照片

```
POST /api/photos/upload
Content-Type: multipart/form-data

参数：
- image: 图片文件
- title: 作品标题
- description: 作品描述
- category: 分类（landscape/portrait/street/architecture/macro/other）
- tags: 标签（逗号分隔）
- cameraModel: 相机型号
- lens: 镜头
- aperture: 光圈
- shutter: 快门速度
- iso: ISO 值
- dateTaken: 拍摄日期

响应：
{
  "success": true,
  "photoId": "photo_123",
  "imageUrl": "https://cdn.example.com/photos/photo_123.jpg"
}
```

#### 获取照片列表

```
GET /api/photos?category=landscape&page=1&limit=20

响应：
{
  "photos": [...],
  "total": 100,
  "page": 1,
  "totalPages": 5
}
```

#### 点赞照片

```
POST /api/photos/:id/like

响应：
{
  "success": true,
  "likes": 42
}
```

## 📁 项目结构

```
photography-website/
├── index.html          # 首页（瀑布流画廊）
├── detail.html         # 作品详情页
├── upload.html         # 上传管理界面
├── css/
│   └── style.css      # 自定义样式
├── js/
│   ├── app.js         # 主应用逻辑
│   ├── data.js        # 数据管理
│   └── api.js         # API 接口封装
├── data/
│   └── photos.json    # 示例照片数据
└── README.md          # 项目说明
```

## 🎨 自定义配置

### 修改主题颜色

编辑 HTML 文件中的 Tailwind 配置：

```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                dark: {
                    900: '#0a0a0a',  // 背景色
                    800: '#141414',
                    700: '#1f1f1f',
                    600: '#2a2a2a'
                },
                accent: '#f59e0b'  // 强调色（金色）
            }
        }
    }
}
```

### 修改分类

编辑 `index.html` 中的筛选按钮和 `js/app.js` 中的 `CATEGORY_MAP`：

```javascript
const CATEGORY_MAP = {
    'landscape': '风景',
    'portrait': '人像',
    'street': '街拍',
    'architecture': '建筑',
    'macro': '微距',
    'other': '其他'
};
```

## 📝 数据导入导出

### 导出数据

在上传页面点击"导出数据"按钮，将导出 JSON 格式的作品数据。

### 导入数据

```javascript
// 在浏览器控制台执行
const data = '...您的 JSON 数据...';
PhotoData.importData(data);
```

## 🛠️ 技术栈

- **HTML5** - 语义化结构
- **CSS3** - 样式和动画
- **JavaScript (ES6+)** - 应用逻辑
- **Tailwind CSS** - 响应式样式框架
- **Masonry.js** - 瀑布流布局
- **Lightbox2** - 图片放大查看
- **imagesLoaded** - 图片加载检测

## 📱 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge
- 移动端浏览器

## 📄 License

MIT License - 自由使用和修改

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**Made with ❤️ by CodeBuddy**
