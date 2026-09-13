import { marked } from 'marked'

// breaks:false：单换行不转成 <br>，避免加粗/强调后出现多余换行
marked.setOptions({ gfm: true, breaks: false })

export function renderMarkdown(md: string): string {
  try {
    return marked.parse(md || '') as string
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return `<p>解析出错：${message}</p>`
  }
}
