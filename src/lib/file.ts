/** 读取本地 .md / .markdown / .txt 文件为文本 */
export function readMarkdownFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }
      reject(new Error('无法读取文件内容'))
    }
    reader.onerror = () => reject(reader.error ?? new Error('文件读取失败'))
    reader.readAsText(file, 'utf-8')
  })
}

export function downloadTextFile(filename: string, content: string, mime = 'text/markdown;charset=utf-8'): void {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

export function safeFilename(name: string): string {
  const trimmed = (name || '公众号草稿').trim().replace(/[\\/:*?"<>|]/g, '_')
  return trimmed.endsWith('.md') ? trimmed : `${trimmed}.md`
}

export function isMarkdownFile(file: File): boolean {
  const lower = file.name.toLowerCase()
  return (
    lower.endsWith('.md') ||
    lower.endsWith('.markdown') ||
    lower.endsWith('.txt') ||
    file.type === 'text/markdown' ||
    file.type === 'text/plain' ||
    file.type === ''
  )
}

export function extractTitleFromMarkdown(md: string): string {
  const match = md.match(/^#\s+(.+)$/m)
  return match?.[1]?.trim() || '未命名草稿'
}
