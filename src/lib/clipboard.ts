const STYLE_PROPS = [
  'color',
  'background-color',
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'line-height',
  'letter-spacing',
  'margin-top',
  'margin-bottom',
  'margin-left',
  'margin-right',
  'padding-top',
  'padding-bottom',
  'padding-left',
  'padding-right',
  // 简写 border/margin 在 getComputedStyle 上经常为空，必须用 longhand
  'border-top-width',
  'border-top-style',
  'border-top-color',
  'border-right-width',
  'border-right-style',
  'border-right-color',
  'border-bottom-width',
  'border-bottom-style',
  'border-bottom-color',
  'border-left-width',
  'border-left-style',
  'border-left-color',
  'border-radius',
  'text-align',
  'text-decoration',
  'display',
  'width',
  'max-width',
  'overflow-x',
  'word-break',
  'list-style-type',
  'border-collapse',
  'border-spacing',
  'vertical-align',
  'white-space',
] as const

const INLINE_ONLY_PROPS = new Set([
  'width',
  'max-width',
  'display',
  'overflow-x',
  'text-align',
  'word-break',
])

const INLINE_TAGS = new Set(['STRONG', 'EM', 'A', 'CODE', 'DEL', 'SPAN', 'B', 'I', 'S'])

const SKIP_VALUES = new Set([
  'none',
  'normal',
  'auto',
  '0px',
  '0',
  'inline',
  'currentcolor',
  'initial',
  'unset',
  'medium',
  '',
])

function sanitizeCssValue(value: string): string {
  return value.replace(/"/g, "'")
}

function buildInlineStyle(el: Element): string {
  const cs = window.getComputedStyle(el)
  const tag = el.tagName.toUpperCase()
  const isInline = INLINE_TAGS.has(tag)
  const parts: string[] = []

  for (const prop of STYLE_PROPS) {
    if (isInline && INLINE_ONLY_PROPS.has(prop)) continue

    const value = cs.getPropertyValue(prop)
    if (!value || SKIP_VALUES.has(value.trim().toLowerCase())) continue

    // 避免把默认无边框也写成 border-xxx: medium none
    if (prop.endsWith('-style') && value.trim().toLowerCase() === 'none') continue

    parts.push(`${prop}:${sanitizeCssValue(value)}`)
  }

  return parts.join(';')
}

/** 将预览节点序列化为内联样式 HTML，便于粘贴进公众号 */
export function inlineHtml(rootEl: HTMLElement | null): string {
  if (!rootEl) return ''

  const clone = rootEl.cloneNode(true) as HTMLElement
  const srcWalker = document.createTreeWalker(rootEl, NodeFilter.SHOW_ELEMENT)
  const dstWalker = document.createTreeWalker(clone, NodeFilter.SHOW_ELEMENT)

  let src: Node | null = srcWalker.currentNode
  let dst: Node | null = dstWalker.currentNode

  while (src && dst) {
    const srcEl = src as Element
    const dstEl = dst as Element
    const style = buildInlineStyle(srcEl)
    if (style) {
      dstEl.setAttribute('style', style)
    }

    src = srcWalker.nextNode()
    dst = dstWalker.nextNode()
  }

  return clone.innerHTML
}

function inlineStyleOf(el: Element, props: readonly string[]): string {
  const cs = window.getComputedStyle(el)
  const parts: string[] = []
  for (const prop of props) {
    const value = cs.getPropertyValue(prop)
    if (value && !SKIP_VALUES.has(value.trim().toLowerCase())) {
      parts.push(`${prop}:${sanitizeCssValue(value)}`)
    }
  }
  return parts.join(';')
}

function mergeStyles(...styles: string[]): string {
  const map = new Map<string, string>()
  for (const block of styles.filter(Boolean)) {
    for (const decl of block.split(';')) {
      const idx = decl.indexOf(':')
      if (idx <= 0) continue
      const prop = decl.slice(0, idx).trim().toLowerCase()
      const value = sanitizeCssValue(decl.slice(idx + 1).trim())
      if (prop && value) map.set(prop, value)
    }
  }
  return Array.from(map, ([k, v]) => `${k}:${v}`).join(';')
}

/** 用 DOM 写 style，避免手拼 HTML 时属性引号被截断 */
export function wrapRichArticle(innerHtml: string, previewRoot: HTMLElement | null): string {
  const paper = previewRoot?.closest('.article-paper') as HTMLElement | null
  const body = previewRoot

  const paperStyle = paper
    ? inlineStyleOf(paper, ['background-color', 'color', 'line-height'])
    : ''
  const bodyStyle = body
    ? inlineStyleOf(body, ['font-family', 'font-size', 'line-height', 'color', 'word-break'])
    : 'font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:17px;line-height:1.8;color:#1a1a1a'

  const section = document.createElement('section')
  section.setAttribute('style', mergeStyles(paperStyle, bodyStyle))
  section.innerHTML = innerHtml
  return section.outerHTML
}

export type CopyResult = { success: boolean; message: string }

/**
 * 复制为符合微信公众号后台粘贴要求的富文本
 * 1. ClipboardItem 写入 text/html + text/plain
 * 2. 降级：不可见 contenteditable + execCommand('copy')
 * 3. 再降级：仅纯文本
 */
export async function copyWechatRichText(
  html: string,
  plainText: string,
): Promise<CopyResult> {
  try {
    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
      try {
        const item = new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([plainText], { type: 'text/plain' }),
        })
        await navigator.clipboard.write([item])
        return { success: true, message: '已复制富文本！可直接粘贴至微信公众号后台' }
      } catch {
        // 降级为选区复制
      }
    }

    const container = document.createElement('div')
    container.innerHTML = html
    container.style.position = 'fixed'
    container.style.left = '-9999px'
    container.style.top = '0'
    container.style.opacity = '0'
    container.setAttribute('contenteditable', 'true')
    document.body.appendChild(container)

    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(container)
    selection?.removeAllRanges()
    selection?.addRange(range)

    const successful = document.execCommand('copy')
    selection?.removeAllRanges()
    document.body.removeChild(container)

    if (successful) {
      return { success: true, message: '已复制富文本！可直接粘贴至微信公众号后台' }
    }

    const textOk = await copyPlainText(plainText)
    if (textOk) {
      return { success: true, message: '已复制纯文本（样式可能丢失）' }
    }

    return { success: false, message: '复制失败：请手动全选预览区复制' }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : '未知错误'
    return { success: false, message: `复制失败: ${errorMsg}` }
  }
}

/** @deprecated 使用 copyWechatRichText */
export async function copyRichText(html: string, plain: string): Promise<boolean> {
  const result = await copyWechatRichText(html, plain)
  return result.success
}

export async function copyPlainText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // fall through
  }

  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.cssText = 'position:fixed;left:-9999px;top:0;'
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}
