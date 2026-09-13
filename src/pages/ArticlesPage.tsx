import { useCallback, useMemo, useState } from 'react'
import { Toast } from '../components/Toast'
import { ConfirmDialog, PromptDialog } from '../components/Modal'
import { useToast } from '../hooks/useToast'
import {
  createDraft,
  deleteDraft,
  formatDate,
  getDraftById,
  listArticles,
  renameDraft,
  switchDraft,
} from '../lib/storage'
import { copyPlainText } from '../lib/clipboard'
import { DEFAULT_MD } from '../constants/content'
import { IconCopy, IconFlask, IconPen, IconPlus } from '../components/Icons'

interface ArticlesPageProps {
  onEnterEditor: () => void
}

type RenameState = { id: string; name: string } | null
type DeleteState = { id: string; name: string } | null

export function ArticlesPage({ onEnterEditor }: ArticlesPageProps) {
  const [version, setVersion] = useState(0)
  const [query, setQuery] = useState('')
  const [renameState, setRenameState] = useState<RenameState>(null)
  const [deleteState, setDeleteState] = useState<DeleteState>(null)
  const { toast, showToast } = useToast()
  const articles = useMemo(() => listArticles(), [version])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return articles
    return articles.filter(
      (a) => a.name.toLowerCase().includes(q) || a.preview.toLowerCase().includes(q),
    )
  }, [articles, query])

  const refresh = useCallback(() => setVersion((v) => v + 1), [])

  const handleOpen = useCallback(
    (id: string) => {
      if (switchDraft(id)) onEnterEditor()
    },
    [onEnterEditor],
  )

  const handleCopy = useCallback(
    async (id: string) => {
      const meta = articles.find((a) => a.id === id)
      const full = getDraftById(id)
      if (!full) {
        showToast('文章不存在')
        return
      }
      const ok = await copyPlainText(full.content)
      showToast(ok ? `已复制「${meta?.name ?? full.name}」的 Markdown` : '复制失败')
    },
    [articles, showToast],
  )

  const confirmRename = useCallback(
    (name: string) => {
      if (!renameState) return
      renameDraft(renameState.id, name)
      setRenameState(null)
      showToast('已重命名')
      refresh()
    },
    [renameState, refresh, showToast],
  )

  const confirmDelete = useCallback(() => {
    if (!deleteState) return
    if (deleteDraft(deleteState.id)) {
      setDeleteState(null)
      showToast('已删除文章')
      refresh()
    }
  }, [deleteState, refresh, showToast])

  const handleNew = useCallback(() => {
    const now = new Date()
    const hh = String(now.getHours()).padStart(2, '0')
    const mm = String(now.getMinutes()).padStart(2, '0')
    createDraft('', `未命名 ${now.getMonth() + 1}/${now.getDate()} ${hh}:${mm}`)
    onEnterEditor()
  }, [onEnterEditor])

  const handleNewFromSample = useCallback(() => {
    createDraft(DEFAULT_MD, '示例文章')
    onEnterEditor()
  }, [onEnterEditor])

  return (
    <div className="articles-page">
      <main className="articles-main">
        <section className="articles-hero">
          <p className="landing-section-eyebrow">Library</p>
          <h1 className="articles-title">我的文章</h1>
          <p className="articles-sub">
            本机保存的全部草稿。点卡片进入编辑；也可复制 Markdown、重命名或删除。
          </p>
          <div className="articles-hero-meta">
            <span>My Articles</span>
            <span className="dot" aria-hidden="true" />
            <span>{articles.length} 篇</span>
            <span className="dot" aria-hidden="true" />
            <span>本机存储</span>
          </div>

          <div className="articles-toolbar">
            <input
              className="articles-search"
              type="search"
              placeholder="搜索标题或摘要…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="搜索文章"
            />
            <div className="articles-toolbar-actions">
              <button type="button" className="btn-ghost" onClick={handleNewFromSample}>
                <IconFlask />
                <span>从示例新建</span>
              </button>
              <button type="button" className="btn-primary" onClick={handleNew}>
                <IconPlus />
                <span>新建空白文章</span>
              </button>
            </div>
          </div>
        </section>

        {filtered.length === 0 ? (
          <section className="articles-empty">
            <p className="articles-empty-title">{query ? '没有匹配的文章' : '还没有文章'}</p>
            <p className="articles-empty-body">
              {query ? '换个关键词试试，或清空搜索。' : '新建一篇空白文章，或导入本地 Markdown。'}
            </p>
            {!query && (
              <button type="button" className="btn-primary" onClick={handleNew}>
                <IconPlus />
                <span>新建空白文章</span>
              </button>
            )}
          </section>
        ) : (
          <section className="articles-grid" aria-label="文章列表">
            {filtered.map((article) => (
              <article
                key={article.id}
                className={`article-card ${article.isActive ? 'is-active' : ''}`}
              >
                <button
                  type="button"
                  className="article-card-open"
                  onClick={() => handleOpen(article.id)}
                >
                  <div className="article-card-top">
                    {article.isActive && <span className="article-card-badge">当前</span>}
                    <span className="article-card-chars">
                      {article.chars} 字 · 约 {article.minutes} 分钟
                    </span>
                  </div>
                  <h2 className="article-card-title">{article.name}</h2>
                  <p className="article-card-preview">{article.preview}</p>
                  <div className="article-card-meta">
                    <span>
                      <span className="article-card-meta-label">创建</span>
                      {formatDate(article.createdAt)}
                    </span>
                    <span>
                      <span className="article-card-meta-label">更新</span>
                      {formatDate(article.updatedAt)}
                    </span>
                  </div>
                </button>

                <div className="article-card-actions">
                  <button
                    type="button"
                    className="article-card-action"
                    onClick={() => void handleCopy(article.id)}
                  >
                    <IconCopy />
                    <span>复制</span>
                  </button>
                  <button
                    type="button"
                    className="article-card-action"
                    onClick={() => setRenameState({ id: article.id, name: article.name })}
                  >
                    <IconPen />
                    <span>重命名</span>
                  </button>
                  <button
                    type="button"
                    className="article-card-action article-card-action--danger"
                    onClick={() => setDeleteState({ id: article.id, name: article.name })}
                  >
                    <span>删除</span>
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      <PromptDialog
        open={Boolean(renameState)}
        title="重命名文章"
        description="修改后会立即保存到本机草稿库。"
        defaultValue={renameState?.name ?? ''}
        placeholder="输入新标题"
        confirmLabel="保存"
        onSubmit={confirmRename}
        onCancel={() => setRenameState(null)}
      />

      <ConfirmDialog
        open={Boolean(deleteState)}
        title="删除文章"
        description={`确定删除「${deleteState?.name ?? ''}」？此操作不可恢复。`}
        confirmLabel="删除"
        cancelLabel="取消"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteState(null)}
      />

      <Toast message={toast} />
    </div>
  )
}
