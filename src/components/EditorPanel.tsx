import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { MutableRefObject, Ref } from 'react'
import type { ToolSpec } from '../types'
import { TOOLS, insertMarkdown } from '../lib/editor'
import {
  IconBold,
  IconCode,
  IconH1,
  IconH2,
  IconH3,
  IconHr,
  IconImage,
  IconItalic,
  IconLink,
  IconList,
  IconListOrdered,
  IconMore,
  IconQuote,
  IconStrike,
  IconTable,
} from './Icons'

interface EditorPanelProps {
  active: boolean
  value: string
  onChange: (value: string) => void
  textareaRef: MutableRefObject<HTMLTextAreaElement | null>
}

const ICONS: Record<string, (props: { className?: string }) => React.ReactElement> = {
  bold: IconBold,
  italic: IconItalic,
  strike: IconStrike,
  h1: IconH1,
  h2: IconH2,
  h3: IconH3,
  quote: IconQuote,
  ul: IconList,
  ol: IconListOrdered,
  code: IconCode,
  link: IconLink,
  image: IconImage,
  table: IconTable,
  hr: IconHr,
}

const TOOL_W = 36
const TOOL_GAP = 4

export function EditorPanel({ active, value, onChange, textareaRef }: EditorPanelProps) {
  const toolbarRef = useRef<HTMLDivElement | null>(null)
  const [visibleCount, setVisibleCount] = useState(TOOLS.length)
  const [overflowOpen, setOverflowOpen] = useState(false)

  const handleTool = useCallback((tool: ToolSpec) => {
    insertMarkdown(textareaRef.current, tool)
    setOverflowOpen(false)
  }, [textareaRef])

  useLayoutEffect(() => {
    const el = toolbarRef.current
    if (!el) return

    const measure = () => {
      const width = el.clientWidth
      if (width <= 0) return

      let capacity = Math.floor((width + TOOL_GAP) / (TOOL_W + TOOL_GAP))
      if (capacity >= TOOLS.length) {
        setVisibleCount(TOOLS.length)
        return
      }
      // 预留「更多」按钮
      capacity = Math.max(1, capacity - 1)
      setVisibleCount(capacity)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [active])

  useEffect(() => {
    if (!overflowOpen) return
    const onDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest?.('.toolbar-overflow')) setOverflowOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [overflowOpen])

  const visible = TOOLS.slice(0, visibleCount)
  const hidden = TOOLS.slice(visibleCount)

  return (
    <section className={`panel ${active ? 'is-active' : ''}`} aria-label="Markdown 编辑器">
      <div className="panel-head panel-head--editor">
        <span className="panel-title">写作</span>
        <div className="toolbar" ref={toolbarRef} role="toolbar" aria-label="格式工具">
          {visible.map((tool) => {
            const Icon = ICONS[tool.id]
            return (
              <button
                key={tool.id}
                className="tool"
                type="button"
                onClick={() => handleTool(tool)}
                title={tool.label}
                aria-label={tool.label}
              >
                {Icon ? <Icon /> : tool.label}
              </button>
            )
          })}

          {hidden.length > 0 && (
            <div className="toolbar-overflow">
              <button
                type="button"
                className="tool tool--more"
                title="更多工具"
                aria-label="更多工具"
                aria-expanded={overflowOpen}
                onClick={() => setOverflowOpen((v) => !v)}
              >
                <IconMore />
              </button>
              {overflowOpen && (
                <div className="toolbar-overflow-menu" role="menu">
                  {hidden.map((tool) => {
                    const Icon = ICONS[tool.id]
                    return (
                      <button
                        key={tool.id}
                        type="button"
                        role="menuitem"
                        className="toolbar-overflow-item"
                        onClick={() => handleTool(tool)}
                      >
                        {Icon ? <Icon /> : null}
                        <span>{tool.label}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="editor-body">
        <textarea
          ref={textareaRef as Ref<HTMLTextAreaElement>}
          className="editor-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          placeholder="用 Markdown 开始写…"
          aria-label="Markdown 正文"
        />
      </div>
    </section>
  )
}
