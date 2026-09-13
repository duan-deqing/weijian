# 微笺 Weijian

[![Deploy to GitHub Pages](https://github.com/duan-deqing/weijian/actions/workflows/deploy.yml/badge.svg)](https://github.com/duan-deqing/weijian/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/live-demo-blue)](https://duan-deqing.github.io/weijian/)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev/)

**面向微信公众号的 Markdown 写作工作台** —— 左边写原稿，右边看微信图文观感，一键复制带内联样式的内容到公众号后台。

在线体验：**[duan-deqing.github.io/weijian](https://duan-deqing.github.io/weijian/)**

---

## 目录

- [简介](#简介)
- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [使用说明](#使用说明)
- [路由](#路由)
- [技术架构](#技术架构)
- [项目结构](#项目结构)
- [开发与构建](#开发与构建)
- [部署](#部署)
- [浏览器支持](#浏览器支持)
- [常见问题](#常见问题)
- [贡献](#贡献)
- [许可](#许可)

---

## 简介

微信公众号后台对富文本粘贴不友好：样式易被剥离、代码块与表格难看、写作过程无法专注。**微笺**提供：

1. Markdown 专注书写
2. 接近手机端图文的实时预览
3. 生成可粘贴到公众号的内联样式 HTML

纯前端运行，无需注册与后端服务。

---

## 功能特性

| 模块 | 说明 |
|------|------|
| 双栏编辑 | 左 Markdown / 右实时预览；移动端可切换「写作 \| 预览」 |
| 版式模版 | 经典公众号、现代卡片风、文艺雅致风、商务科技风 |
| 配色方案 | 经典绿、知性蓝、冷灰黑、暖琥珀、蔷薇红、优雅紫（与版式独立组合） |
| 一键复制 | 将预览渲染为内联 `style` HTML，写入剪贴板，便于粘贴公众号后台 |
| 语法高亮 | 代码块基于 highlight.js，支持常见语言 |
| 本地草稿 | localStorage 最多 30 份，搜索、重命名、复制、删除 |
| 导入导出 | `.md` / `.markdown` / `.txt` |
| 深浅色 | 界面主题可切换并持久化 |
| 快捷键 | `Ctrl/Cmd + B` 加粗 · `Ctrl/Cmd + I` 斜体 · `Ctrl/Cmd + S` 立即保存 |

---

## 快速开始

### 环境要求

- Node.js **18+**（推荐 20 或 22）
- npm 9+

### 安装与运行

```bash
git clone https://github.com/duan-deqing/weijian.git
cd weijian
npm install
npm run dev
```

终端会提示本地地址，默认为：

```text
http://127.0.0.1:5173/weijian/
```

### 生产构建

```bash
npm run build
npm run preview
```

---

## 使用说明

1. 打开首页，点击 **进入编辑器**，或从 **我的文章** 选择草稿。
2. 在左侧输入 Markdown；右侧选择 **版式** 与 **配色**，预览即时更新。
3. 确认排版后点击 **复制到公众号**，再粘贴到公众号后台编辑器。
4. 图片请先上传到公众号素材库，再在文中使用图片 URL。

「文件」菜单支持导入 / 导出 Markdown；「示例」菜单可载入示例或清空当前稿。

更完整的操作说明见站内 **文档** 页（`#/docs`）。

---

## 路由

| 路径 | 说明 |
|------|------|
| `#/` | 产品介绍首页 |
| `#/editor` | 编辑器 |
| `#/articles` | 我的文章 |
| `#/docs` | 使用指南与更新日志 |

使用 Hash 路由，便于部署在任意静态子路径（如 GitHub Pages `/weijian/`）。

---

## 技术架构

```text
React 18 + TypeScript + Vite
        │
        ├─ marked (GFM) + 自定义 Renderer
        │     └─ 生成微信公众号内联样式 HTML
        ├─ highlight.js → 代码语法高亮
        └─ localStorage → 多草稿本地库
```

渲染与复制共用同一份 HTML，尽量保证「预览所见 = 粘贴所得」。

---

## 项目结构

```text
weijian/
├── public/                 # 静态资源（favicon 等）
├── src/
│   ├── components/         # UI 组件（编辑器面板、主题选择、弹层等）
│   ├── constants/          # 版式模版、配色、默认文案
│   ├── hooks/              # useDraft / useColorMode / useRouter 等
│   ├── lib/                # wechatMarkdown、clipboard、storage、highlight
│   ├── pages/              # 首页 / 编辑器 / 文章库 / 文档
│   ├── styles/             # 全局样式与主题变量
│   ├── App.tsx             # 路由与壳层
│   └── main.tsx            # 入口
├── .github/workflows/      # GitHub Pages 自动部署
├── package.json
└── vite.config.ts
```

---

## 开发与构建

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发服务器 |
| `npm run build` | `tsc -b` 类型检查 + Vite 产出 `dist/` |
| `npm run preview` | 本地预览生产构建 |

代码规范：TypeScript strict；提交前请保证 `npm run build` 通过。

---

## 部署

### GitHub Pages（已配置）

1. 推送到 `main` 分支。
2. Actions 工作流 **Deploy to GitHub Pages** 自动构建并发布。
3. 访问：`https://duan-deqing.github.io/weijian/`

Vite `base` 已设为 `/weijian/`。若部署到其它路径，请同步修改 `vite.config.ts` 中的 `base`。

### 其它静态托管

将 `npm run build` 生成的 `dist/` 上传到任意静态服务器即可；保持 `base` 与实际子路径一致。

---

## 浏览器支持

- Chrome / Edge / Firefox / Safari 近年版本
- 复制富文本依赖 **Clipboard API**（需 HTTPS 或 localhost）
- 移动端浏览器可正常使用；小屏采用单栏 + Tab 布局

---

## 常见问题

**粘贴到公众号后样式有偏差？**  
公众号后台会剥离部分 CSS。请使用「复制到公众号」按钮，并尽量在预览中选定版式后再复制；伪元素装饰在粘贴后可能不会保留。

**草稿会上传吗？**  
不会。内容仅保存在本机 `localStorage`。清理浏览器数据前请导出 Markdown。

**换电脑如何迁移？**  
在源机器「文件 → 导出 Markdown」，在目标机器「导入 Markdown」。

---

## 贡献

欢迎 Issue 与 Pull Request。

1. Fork 本仓库并创建分支：`git checkout -b feature/your-feature`
2. 完成修改并保证 `npm run build` 通过
3. 提交并推送：`git push origin feature/your-feature`
4. 开启 Pull Request，说明动机与改动范围

较大的功能变更建议先开 Issue 讨论。

---

## 许可

本项目采用 **GNU General Public License v3.0 or later**（GPL-3.0-or-later）开源。

你可以自由地使用、修改和分发本软件，但须遵守 GPL 的 copyleft 条款：

- 若分发本软件或基于本软件的衍生作品，**必须**以相同许可证（GPL）开放对应源代码
- 修改后的版本须保留原版权与许可声明
- 提供源代码的方式须满足 GPL 对「对应源码」的要求

完整文本见仓库根目录 [LICENSE](./LICENSE)，或访问：  
<https://www.gnu.org/licenses/gpl-3.0.html>

商业闭源使用或私有部署若与 GPL 冲突，请先联系作者协商授权。

---

<p align="center">
  <sub>微笺 Weijian · 把 Markdown 写成公众号文章</sub>
</p>
