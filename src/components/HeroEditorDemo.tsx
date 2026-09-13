import { useMemo, useRef, useState } from 'react'
import { EditorPanel } from './EditorPanel'
import { PreviewPanel } from './PreviewPanel'
import { countStats } from '../lib/editor'
import { markdownToWechatHtml } from '../lib/wechatMarkdown'
import type { ColorThemeId, TemplateStyleId } from '../types'
import { DEFAULT_COLOR_THEME, DEFAULT_TEMPLATE_STYLE } from '../constants/themes'

const SAMPLE = `# 本周推文提纲

用 **加粗** 强调重点，用引用留下停顿。

- 读者最关心的三个问题
- 可直接执行的行动清单

> 写完后一键复制，粘贴回公众号后台。

\`\`\`js
console.log('ready')
\`\`\`

| 步骤 | 动作 |
| --- | --- |
| 1 | 写 Markdown |
| 2 | 预览 |`

/** 首页 Hero：直接复用真实编辑器面板（不含顶栏） */
export function HeroEditorDemo() {
  const [value, setValue] = useState(SAMPLE)
  const [templateStyle, setTemplateStyle] = useState<TemplateStyleId>(DEFAULT_TEMPLATE_STYLE)
  const [colorTheme, setColorTheme] = useState<ColorThemeId>(DEFAULT_COLOR_THEME)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const previewRef = useRef<HTMLElement | null>(null)

  const html = useMemo(
    () => markdownToWechatHtml(value, templateStyle, colorTheme),
    [value, templateStyle, colorTheme],
  )
  const stats = useMemo(() => countStats(value), [value])

  return (
    <div className="hero-demo workspace" aria-label="编辑器示意">
      <EditorPanel
        active
        value={value}
        onChange={setValue}
        textareaRef={textareaRef}
      />
      <PreviewPanel
        active
        html={html}
        templateStyle={templateStyle}
        colorTheme={colorTheme}
        onTemplateStyleChange={setTemplateStyle}
        onColorThemeChange={setColorTheme}
        chars={stats.chars}
        minutes={stats.minutes}
        saveState="saved"
        previewRef={previewRef}
      />
    </div>
  )
}
