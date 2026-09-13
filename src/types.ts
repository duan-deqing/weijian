export type MobileTab = 'write' | 'preview'

export type SaveState = 'idle' | 'saving' | 'saved' | 'error'

/** 版式模版：结构与装饰 */
export type TemplateStyleId = 'classic' | 'modern-card' | 'literary' | 'tech'

export interface TemplateStyle {
  id: TemplateStyleId
  name: string
  desc: string
  tag: string
}

/** 配色方案：独立于版式 */
export type ColorThemeId =
  | 'wechat-green'
  | 'modern-blue'
  | 'minimal-dark'
  | 'warm-amber'
  | 'rose-pink'
  | 'violet-purple'

export interface ColorTheme {
  id: ColorThemeId
  name: string
  primaryColor: string
  secondaryColor: string
  quoteBgColor: string
  quoteBorderColor: string
  codeBgColor: string
  textColor: string
}

export interface TextStats {
  chars: number
  minutes: number
}

export interface ToolSpec {
  id: string
  label: string
  wrap?: [string, string]
  line?: string
  block?: string
}

export interface DraftMeta {
  id: string
  name: string
  updatedAt: number
  preview: string
}

export interface DraftRecord {
  id: string
  name: string
  content: string
  templateStyle: TemplateStyleId
  colorTheme: ColorThemeId
  createdAt: number
  updatedAt: number
}

export interface ArticleCardMeta {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  preview: string
  chars: number
  minutes: number
  isActive: boolean
}
