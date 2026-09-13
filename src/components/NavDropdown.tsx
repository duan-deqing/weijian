import { useEffect, useRef, useState, type ReactNode } from 'react'

interface NavDropdownProps {
  label: string
  icon?: ReactNode
  children: (close: () => void) => ReactNode
  className?: string
}

export function NavDropdown({ label, icon, children, className = '' }: NavDropdownProps) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className={`nav-dropdown ${className}`.trim()} ref={wrapRef}>
      <button
        type="button"
        className={`btn-ghost nav-dropdown-trigger ${open ? 'is-open' : ''}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {icon}
        <span>{label}</span>
      </button>
      {open && (
        <div className="nav-dropdown-menu" role="menu">
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}

export function NavMenuItem({
  children,
  onClick,
  danger = false,
}: {
  children: ReactNode
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      role="menuitem"
      className={`nav-menu-item ${danger ? 'is-danger' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
