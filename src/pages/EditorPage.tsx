import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { MobileTab } from '../types'
import { EditorPanel } from '../components/EditorPanel'
import { PreviewPanel } from '../components/PreviewPanel'
import { TopBar } from '../components/TopBar'
import { MobileTabs } from '../components/MobileTabs'
import { Toast } from '../components/Toast'
import { useDraft } from '../hooks/useDraft'
import { useToast } from '../hooks/useToast'
import { countStats, insertMarkdown, TOOLS } from '../lib/editor'
import { markdownToWechatHtml } from '../lib/wechatMarkdown'
import { copyWechatRichText } from '../lib/clipboard'
import {
  downloadTextFile,
  isMarkdownFile,
  readMarkdownFile,
  safeFilename,
} from '../lib/file'
import { GridBackdrop } from '../components/motion/GridBackdrop'
import type { ColorMode } from '../hooks/useColorMode'
import { ConfirmDialog } from '../components/Modal'

interface EditorPageProps {
  onOpenArticles: () => void
  colorMode: ColorMode
  onToggleColorMode: () => void
}

export function EditorPage({ onOpenArticles, colorMode, onToggleColorMode }: EditorPageProps) {
  const draft = useDraft()
  const { toast, showToast } = useToast()
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const previewRef = useRef<HTMLElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [mobileTab, setMobileTab] = useState<MobileTab>('write')
  const [clearOpen, setClearOpen] = useState(false)

  const html = useMemo(
    () => markdownToWechatHtml(draft.content, draft.templateStyle, draft.colorTheme),
    [draft.content, draft.templateStyle, draft.colorTheme],
  )
  const stats = useMemo(() => countStats(draft.content), [draft.content])

  const handleCopyRich = useCallback(async () => {
    const rich = markdownToWechatHtml(draft.content, draft.templateStyle, draft.colorTheme)
    const result = await copyWechatRichText(rich, draft.content)
    showToast(result.message)
  }, [draft.content, draft.templateStyle, draft.colorTheme, showToast])

  const handleExport = useCallback(() => {
    downloadTextFile(safeFilename(draft.draftName), draft.content)
    showToast('已导出 .md 文件')
  }, [draft.content, draft.draftName, showToast])

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleImportFile = useCallback(
    async (file: File | undefined | null) => {
      if (!file) return
      if (!isMarkdownFile(file)) {
        showToast('请选择 .md / .markdown / .txt 文件')
        return
      }
      try {
        const text = await readMarkdownFile(file)
        const name = file.name.replace(/\.(md|markdown|txt)$/i, '') || '导入的草稿'
        draft.loadFromImport(text, name)
        setMobileTab('write')
        showToast(`已导入「${name}」`)
      } catch (error) {
        const message = error instanceof Error ? error.message : '导入失败'
        showToast(message)
      }
    },
    [draft, showToast],
  )

  const handleClear = useCallback(() => {
    setClearOpen(true)
  }, [])

  const handleResetSample = useCallback(() => {
    draft.resetSample()
    showToast('已载入示例内容')
  }, [draft, showToast])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey
      if (!meta) return

      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault()
        insertMarkdown(textareaRef.current, TOOLS[0])
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault()
        insertMarkdown(textareaRef.current, TOOLS[1])
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault()
        const ok = draft.persistNow()
        showToast(ok ? '草稿已保存到本机' : '保存失败')
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [draft, showToast])

  return (
    <div className="app app--editor">
      <GridBackdrop variant={colorMode === 'dark' ? 'dark' : 'light'} />

      <TopBar
        onOpenArticles={onOpenArticles}
        colorMode={colorMode}
        onToggleColorMode={onToggleColorMode}
        draftName={draft.draftName}
        onRename={draft.rename}
        onCopyRich={handleCopyRich}
        onImport={handleImportClick}
        onExport={handleExport}
        onResetSample={handleResetSample}
        onClear={handleClear}
      />

      <MobileTabs tab={mobileTab} onChange={setMobileTab} />

      <main className="workspace">
        <EditorPanel
          active={mobileTab === 'write'}
          value={draft.content}
          onChange={draft.setContent}
          textareaRef={textareaRef}
        />
        <PreviewPanel
          active={mobileTab === 'preview'}
          html={html}
          templateStyle={draft.templateStyle}
          colorTheme={draft.colorTheme}
          onTemplateStyleChange={draft.setTemplateStyle}
          onColorThemeChange={draft.setColorTheme}
          chars={stats.chars}
          minutes={stats.minutes}
          saveState={draft.saveState}
          previewRef={previewRef}
        />
      </main>

      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.txt,text/markdown,text/plain"
        hidden
        onChange={(e) => {
          void handleImportFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />

      <ConfirmDialog
        open={clearOpen}
        title="清空当前草稿"
        description="将删除编辑器中的全部内容。可在「我的文章」中继续管理其它稿件。"
        confirmLabel="清空"
        cancelLabel="取消"
        danger
        onConfirm={() => {
          draft.clearContent()
          setClearOpen(false)
          showToast('已清空，可重新开始写作')
        }}
        onCancel={() => setClearOpen(false)}
      />

      <Toast message={toast} />
    </div>
  )
}
