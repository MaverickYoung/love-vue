# 💩 便便记录器

## 📝 项目简介

**便便记录器** 是一个基于 Vue 3 开发的 Web 应用，帮助用户记录每日便便情况，以便追踪健康状况。

## 🚀 技术栈

- **前端**：Vue 3 + TypeScript + Vite
- **数据请求**：Axios
- **样式**：Less
- **可视化**：ECharts

## 📂 仓库地址

- **前端**：[love-vue](https://github.com/MaverickYoung/love-vue.git)
- **后端**：[love-boot](https://github.com/MaverickYoung/love-boot.git)

## 📦 安装与运行

### 1. 克隆仓库
```sh
git clone https://github.com/MaverickYoung/love-vue.git
cd love-vue
```

### 2. 安装依赖
```sh
npm install
```

### 3. 运行 SVG 图片压缩脚本（首次构建前必须执行）
```sh
node script/convert-svg-to-avif.js
```

### 4. 运行开发环境
```sh
npm run dev
```

### 5. 构建生产环境
```sh
npm run build
```

## 📖 主要功能

本应用分为三个主要模块：

1. **记录**
    - 记录并查看自己和他人的便便时间
    - 每条便便记录包含时间和便便类型

2. **奖励**
    - 统计上月便便最多的人，最多的用户可获得奖励
    - 允许上传奖励图片

3. **统计**
    - 使用 ECharts 进行数据可视化，展示便便趋势

## 🌙 主题与存储

- **支持暗色主题**，可根据用户偏好自动切换
- **存储策略**：
    - 背景图和主题设置存储在本地
    - 其他数据存储在云端
- **安全设计**：采用 **双 Token** 机制

## 📜 许可证

本项目采用 MIT 许可证，欢迎自由使用与修改。

---

如果你有任何建议或问题，欢迎提 Issue 或 PR！😊

