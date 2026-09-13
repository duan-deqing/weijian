# 微笺 Weijian

面向微信公众号的 **Markdown 写作工作台**。左边写原稿，右边看微信图文观感，一键复制带内联样式的内容到公众号后台。

**版本** 1.3.0 · 纯前端 · 数据仅存本机

---

## 功能

- **双栏编辑**：Markdown 编辑器 + 实时预览，支持快捷键与图标工具栏
- **版式 × 配色**：经典 / 现代卡片 / 文艺雅致 / 商务科技，与 6 套配色可独立组合
- **复制到公众号**：marked 生成内联样式 HTML，预览与粘贴结果一致
- **代码高亮**：highlight.js，科技风透明代码底
- **文章库**：本机最多 30 份草稿，搜索、重命名、复制、删除
- **导入导出**：`.md` / `.markdown` / `.txt`
- **深浅色**：界面主题可切换并记住偏好

## 快速开始

```bash
npm install
npm run dev
```

浏览器打开终端提示的本地地址（默认 `http://127.0.0.1:5173`）。

```bash
npm run build    # 类型检查 + 产出 dist/
npm run preview  # 预览生产构建
```

## 路由

| 路径 | 页面 |
|------|------|
| `#/` | 首页介绍 |
| `#/editor` | 编辑器 |
| `#/articles` | 我的文章 |
| `#/docs` | 文档与更新日志 |

## 技术栈

- React 18 + TypeScript + Vite 6
- marked（GFM）→ 微信内联 HTML 渲染器
- highlight.js 语法高亮
- localStorage 本地草稿

## 项目结构

```
src/
├── pages/           # 首页 / 编辑器 / 文章库 / 文档
├── components/      # 编辑器面板、主题选择、弹层等
├── lib/             # wechatMarkdown、clipboard、storage
├── hooks/           # useDraft、useColorMode、useRouter
└── constants/       # 版式模版与配色
```

## 说明

- 草稿不会上传服务器；清理浏览器数据前请先导出 Markdown。
- 图片需先上传到公众号素材库，再在文中使用 URL。
- 站内删除 / 重命名使用应用内弹层，不会调用系统 alert。

## 许可

私有项目，未附带开源许可证。
