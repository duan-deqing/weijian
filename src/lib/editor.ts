import type { TextStats, ToolSpec } from '../types'

export const TOOLS: ToolSpec[] = [
  { id: 'bold', label: '加粗', wrap: ['**', '**'] },
  { id: 'italic', label: '斜体', wrap: ['*', '*'] },
  { id: 'strike', label: '删除', wrap: ['~~', '~~'] },
  { id: 'h1', label: 'H1', line: '# ' },
  { id: 'h2', label: 'H2', line: '## ' },
  { id: 'h3', label: 'H3', line: '### ' },
  { id: 'quote', label: '引用', line: '> ' },
  { id: 'ul', label: '列表', line: '- ' },
  { id: 'ol', label: '有序', line: '1. ' },
  { id: 'code', label: '代码', block: '```\n\n```' },
  { id: 'link', label: '链接', wrap: ['[', '](https://)'] },
  { id: 'image', label: '图片', block: '![描述](https://example.com/image.jpg)' },
  { id: 'table', label: '表格', block: '| 列1 | 列2 |\n| --- | --- |\n|  |  |' },
  { id: 'hr', label: '分割', line: '\n---\n' },
]

export function countStats(text: string): TextStats {
  const chars = (text || '').replace(/\s/g, '').length
  const minutes = Math.max(1, Math.round(chars / 400))
  return { chars, minutes }
}

export function insertMarkdown(textarea: HTMLTextAreaElement | null, tool: ToolSpec): void {
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const value = textarea.value
  const selected = value.slice(start, end) || (tool.wrap ? '文本' : '')

  let next = value
  let cursorStart = start
  let cursorEnd = end

  if (tool.wrap) {
    const [open, close] = tool.wrap
    next = value.slice(0, start) + open + selected + close + value.slice(end)
    cursorStart = start + open.length
    cursorEnd = cursorStart + selected.length
  } else if (tool.line) {
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    next = value.slice(0, lineStart) + tool.line + value.slice(lineStart)
    cursorStart = start + tool.line.length
    cursorEnd = end + tool.line.length
  } else if (tool.block) {
    const block = tool.block
    const needsNl = start > 0 && value[start - 1] !== '\n' ? '\n' : ''
    next = value.slice(0, start) + needsNl + block + value.slice(end)
    const pos = start + needsNl.length + block.length
    cursorStart = pos
    cursorEnd = pos
  }

  const setter = Object.getOwnPropertyDescriptor(
    HTMLTextAreaElement.prototype,
    'value',
  )?.set
  if (setter) {
    setter.call(textarea, next)
  } else {
    textarea.value = next
  }

  textarea.dispatchEvent(new Event('input', { bubbles: true }))
  textarea.focus()
  textarea.setSelectionRange(cursorStart, cursorEnd)
}
