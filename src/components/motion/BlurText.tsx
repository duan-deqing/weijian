import { useMemo } from 'react'

interface BlurTextProps {
  text: string
  className?: string
  /** 每个字符入场间隔 ms */
  stepMs?: number
  /** 整体延迟 ms */
  delayMs?: number
}

/** reactbits BlurText 气质：逐字模糊淡入 */
export function BlurText({ text, className = '', stepMs = 28, delayMs = 0 }: BlurTextProps) {
  const chars = useMemo(() => Array.from(text), [text])

  return (
    <span className={`blur-text ${className}`} aria-label={text}>
      {chars.map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          className="blur-text-char"
          aria-hidden="true"
          style={{
            animationDelay: `${delayMs + i * stepMs}ms`,
            whiteSpace: ch === ' ' ? 'pre' : undefined,
          }}
        >
          {ch}
        </span>
      ))}
    </span>
  )
}
