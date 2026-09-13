import hljs from 'highlight.js/lib/common'

/** 语法高亮 → 内联 style（公众号会剥离 class） */
const TOKEN_STYLES: Record<string, string> = {
  'hljs-comment': 'color:#8B949E;font-style:italic',
  'hljs-quote': 'color:#8B949E;font-style:italic',
  'hljs-keyword': 'color:#CF222E',
  'hljs-selector-tag': 'color:#CF222E',
  'hljs-literal': 'color:#0550AE',
  'hljs-type': 'color:#953800',
  'hljs-number': 'color:#0550AE',
  'hljs-string': 'color:#0A3069',
  'hljs-regexp': 'color:#0A3069',
  'hljs-meta': 'color:#8250DF',
  'hljs-title': 'color:#8250DF',
  'hljs-title.function_': 'color:#8250DF',
  'hljs-title.class_': 'color:#953800',
  'hljs-attr': 'color:#0550AE',
  'hljs-attribute': 'color:#0550AE',
  'hljs-property': 'color:#0550AE',
  'hljs-variable': 'color:#953800',
  'hljs-variable.language_': 'color:#CF222E',
  'hljs-variable.constant_': 'color:#0550AE',
  'hljs-built_in': 'color:#0550AE',
  'hljs-function': 'color:#8250DF',
  'hljs-params': 'color:#24292F',
  'hljs-symbol': 'color:#0550AE',
  'hljs-bullet': 'color:#0550AE',
  'hljs-subst': 'color:#24292F',
  'hljs-section': 'color:#0550AE;font-weight:bold',
  'hljs-selector-id': 'color:#8250DF',
  'hljs-selector-class': 'color:#953800',
  'hljs-selector-pseudo': 'color:#8250DF',
  'hljs-tag': 'color:#116329',
  'hljs-name': 'color:#116329',
  'hljs-attribute.': 'color:#0550AE',
  'hljs-addition': 'color:#116329;background:#dafbe1',
  'hljs-deletion': 'color:#CF222E;background:#ffebe9',
  'hljs-link': 'color:#0A3069;text-decoration:underline',
}

function inlineHljsClasses(html: string): string {
  return html.replace(/class="([^"]+)"/g, (_match, classAttr: string) => {
    const styles: string[] = []
    for (const cls of classAttr.split(/\s+/)) {
      const style = TOKEN_STYLES[cls]
      if (style) styles.push(style)
      // hljs 变体 title.function_ 等
      const fallback = TOKEN_STYLES[cls.replace(/_/g, '_')]
      if (!style && fallback) styles.push(fallback)
    }
    if (!styles.length) return ''
    return `style="${styles.join(';')}"`
  })
}

export function highlightToInlineHtml(code: string, lang?: string): string {
  const language = (lang || '').trim().split(/\s+/)[0]?.toLowerCase()
  try {
    if (language && hljs.getLanguage(language)) {
      const result = hljs.highlight(code, { language, ignoreIllegals: true })
      return inlineHljsClasses(result.value)
    }
    const auto = hljs.highlightAuto(code)
    return inlineHljsClasses(auto.value)
  } catch {
    return escapeHtmlBasic(code)
  }
}

function escapeHtmlBasic(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function normalizeCodeLang(lang?: string): string {
  const raw = (lang || '').trim().split(/\s+/)[0]?.toLowerCase() || ''
  if (!raw) return ''
  const map: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    sh: 'bash',
    shell: 'bash',
    yml: 'yaml',
    md: 'markdown',
    html: 'xml',
    vue: 'xml',
  }
  return map[raw] || raw
}
