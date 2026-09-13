import { BlurText } from '../components/motion/BlurText'
import { MagneticButton } from '../components/motion/MagneticButton'
import { IconBook, IconFolder, IconPen } from '../components/Icons'
import { HeroEditorDemo } from '../components/HeroEditorDemo'

interface LandingPageProps {
  onEnter: () => void
  onOpenArticles: () => void
  onOpenDocs: () => void
}

const FEATURES = [
  {
    no: '01',
    title: '专注书写',
    body: '等宽编辑区、图标工具栏、快捷键插入。少打扰，让你把句子写完。',
  },
  {
    no: '02',
    title: '微信观感预览',
    body: '17px 正文、1.75 行距、引用与代码块贴近手机图文阅读节奏。',
  },
  {
    no: '03',
    title: '带样式复制',
    body: '复制 Markdown 或内联富文本，粘贴进公众号后台仍保留层级。',
  },
  {
    no: '04',
    title: '多草稿本地库',
    body: '自动保存到浏览器，最多 30 份草稿，可重命名、切换、删除。',
  },
  {
    no: '05',
    title: '导入与导出',
    body: '支持 .md / .markdown / .txt；按草稿名导出，随时带走原稿。',
  },
  {
    no: '06',
    title: '三种排版主题',
    body: '经典、墨黑、杂志——同一 Markdown，不同气质的文章观感。',
  },
]

const STEPS = [
  { no: '01', title: '写', body: '在编辑器用 Markdown 写标题、段落、列表、代码与表格。' },
  { no: '02', title: '看', body: '右侧即时预览微信图文观感，确认节奏与层级。' },
  { no: '03', title: '管', body: '在「我的文章」里搜索、重命名、复制或删除草稿。' },
  { no: '04', title: '贴', body: '复制 Markdown 或富文本，粘贴回公众号后台继续排版。' },
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
                WEIJIAN · 公众号写作工作台
              </p>

              <h1 className="zs-hero-title fade-up" style={{ animationDelay: '0.08s' }}>
                <BlurText text="把 Markdown，" delayMs={40} stepMs={26} />
                <br />
                <span className="zs-hero-title-accent">
                  <BlurText text="写成公众号文章。" delayMs={300} stepMs={26} />
                </span>
              </h1>

              <p className="zs-hero-sub fade-up" style={{ animationDelay: '0.18s' }}>
                为公众号长文准备的极简工作台：左边是原稿，右边是微信图文观感。
                本地保存、导入导出、一键复制——从草稿到后台，尽量少断点。
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
              <dt>双栏</dt>
              <dd>写作 / 预览</dd>
            </div>
            <div>
              <dt>3</dt>
              <dd>排版主题</dd>
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

        <section className="landing-section" aria-labelledby="features-title">
          <div className="landing-section-head">
            <p className="landing-section-eyebrow">Capabilities</p>
            <h2 id="features-title" className="landing-section-title">
              写作链路上需要的，刚好都有
            </h2>
            <p className="landing-section-desc">
              不做花哨的富文本画布，只把「写 Markdown → 看微信观感 → 复制回后台」这件事做顺。
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

        <section className="landing-section landing-section--split" aria-labelledby="flow-title">
          <div className="landing-section-head">
            <p className="landing-section-eyebrow">Workflow</p>
            <h2 id="flow-title" className="landing-section-title">
              四步，从空白到可粘贴
            </h2>
          </div>
          <ol className="landing-steps">
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
          <div className="landing-preview-mock">
            <div className="landing-preview-mock-chrome">
              <span />
              <span />
              <span />
            </div>
            <div className="landing-preview-mock-body">
              <div className="landing-preview-mock-kicker">WeChat Preview</div>
              <div className="landing-preview-mock-h1" />
              <div className="landing-preview-mock-line" />
              <div className="landing-preview-mock-line short" />
              <div className="landing-preview-mock-quote" />
              <div className="landing-preview-mock-code" />
            </div>
          </div>
        </section>

        <section className="landing-cta-band" aria-labelledby="final-cta-title">
          <div>
            <p className="landing-section-eyebrow">Start writing</p>
            <h2 id="final-cta-title" className="landing-cta-band-title">
              准备好写下一篇了吗？
            </h2>
            <p className="landing-cta-band-body">
              打开编辑器即可开始；也可以先看文档了解导入导出与快捷键。
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
            <div className="site-footer-title">微笺</div>
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
              <button
                type="button"
                className="site-footer-link"
                onClick={() => onOpenDocs()}
              >
                快速开始
              </button>
              <button
                type="button"
                className="site-footer-link"
                onClick={() => onOpenDocs()}
              >
                快捷键说明
              </button>
              <button
                type="button"
                className="site-footer-link"
                onClick={() => onOpenDocs()}
              >
                更新日志
              </button>
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
