import type { ColorTheme, ColorThemeId, TemplateStyle, TemplateStyleId } from '../types'

export const TEMPLATE_STYLES: Record<TemplateStyleId, TemplateStyle> = {
  classic: {
    id: 'classic',
    name: '经典公众号',
    desc: '居中下划线主标题 + 左竖条分段 + 纯色浅底引用',
    tag: '标准推荐',
  },
  'modern-card': {
    id: 'modern-card',
    name: '现代卡片风',
    desc: '胶囊微标主标题 + 渐变边框分段 + 气泡卡片引用',
    tag: '新潮活力',
  },
  literary: {
    id: 'literary',
    name: '文艺雅致风',
    desc: '端庄对称菱形符号 + 细线留白 + 雅意排版',
    tag: '阅读美感',
  },
  tech: {
    id: 'tech',
    name: '商务科技风',
    desc: '代码方块序号 + 工业硬朗分块 + 终端代码高亮',
    tag: '专业严谨',
  },
}

export const TEMPLATE_STYLE_LIST: TemplateStyle[] = Object.values(TEMPLATE_STYLES)

export const COLOR_THEMES: Record<ColorThemeId, ColorTheme> = {
  'wechat-green': {
    id: 'wechat-green',
    name: '经典绿',
    primaryColor: '#07C160',
    secondaryColor: '#EDF8F1',
    quoteBgColor: '#F5FAF6',
    quoteBorderColor: '#07C160',
    codeBgColor: '#F7FBF8',
    textColor: '#2B2B2B',
  },
  'modern-blue': {
    id: 'modern-blue',
    name: '知性蓝',
    primaryColor: '#1062FE',
    secondaryColor: '#EEF4FF',
    quoteBgColor: '#F4F8FF',
    quoteBorderColor: '#1062FE',
    codeBgColor: '#F5F8FF',
    textColor: '#2B2B2B',
  },
  'minimal-dark': {
    id: 'minimal-dark',
    name: '冷灰黑',
    primaryColor: '#111827',
    secondaryColor: '#F3F4F6',
    quoteBgColor: '#F9FAFB',
    quoteBorderColor: '#374151',
    codeBgColor: '#F3F4F6',
    textColor: '#1F2937',
  },
  'warm-amber': {
    id: 'warm-amber',
    name: '暖琥珀',
    primaryColor: '#D97706',
    secondaryColor: '#FEF3C7',
    quoteBgColor: '#FFFBEB',
    quoteBorderColor: '#D97706',
    codeBgColor: '#FFFDF5',
    textColor: '#292524',
  },
  'rose-pink': {
    id: 'rose-pink',
    name: '蔷薇红',
    primaryColor: '#E11D48',
    secondaryColor: '#FFE4E6',
    quoteBgColor: '#FFF1F2',
    quoteBorderColor: '#E11D48',
    codeBgColor: '#FFF5F5',
    textColor: '#262626',
  },
  'violet-purple': {
    id: 'violet-purple',
    name: '优雅紫',
    primaryColor: '#7C3AED',
    secondaryColor: '#EDE9FE',
    quoteBgColor: '#F5F3FF',
    quoteBorderColor: '#7C3AED',
    codeBgColor: '#FAF8FF',
    textColor: '#2E1065',
  },
}

export const COLOR_THEME_LIST: ColorTheme[] = Object.values(COLOR_THEMES)

export const TEMPLATE_STYLE_IDS = TEMPLATE_STYLE_LIST.map((t) => t.id)
export const COLOR_THEME_IDS = COLOR_THEME_LIST.map((c) => c.id)

export const DEFAULT_TEMPLATE_STYLE: TemplateStyleId = 'classic'
export const DEFAULT_COLOR_THEME: ColorThemeId = 'modern-blue'
