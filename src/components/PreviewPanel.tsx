import type { MutableRefObject, Ref } from 'react'
import type { ColorThemeId, SaveState, TemplateStyleId } from '../types'
import { ThemeSelect } from './ThemeSelect'

const saveLabel: Record<SaveState, string> = {
  idle: '待保存',
  saving: '保存中',
  saved: '已保存',
  error: '保存失败',
}

interface PreviewPanelProps {
  active: boolean
  html: string
  templateStyle: TemplateStyleId
  colorTheme: ColorThemeId
  onTemplateStyleChange: (id: TemplateStyleId) => void
  onColorThemeChange: (id: ColorThemeId) => void
  chars: number
  minutes: number
  saveState: SaveState
  previewRef: MutableRefObject<HTMLElement | null>
}

export function PreviewPanel({
  active,
  html,
  templateStyle,
  colorTheme,
  onTemplateStyleChange,
  onColorThemeChange,
  chars,
  minutes,
  saveState,
  previewRef,
}: PreviewPanelProps) {
  return (
    <section className={`panel ${active ? 'is-active' : ''}`} aria-label="公众号预览">
      <div className="panel-head panel-head--preview">
        <span className="panel-title">预览</span>
        <div className="panel-head-spacer" />
        <ThemeSelect
          templateStyle={templateStyle}
          colorTheme={colorTheme}
          onTemplateStyleChange={onTemplateStyleChange}
          onColorThemeChange={onColorThemeChange}
        />
      </div>
      <div className="preview-body">
        <article className="article-paper">
          <div className="article-kicker">
            <span className="article-kicker-label">WeChat Preview</span>
            <span className="article-kicker-meta">{chars} 字</span>
          </div>
          <div
            ref={previewRef as Ref<HTMLDivElement>}
            className="wx-inline-body"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
      </div>
      <footer className="preview-status" aria-live="polite">
        <span className="preview-status-item">
          <span className={`preview-status-dot is-${saveState}`} aria-hidden="true" />
          {saveLabel[saveState]}
        </span>
        <span className="preview-status-sep" aria-hidden="true" />
        <span className="preview-status-item">
          {chars} 字 · 约 {minutes} 分钟
        </span>
      </footer>
    </section>
  )
}
