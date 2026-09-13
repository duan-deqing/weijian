import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ColorThemeId, SaveState, TemplateStyleId } from '../types'
import { DEFAULT_MD } from '../constants/content'
import {
  createDraft,
  deleteDraft,
  getActiveDraft,
  listDrafts,
  loadColorTheme,
  loadTemplateStyle,
  renameActiveDraft,
  saveActiveDraft,
  saveColorTheme,
  saveTemplateStyle,
  switchDraft,
} from '../lib/storage'

export function useDraft() {
  const initial = useMemo(() => getActiveDraft(), [])
  const [content, setContent] = useState(initial.content)
  const [draftName, setDraftName] = useState(initial.name)
  const [draftId, setDraftId] = useState(initial.id)
  const [templateStyle, setTemplateStyleState] = useState<TemplateStyleId>(
    initial.templateStyle || loadTemplateStyle(),
  )
  const [colorTheme, setColorThemeState] = useState<ColorThemeId>(
    initial.colorTheme || loadColorTheme(),
  )
  const [saveState, setSaveState] = useState<SaveState>('saved')
  const [draftsVersion, setDraftsVersion] = useState(0)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    setSaveState('saving')
    if (timerRef.current) window.clearTimeout(timerRef.current)

    timerRef.current = window.setTimeout(() => {
      try {
        saveActiveDraft(content, draftName, templateStyle, colorTheme)
        setSaveState('saved')
      } catch {
        setSaveState('error')
      }
    }, 400)

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [content, draftName, templateStyle, colorTheme])

  const setTemplateStyle = useCallback((next: TemplateStyleId) => {
    setTemplateStyleState(next)
    saveTemplateStyle(next)
    saveActiveDraft(content, draftName, next, colorTheme)
  }, [content, draftName, colorTheme])

  const setColorTheme = useCallback((next: ColorThemeId) => {
    setColorThemeState(next)
    saveColorTheme(next)
    saveActiveDraft(content, draftName, templateStyle, next)
  }, [content, draftName, templateStyle])

  const persistNow = useCallback(() => {
    try {
      saveActiveDraft(content, draftName, templateStyle, colorTheme)
      setSaveState('saved')
      return true
    } catch {
      setSaveState('error')
      return false
    }
  }, [content, draftName, templateStyle, colorTheme])

  const drafts = useCallback(() => listDrafts(), [draftsVersion])

  const loadFromImport = useCallback((text: string, name?: string) => {
    const record = createDraft(text, name || '导入的草稿')
    setContent(record.content)
    setDraftName(record.name)
    setDraftId(record.id)
    setTemplateStyleState(record.templateStyle)
    setColorThemeState(record.colorTheme)
    setSaveState('saved')
    setDraftsVersion((v) => v + 1)
    return record
  }, [])

  const rename = useCallback((name: string) => {
    const trimmed = name.trim() || '未命名草稿'
    setDraftName(trimmed)
    renameActiveDraft(trimmed)
    setDraftsVersion((v) => v + 1)
  }, [])

  const selectDraft = useCallback((id: string) => {
    const record = switchDraft(id)
    if (!record) return false
    setDraftId(record.id)
    setContent(record.content)
    setDraftName(record.name)
    setTemplateStyleState(record.templateStyle)
    setColorThemeState(record.colorTheme)
    setSaveState('saved')
    setDraftsVersion((v) => v + 1)
    return true
  }, [])

  const removeDraft = useCallback((id: string) => {
    const ok = deleteDraft(id)
    if (!ok) return false

    const next = getActiveDraft()
    setDraftId(next.id)
    setContent(next.content)
    setDraftName(next.name)
    setTemplateStyleState(next.templateStyle)
    setColorThemeState(next.colorTheme)
    setDraftsVersion((v) => v + 1)
    return true
  }, [])

  const clearContent = useCallback(() => {
    setContent('')
  }, [])

  const resetSample = useCallback(() => {
    setContent(DEFAULT_MD)
  }, [])

  return {
    content,
    setContent,
    draftName,
    draftId,
    templateStyle,
    setTemplateStyle,
    colorTheme,
    setColorTheme,
    saveState,
    persistNow,
    drafts,
    loadFromImport,
    rename,
    selectDraft,
    removeDraft,
    clearContent,
    resetSample,
  }
}
