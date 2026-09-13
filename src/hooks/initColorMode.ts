import { useEffect } from 'react'
import type { ColorMode } from '../hooks/useColorMode'

/** 在 React 挂载前同步主题，避免闪白 */
export function initColorMode(): ColorMode {
  try {
    const raw = localStorage.getItem('weijian.colorMode')
    if (raw === 'dark' || raw === 'light') {
      document.documentElement.dataset.theme = raw
      document.documentElement.style.colorScheme = raw
      return raw
    }
  } catch {
    // ignore
  }

  const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)').matches
  const mode: ColorMode = prefersLight ? 'light' : 'dark'
  document.documentElement.dataset.theme = mode
  document.documentElement.style.colorScheme = mode
  return mode
}

export function useInitColorMode() {
  useEffect(() => {
    initColorMode()
  }, [])
}
