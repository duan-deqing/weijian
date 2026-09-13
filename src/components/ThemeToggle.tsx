import type { ColorMode } from '../hooks/useColorMode'

interface ThemeToggleProps {
  mode: ColorMode
  onToggle: () => void
  className?: string
}

export function ThemeToggle({ mode, onToggle, className = '' }: ThemeToggleProps) {
  const next = mode === 'dark' ? '浅色' : '深色'
  const icon = mode === 'dark' ? '☾' : '☀'

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`.trim()}
      onClick={onToggle}
      aria-label={`切换到${next}模式，当前为${mode === 'dark' ? '深色' : '浅色'}`}
      title={`切换到${next}模式`}
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  )
}
