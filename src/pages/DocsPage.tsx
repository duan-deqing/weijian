import { useState } from 'react'

type DocsTab = 'guide' | 'changelog'

const GUIDE_SECTIONS = [
  {
    id: 'start',
    title: '快速开始',
    items: [
      '在导航点击「我的文章」或首页 CTA 进入写作流程。',
      '编辑器左侧写 Markdown，右侧实时预览微信图文观感。',
      '顶栏可重命名当前文章；预览底部状态栏显示保存状态与字数。',
      '点「我的文章」回到草稿库，多篇稿件分开管理。',
    ],
  },
  {
    id: 'editor',
    title: '编辑器操作',
    items: [
      '工具栏：加粗 / 斜体 / 删除线 / 标题 / 引用 / 列表 / 代码 / 链接 / 图片 / 表格 / 分割线。',
      '宽度不够时，多余工具会折叠进「⋯」菜单。',
      '快捷键：Ctrl/Cmd + B 加粗，Ctrl/Cmd + I 斜体，Ctrl/Cmd + S 立即保存。',
      '「文件」菜单：导入 Markdown、导出 Markdown。',
      '「示例」菜单：载入示例、清空当前稿（清空会二次确认）。',
    ],
  },
  {
    id: 'preview',
    title: '预览与版式配色',
    items: [
      '版式模版 × 配色方案可独立组合：经典 / 现代卡片 / 文艺雅致 / 商务科技。',
      '配色含经典绿、知性蓝、冷灰黑、暖琥珀、蔷薇红、优雅紫。',
      '预览与「复制到公众号」共用内联样式 HTML，所见即可粘贴。',
      '底部状态栏显示：已保存 / 保存中、字数、预估阅读时间。',
      '深色 / 浅色界面主题在导航右侧圆形按钮切换，会记住偏好。',
    ],
  },
  {
    id: 'copy',
    title: '复制到公众号',
    items: [
      '顶栏「复制到公众号」：写入 text/html + 纯文本，可直接粘贴后台。',
      '代码块支持语法高亮，标题 / 引用 / 列表按所选版式生成内联样式。',
      '图片请先上传到公众号素材库，再使用图片 URL。',
      '外链在公众号内可能不可点，重要链接建议写进正文说明。',
    ],
  },
  {
    id: 'library',
    title: '文章库',
    items: [
      '卡片显示标题、摘要、创建 / 更新时间与字数。',
      '点卡片进入编辑；当前编辑中的稿件带「当前」标记。',
      '卡片操作：复制 Markdown、重命名、删除（站内弹层确认）。',
      '支持按标题 / 摘要搜索；可新建空白文章或从示例创建。',
    ],
  },
  {
    id: 'storage',
    title: '数据与隐私',
    items: [
      '全部草稿保存在浏览器 localStorage，不会上传服务器。',
      '默认最多保留 30 份草稿，按更新时间滚动。',
      '清理浏览器数据可能导致草稿丢失，重要稿件请及时导出 Markdown。',
      '换设备不会自动同步，请用导出 / 导入迁移。',
    ],
  },
]

const CHANGELOG = [
  {
    version: 'v1.4.0',
    date: '2026-09-14',
    tag: '当前',
    items: [
      '正式开源：采用 GPL-3.0-or-later 许可证',
      'GitHub Pages 自动部署至 duan-deqing.github.io/weijian/',
      'README 按开源项目规范重写（徽章、结构、贡献与许可说明）',
      '首页新增版式 × 配色介绍区，能力与流程文案对齐 v1.3',
    ],
  },
  {
    version: 'v1.3.0',
    date: '2026-09-14',
    tag: null,
    items: [
      '版式 × 配色两维模板：经典 / 卡片 / 文艺 / 科技 × 6 套配色',
      'marked 渲染微信内联 HTML，预览与复制结果一致',
      '代码语法高亮（highlight.js），科技风透明代码底',
      '修复列表加粗后中文顿号粘贴换行、CODE 顶栏 flex 失效',
      '共享站点导航、首页 Hero 与文档 / 更新日志',
    ],
  },
  {
    version: 'v1.2.0',
    date: '2026-09-14',
    tag: null,
    items: [
      '共享站点导航：首页 / 我的文章 / 文档，切换时导航保持不变',
      '新增文档页：完整使用指南 + 更新日志时间线',
      '首页内容精简与 CTA 次序优化',
      '文章库卡片与操作按钮视觉统一',
    ],
  },
  {
    version: 'v1.1.0',
    date: '2026-09-14',
    tag: null,
    items: [
      '编辑器导航改为胶囊条，含文件 / 示例下拉',
      '预览底部增加保存状态与字数栏',
      '工具栏 SVG 图标 + 自适应折叠',
      '主题下拉移至预览顶栏',
    ],
  },
  {
    version: 'v1.0.0',
    date: '2026-09-13',
    tag: null,
    items: [
      'React 18 + TypeScript + Vite 工程化',
      '双栏编辑 / 预览、三种排版主题',
      '多草稿本地库、导入导出 Markdown',
      '深浅色界面、文章库管理页',
    ],
  },
]

export function DocsPage() {
  const [tab, setTab] = useState<DocsTab>('guide')

  return (
    <div className="docs-page">
      <main className="docs-main">
        <section className="docs-hero">
          <p className="landing-section-eyebrow">Documentation</p>
          <h1 className="articles-title">文档</h1>
          <p className="articles-sub">
            使用指南与更新日志。先看「使用指南」熟悉编辑器，再查「更新日志」了解版本变化。
          </p>

          <div className="docs-tabs" role="tablist" aria-label="文档分类">
            <button
              type="button"
              role="tab"
              aria-pressed={tab === 'guide'}
              className={`docs-tab ${tab === 'guide' ? 'is-active' : ''}`}
              onClick={() => setTab('guide')}
            >
              使用指南
            </button>
            <button
              type="button"
              role="tab"
              aria-pressed={tab === 'changelog'}
              className={`docs-tab ${tab === 'changelog' ? 'is-active' : ''}`}
              onClick={() => setTab('changelog')}
            >
              更新日志
            </button>
          </div>
        </section>

        {tab === 'guide' ? (
          <div className="docs-body">
            {GUIDE_SECTIONS.map((section) => (
              <section key={section.id} id={section.id} className="docs-section">
                <h2 className="docs-section-title">{section.title}</h2>
                <ul className="docs-list">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}

            <section className="docs-section docs-section--tip">
              <h2 className="docs-section-title">小提示</h2>
              <p className="docs-tip">
                遇到粘贴后样式丢失时，可先复制 Markdown，再在公众号后台用编辑器重新排版；
                或检查是否在预览中确认了主题与层级后再复制。
              </p>
            </section>
          </div>
        ) : (
          <div className="changelog" aria-label="更新日志">
            {CHANGELOG.map((entry, index) => (
              <article key={entry.version} className="changelog-item">
                <div className="changelog-rail" aria-hidden="true">
                  <span className={`changelog-dot ${index === 0 ? 'is-current' : ''}`} />
                  {index < CHANGELOG.length - 1 && <span className="changelog-line" />}
                </div>
                <div className="changelog-content">
                  <div className="changelog-head">
                    <h2 className="changelog-version">{entry.version}</h2>
                    {entry.tag && <span className="changelog-tag">{entry.tag}</span>}
                    <time className="changelog-date" dateTime={entry.date}>
                      {entry.date}
                    </time>
                  </div>
                  <ul className="docs-list">
                    {entry.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
