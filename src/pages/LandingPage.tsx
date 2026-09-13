import { BlurText } from '../components/motion/BlurText'
import { MagneticButton } from '../components/motion/MagneticButton'
import { IconBook, IconFolder, IconPen } from '../components/Icons'
import { HeroEditorDemo } from '../components/HeroEditorDemo'
import { COLOR_THEME_LIST, TEMPLATE_STYLE_LIST } from '../constants/themes'

interface LandingPageProps {
  onEnter: () => void
  onOpenArticles: () => void
  onOpenDocs: () => void
}

const FEATURES = [
  {
    no: '01',
    title: '专注书写',
    body: '等宽编辑区、图标工具栏、快捷键。少打扰，把句子写完。',
  },
  {
    no: '02',
    title: '微信观感预览',
    body: '版式 × 配色实时渲染，标题、引用、代码块贴近图文阅读。',
  },
  {
    no: '03',
    title: '带样式复制',
    body: '一键写入内联 HTML，粘贴公众号后台尽量还原预览。',
  },
  {
    no: '04',
    title: '本地文章库',
    body: '最多 30 份草稿自动保存，搜索、重命名、切换、删除。',
  },
  {
    no: '05',
    title: '导入导出',
    body: '支持 .md / .markdown / .txt，原稿可随时带走。',
  },
  {
    no: '06',
    title: '语法高亮',
    body: '代码块带语言标签与高亮，科技风可切换透明底。',
  },
]

const STEPS = [
  { no: '01', title: '写', body: 'Markdown 写标题、段落、列表、代码与表格。' },
  { no: '02', title: '选', body: '在预览顶栏组合版式与配色，确认图文气质。' },
  { no: '03', title: '管', body: '在「我的文章」搜索、重命名或删除草稿。' },
  { no: '04', title: '贴', body: '复制到公众号，后台继续微调后发布。' },
]

export function LandingPage({ onEnter, onOpenArticles, onOpenDocs }: LandingPageProps) {
  return (
    <div className="landing">
      <main className="landing-main">
        <section className="zs-hero">
          <div className="zs-hero-top">
            <div className="zs-hero-inner">
              <p className="zs-hero-badge fade-up">
                <span className="zs-hero-badge-dot" />
                WEIJIAN v1.3 · 公众号写作工作台
              </p>

              <h1 className="zs-hero-title fade-up" style={{ animationDelay: '0.08s' }}>
                <BlurText text="把 Markdown，" delayMs={40} stepMs={26} />
                <br />
                <span className="zs-hero-title-accent">
                  <BlurText text="写成公众号文章。" delayMs={300} stepMs={26} />
                </span>
              </h1>

              <p className="zs-hero-sub fade-up" style={{ animationDelay: '0.18s' }}>
                左边是原稿，右边是微信图文观感。版式与配色可独立组合，
                语法高亮代码块、本机文章库、一键复制内联样式——从草稿到后台尽量少断点。
              </p>

              <div className="zs-hero-actions fade-up" style={{ animationDelay: '0.26s' }}>
                <MagneticButton className="zs-btn zs-btn-primary" onClick={onEnter}>
                  <IconPen />
                  <span>进入编辑器</span>
                </MagneticButton>
                <button type="button" className="zs-btn zs-btn-ghost" onClick={onOpenArticles}>
                  <IconFolder />
                  <span>我的文章</span>
                </button>
                <button type="button" className="zs-btn zs-btn-ghost" onClick={onOpenDocs}>
                  <IconBook />
                  <span>查看文档</span>
                </button>
              </div>

              <p className="zs-hero-note fade-up" style={{ animationDelay: '0.32s' }}>
                无需登录 · 数据仅存本机 · 可深浅色切换
              </p>
            </div>

            <div className="zs-hero-visual fade-up" style={{ animationDelay: '0.4s' }}>
              <div className="zs-live-frame">
                <HeroEditorDemo />
              </div>
            </div>
          </div>

          <dl className="zs-hero-stats fade-up" style={{ animationDelay: '0.5s' }} aria-label="产品要点">
            <div>
              <dt>4×6</dt>
              <dd>版式 × 配色</dd>
            </div>
            <div>
              <dt>双栏</dt>
              <dd>写作 / 预览</dd>
            </div>
            <div>
              <dt>30</dt>
              <dd>本机草稿上限</dd>
            </div>
            <div>
              <dt>0</dt>
              <dd>账号与服务器</dd>
            </div>
          </dl>
        </section>

        <section className="landing-section" aria-labelledby="templates-title">
          <div className="landing-section-head">
            <p className="landing-section-eyebrow">Templates</p>
            <h2 id="templates-title" className="landing-section-title">
              版式定结构，配色定气质
            </h2>
            <p className="landing-section-desc">
              四套版式负责标题与引用装饰，六套配色只换主色与辅助色，可任意组合。
            </p>
          </div>
          <div className="landing-template-row">
            {TEMPLATE_STYLE_LIST.map((t) => (
              <article key={t.id} className="landing-template-card">
                <span className="landing-template-tag">{t.tag}</span>
                <h3 className="landing-template-name">{t.name}</h3>
                <p className="landing-template-desc">{t.desc}</p>
              </article>
            ))}
          </div>
          <div className="landing-color-row" aria-label="配色方案">
            {COLOR_THEME_LIST.map((c) => (
              <div key={c.id} className="landing-color-item">
                <span className="landing-color-dot" style={{ background: c.primaryColor }} />
                <span>{c.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="landing-section" aria-labelledby="features-title">
          <div className="landing-section-head">
            <p className="landing-section-eyebrow">Capabilities</p>
            <h2 id="features-title" className="landing-section-title">
              写作链路上需要的，刚好都有
            </h2>
            <p className="landing-section-desc">
              不做花哨的富文本画布，只把「写 Markdown → 看微信观感 → 复制回后台」做顺。
            </p>
          </div>
          <div className="landing-features">
            {FEATURES.map((item, index) => (
              <article
                key={item.no}
                className="landing-feature"
                style={{ animationDelay: `${60 + index * 50}ms` }}
              >
                <div className="landing-feature-no">{item.no}</div>
                <h3 className="landing-feature-title">{item.title}</h3>
                <p className="landing-feature-body">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section" aria-labelledby="flow-title">
          <div className="landing-section-head">
            <p className="landing-section-eyebrow">Workflow</p>
            <h2 id="flow-title" className="landing-section-title">
              四步，从空白到可粘贴
            </h2>
          </div>
          <ol className="landing-steps landing-steps--grid">
            {STEPS.map((step) => (
              <li key={step.no} className="landing-step">
                <span className="landing-step-no">{step.no}</span>
                <div>
                  <h3 className="landing-step-title">{step.title}</h3>
                  <p className="landing-step-body">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="landing-cta-band" aria-labelledby="final-cta-title">
          <div>
            <p className="landing-section-eyebrow">Start writing</p>
            <h2 id="final-cta-title" className="landing-cta-band-title">
              准备好写下一篇了吗？
            </h2>
            <p className="landing-cta-band-body">
              打开编辑器即可开始；或先看文档了解快捷键与版式说明。
            </p>
          </div>
          <MagneticButton className="landing-primary-cta" onClick={onEnter}>
            <IconPen />
            <span>进入编辑器</span>
          </MagneticButton>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="site-footer-brand">
            <div className="site-footer-title">微笺 Weijian</div>
            <p className="site-footer-desc">
              面向公众号作者的 Markdown 写作工作台。本地优先，开箱即用，把稿子从草稿贴回后台。
            </p>
          </div>

          <div className="site-footer-cols">
            <div className="site-footer-col">
              <h3 className="site-footer-heading">产品</h3>
              <button type="button" className="site-footer-link" onClick={onEnter}>
                编辑器
              </button>
              <button type="button" className="site-footer-link" onClick={onOpenArticles}>
                我的文章
              </button>
              <button type="button" className="site-footer-link" onClick={onOpenDocs}>
                使用文档
              </button>
            </div>

            <div className="site-footer-col">
              <h3 className="site-footer-heading">资源</h3>
              <button type="button" className="site-footer-link" onClick={onOpenDocs}>
                快速开始
              </button>
              <button type="button" className="site-footer-link" onClick={onOpenDocs}>
                更新日志
              </button>
              <span className="site-footer-meta">v1.3.0</span>
            </div>

            <div className="site-footer-col">
              <h3 className="site-footer-heading">技术</h3>
              <span className="site-footer-meta">React 18</span>
              <span className="site-footer-meta">TypeScript</span>
              <span className="site-footer-meta">Vite</span>
              <span className="site-footer-meta">localStorage</span>
            </div>
          </div>
        </div>

        <div className="site-footer-bottom">
          <span>© {new Date().getFullYear()} 微笺 Weijian</span>
          <span className="site-footer-dot" aria-hidden="true" />
          <span>纯前端应用 · 草稿不上传服务器</span>
          <span className="site-footer-dot" aria-hidden="true" />
          <span>请自行导出备份重要内容</span>
        </div>
      </footer>
    </div>
  )
}
