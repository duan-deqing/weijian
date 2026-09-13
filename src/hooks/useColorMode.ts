import { useCallback, useEffect, useState } from 'react'

export type ColorMode = 'dark' | 'light'

const STORAGE_KEY = 'weijian.colorMode'

function readStored(): ColorMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === 'dark' || raw === 'light') return raw
  } catch {
    // ignore
  }

  if (window.matchMedia?.('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return 'dark'
}

function apply(mode: ColorMode) {
  document.documentElement.dataset.theme = mode
  document.documentElement.style.colorScheme = mode
}

export function useColorMode() {
  const [mode, setMode] = useState<ColorMode>(() => readStored())

  useEffect(() => {
    apply(mode)
    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      // ignore
    }
  }, [mode])

  const toggle = useCallback(() => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  return { mode, setMode, toggle }
}
