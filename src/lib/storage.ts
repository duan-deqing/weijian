import type {
  ArticleCardMeta,
  ColorThemeId,
  DraftMeta,
  DraftRecord,
  TemplateStyleId,
} from '../types'
import { DEFAULT_MD } from '../constants/content'
import {
  COLOR_THEME_IDS,
  DEFAULT_COLOR_THEME,
  DEFAULT_TEMPLATE_STYLE,
  TEMPLATE_STYLE_IDS,
} from '../constants/themes'
import { countStats } from './editor'

function isTemplateStyleId(value: unknown): value is TemplateStyleId {
  return typeof value === 'string' && (TEMPLATE_STYLE_IDS as string[]).includes(value)
}

function isColorThemeId(value: unknown): value is ColorThemeId {
  return typeof value === 'string' && (COLOR_THEME_IDS as string[]).includes(value)
}

const ACTIVE_KEY = 'weijian.active'
const DRAFTS_KEY = 'weijian.drafts'
const STYLE_KEY = 'weijian.templateStyle'
const COLOR_KEY = 'weijian.colorTheme'
const LEGACY_THEME_KEY = 'weijian.theme'
const LEGACY_DRAFT_KEY = 'weijian.draft'

const MAX_DRAFTS = 30

/** 旧 theme 字段迁移到 版式 + 配色 */
function migrateLegacyTheme(raw: string | null | undefined): {
  templateStyle: TemplateStyleId
  colorTheme: ColorThemeId
} {
  if (raw === 'ink') return { templateStyle: 'classic', colorTheme: 'minimal-dark' }
  if (raw === 'mag') return { templateStyle: 'literary', colorTheme: 'warm-amber' }
  if (raw === 'clay') return { templateStyle: 'literary', colorTheme: 'warm-amber' }
  if (raw === 'mist') return { templateStyle: 'modern-card', colorTheme: 'modern-blue' }
  if (raw === 'minimal') return { templateStyle: 'literary', colorTheme: 'modern-blue' }
  if (raw === 'journal') return { templateStyle: 'tech', colorTheme: 'minimal-dark' }
  if (raw === 'classic') return { templateStyle: 'classic', colorTheme: 'modern-blue' }
  return { templateStyle: DEFAULT_TEMPLATE_STYLE, colorTheme: DEFAULT_COLOR_THEME }
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function loadTemplateStyle(): TemplateStyleId {
  try {
    const v = localStorage.getItem(STYLE_KEY)
    if (isTemplateStyleId(v)) return v
  } catch {
    // ignore
  }
  try {
    const legacy = localStorage.getItem(LEGACY_THEME_KEY)
    return migrateLegacyTheme(legacy).templateStyle
  } catch {
    return DEFAULT_TEMPLATE_STYLE
  }
}

export function loadColorTheme(): ColorThemeId {
  try {
    const v = localStorage.getItem(COLOR_KEY)
    if (isColorThemeId(v)) return v
  } catch {
    // ignore
  }
  try {
    const legacy = localStorage.getItem(LEGACY_THEME_KEY)
    return migrateLegacyTheme(legacy).colorTheme
  } catch {
    return DEFAULT_COLOR_THEME
  }
}

export function saveTemplateStyle(style: TemplateStyleId): boolean {
  try {
    localStorage.setItem(STYLE_KEY, style)
    return true
  } catch {
    return false
  }
}

export function saveColorTheme(color: ColorThemeId): boolean {
  try {
    localStorage.setItem(COLOR_KEY, color)
    return true
  } catch {
    return false
  }
}

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `d_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

function normalizeRecord(
  raw: Partial<DraftRecord> & { id: string; name: string; content: string; theme?: string },
): DraftRecord {
  const now = raw.updatedAt ?? raw.createdAt ?? Date.now()
  const legacy = migrateLegacyTheme(raw.theme)
  return {
    id: raw.id,
    name: raw.name,
    content: raw.content,
    templateStyle: isTemplateStyleId(raw.templateStyle)
      ? raw.templateStyle
      : legacy.templateStyle,
    colorTheme: isColorThemeId(raw.colorTheme) ? raw.colorTheme : legacy.colorTheme,
    createdAt: raw.createdAt ?? now,
    updatedAt: now,
  }
}

function readDraftRecords(): DraftRecord[] {
  const drafts = readJson<Array<Partial<DraftRecord> & { id: string; name: string; content: string }>>(DRAFTS_KEY, [])
  return drafts.map(normalizeRecord)
}

function ensureMigrated(): void {
  try {
    const hasDrafts = localStorage.getItem(DRAFTS_KEY)
    if (hasDrafts) {
      // 补全 createdAt 字段
      const drafts = readDraftRecords()
      writeJson(DRAFTS_KEY, drafts)
      return
    }

    const legacy = localStorage.getItem(LEGACY_DRAFT_KEY)
    const content = typeof legacy === 'string' && legacy.length ? legacy : DEFAULT_MD
    const now = Date.now()
    const record: DraftRecord = {
      id: createId(),
      name: '默认草稿',
      content,
      templateStyle: loadTemplateStyle(),
      colorTheme: loadColorTheme(),
      createdAt: now,
      updatedAt: now,
    }
    localStorage.setItem(DRAFTS_KEY, JSON.stringify([record]))
    localStorage.setItem(ACTIVE_KEY, record.id)
  } catch {
    // ignore
  }
}

export function listDrafts(): DraftMeta[] {
  ensureMigrated()
  return readDraftRecords()
    .slice()
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map((d) => ({
      id: d.id,
      name: d.name,
      updatedAt: d.updatedAt,
      preview: d.content.replace(/\s+/g, ' ').trim().slice(0, 48) || '（空白草稿）',
    }))
}

export function listArticles(): ArticleCardMeta[] {
  ensureMigrated()
  let activeId = ''
  try {
    activeId = localStorage.getItem(ACTIVE_KEY) || ''
  } catch {
    // ignore
  }

  return readDraftRecords()
    .slice()
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map((d) => {
      const stats = countStats(d.content)
      return {
        id: d.id,
        name: d.name,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
        preview: d.content.replace(/\s+/g, ' ').trim().slice(0, 64) || '（空白草稿）',
        chars: stats.chars,
        minutes: stats.minutes,
        isActive: d.id === activeId,
      }
    })
}

export function getDraftById(id: string): DraftRecord | null {
  ensureMigrated()
  return readDraftRecords().find((d) => d.id === id) ?? null
}

export function getActiveDraft(): DraftRecord {
  ensureMigrated()
  const drafts = readDraftRecords()
  if (!drafts.length) {
    const now = Date.now()
    const fallback: DraftRecord = {
      id: createId(),
      name: '默认草稿',
      content: DEFAULT_MD,
      templateStyle: loadTemplateStyle(),
      colorTheme: loadColorTheme(),
      createdAt: now,
      updatedAt: now,
    }
    writeJson(DRAFTS_KEY, [fallback])
    try {
      localStorage.setItem(ACTIVE_KEY, fallback.id)
    } catch {
      // ignore
    }
    return fallback
  }

  let activeId = ''
  try {
    activeId = localStorage.getItem(ACTIVE_KEY) || ''
  } catch {
    // ignore
  }

  return drafts.find((d) => d.id === activeId) ?? drafts[0]
}

export function saveActiveDraft(
  content: string,
  name?: string,
  style?: TemplateStyleId,
  color?: ColorThemeId,
): DraftRecord {
  ensureMigrated()
  const drafts = readDraftRecords()
  const active = getActiveDraft()
  const next: DraftRecord = {
    ...active,
    content,
    name: name ?? active.name,
    templateStyle: style ?? active.templateStyle,
    colorTheme: color ?? active.colorTheme,
    updatedAt: Date.now(),
  }

  const index = drafts.findIndex((d) => d.id === next.id)
  if (index >= 0) {
    drafts[index] = next
  } else {
    drafts.unshift(next)
  }

  writeJson(DRAFTS_KEY, drafts.slice(0, MAX_DRAFTS))
  try {
    localStorage.setItem(ACTIVE_KEY, next.id)
  } catch {
    // ignore
  }
  return next
}

export function renameActiveDraft(name: string): DraftRecord {
  const active = getActiveDraft()
  return saveActiveDraft(active.content, name)
}

export function renameDraft(id: string, name: string): DraftRecord | null {
  ensureMigrated()
  const drafts = readDraftRecords()
  const index = drafts.findIndex((d) => d.id === id)
  if (index < 0) return null
  const next = { ...drafts[index], name, updatedAt: Date.now() }
  drafts[index] = next
  writeJson(DRAFTS_KEY, drafts)
  return next
}

export function createDraft(content: string, name: string): DraftRecord {
  ensureMigrated()
  const drafts = readDraftRecords()
  const now = Date.now()
  const record: DraftRecord = {
    id: createId(),
    name,
    content,
    templateStyle: loadTemplateStyle(),
    colorTheme: loadColorTheme(),
    createdAt: now,
    updatedAt: now,
  }
  const next = [record, ...drafts].slice(0, MAX_DRAFTS)
  writeJson(DRAFTS_KEY, next)
  try {
    localStorage.setItem(ACTIVE_KEY, record.id)
  } catch {
    // ignore
  }
  return record
}

export function switchDraft(id: string): DraftRecord | null {
  const drafts = readDraftRecords()
  const found = drafts.find((d) => d.id === id)
  if (!found) return null
  try {
    localStorage.setItem(ACTIVE_KEY, id)
  } catch {
    // ignore
  }
  return found
}

export function deleteDraft(id: string): boolean {
  const drafts = readDraftRecords()
  const next = drafts.filter((d) => d.id !== id)
  if (next.length === drafts.length) return false

  writeJson(DRAFTS_KEY, next.length ? next : [])
  try {
    const activeId = localStorage.getItem(ACTIVE_KEY)
    if (activeId === id) {
      if (next[0]) localStorage.setItem(ACTIVE_KEY, next[0].id)
      else localStorage.removeItem(ACTIVE_KEY)
    }
  } catch {
    // ignore
  }
  return true
}

export function formatDate(ts: number): string {
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(ts))
  } catch {
    return new Date(ts).toLocaleString()
  }
}
