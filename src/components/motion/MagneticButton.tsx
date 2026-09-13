import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface MagneticButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit'
  ariaLabel?: string
}

/** 轻量按钮封装（无位移动效） */
export function MagneticButton({
  children,
  onClick,
  className = '',
  type = 'button',
  ariaLabel,
  ...rest
}: MagneticButtonProps) {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      onClick={onClick}
      className={`magnetic-btn ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  )
}
