import { useEffect, useRef, useState } from 'react'
import type { ColorThemeId, TemplateStyleId } from '../types'
import {
  COLOR_THEME_LIST,
  TEMPLATE_STYLE_LIST,
} from '../constants/themes'
import { IconChevronDown } from './Icons'

interface ThemeSelectProps {
  templateStyle: TemplateStyleId
  colorTheme: ColorThemeId
  onTemplateStyleChange: (id: TemplateStyleId) => void
  onColorThemeChange: (id: ColorThemeId) => void
}

type Panel = 'style' | 'color' | null

export function ThemeSelect({
  templateStyle,
  colorTheme,
  onTemplateStyleChange,
  onColorThemeChange,
}: ThemeSelectProps) {
  const [panel, setPanel] = useState<Panel>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  const styleLabel = TEMPLATE_STYLE_LIST.find((t) => t.id === templateStyle)?.name ?? '版式'
  const colorLabel = COLOR_THEME_LIST.find((c) => c.id === colorTheme)?.name ?? '配色'

  useEffect(() => {
    if (!panel) return
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setPanel(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPanel(null)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [panel])

  return (
    <div className="theme-select theme-select--pair" ref={wrapRef}>
      <button
        type="button"
        className="theme-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={panel === 'style'}
        onClick={() => setPanel((p) => (p === 'style' ? null : 'style'))}
      >
        <span className="theme-select-label">{styleLabel}</span>
        <IconChevronDown className={panel === 'style' ? 'is-open' : undefined} />
      </button>
      <button
        type="button"
        className="theme-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={panel === 'color'}
        onClick={() => setPanel((p) => (p === 'color' ? null : 'color'))}
      >
        <span
          className="theme-select-swatch"
          style={{
            background: COLOR_THEME_LIST.find((c) => c.id === colorTheme)?.primaryColor,
          }}
        />
        <span className="theme-select-label">{colorLabel}</span>
        <IconChevronDown className={panel === 'color' ? 'is-open' : undefined} />
      </button>

      {panel === 'style' && (
        <ul className="theme-select-menu" role="listbox" aria-label="排版版式">
          {TEMPLATE_STYLE_LIST.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                role="option"
                aria-selected={item.id === templateStyle}
                className={`theme-select-option ${item.id === templateStyle ? 'is-selected' : ''}`}
                onClick={() => {
                  onTemplateStyleChange(item.id)
                  setPanel(null)
                }}
              >
                <span>
                  <span className="theme-select-option-name">{item.name}</span>
                  <span className="theme-select-option-desc">{item.desc}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {panel === 'color' && (
        <ul className="theme-select-menu theme-select-menu--color" role="listbox" aria-label="配色方案">
          {COLOR_THEME_LIST.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                role="option"
                aria-selected={item.id === colorTheme}
                className={`theme-select-option ${item.id === colorTheme ? 'is-selected' : ''}`}
                onClick={() => {
                  onColorThemeChange(item.id)
                  setPanel(null)
                }}
              >
                <span
                  className="theme-select-swatch theme-select-swatch--lg"
                  style={{ background: item.primaryColor }}
                />
                <span>
                  <span className="theme-select-option-name">{item.name}</span>
                  <span className="theme-select-option-desc">{item.primaryColor}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
