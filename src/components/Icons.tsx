import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function base(props: IconProps) {
  return {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
    focusable: false,
    ...props,
  }
}

export function IconBook(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H18v16H7.5A2.5 2.5 0 0 0 5 21.5z" />
      <path d="M5 18.5A2.5 2.5 0 0 1 7.5 16H18" />
    </svg>
  )
}

export function IconFolder(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 7a2 2 0 0 1 2-2h3.2l1.5 2H18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    </svg>
  )
}

export function IconHome(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m4 11 8-7 8 7" />
      <path d="M7 10v9a1 1 0 0 0 1 1h4" />
      <path d="M17 10v9a1 1 0 0 1-1 1h-4" />
    </svg>
  )
}

export function IconPlus(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

export function IconPen(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z" />
      <path d="m13.5 6.5 4 4" />
    </svg>
  )
}

export function IconArrowLeft(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </svg>
  )
}

export function IconFile(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z" />
      <path d="M14 4v5h5" />
    </svg>
  )
}

export function IconFlask(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 4h6" />
      <path d="M10 4v5.5L5.8 17.2A2 2 0 0 0 7.5 20h9a2 2 0 0 0 1.7-2.8L14 9.5V4" />
      <path d="M8.5 14h7" />
    </svg>
  )
}

export function IconCopy(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

export function IconBold(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 5h6.5a4 4 0 0 1 0 8H7z" />
      <path d="M7 13h7.5a4 4 0 0 1 0 8H7z" />
    </svg>
  )
}

export function IconItalic(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M10 5h8" />
      <path d="M6 19h8" />
      <path d="M14 5 10 19" />
    </svg>
  )
}

export function IconStrike(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 12h16" />
      <path d="M8 7c1.2-2 3-3 5-3 2.8 0 4.5 1.4 4.5 3.5 0 1.6-.8 2.7-2.2 3.5" />
      <path d="M16 17c-1.1 1.8-2.9 2.8-5 2.8-2.7 0-4.5-1.4-4.5-3.5" />
    </svg>
  )
}

export function IconH1(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 6v12" />
      <path d="M13 6v12" />
      <path d="M5 12h8" />
      <path d="M17 10l3-2v10" />
    </svg>
  )
}

export function IconH2(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 6v12" />
      <path d="M12 6v12" />
      <path d="M5 12h7" />
      <path d="M16 10a2.5 2.5 0 1 1 4.2 1.8L16 18h5" />
    </svg>
  )
}

export function IconH3(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 6v12" />
      <path d="M12 6v12" />
      <path d="M5 12h7" />
      <path d="M16.5 10a2.2 2.2 0 1 1 2 3.5 2.2 2.2 0 1 1-2 3.5" />
    </svg>
  )
}

export function IconQuote(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 17c2.5 0 4-1.5 4-4V7H6v6h3" />
      <path d="M15 17c2.5 0 4-1.5 4-4V7h-5v6h3" />
    </svg>
  )
}

export function IconList(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 7h11" />
      <path d="M9 12h11" />
      <path d="M9 17h11" />
      <circle cx="5" cy="7" r="1" fill="currentColor" stroke="none" />
      <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="5" cy="17" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconListOrdered(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M10 7h10" />
      <path d="M10 12h10" />
      <path d="M10 17h10" />
      <path d="M4 6.5 5.5 5H7" />
      <path d="M4 12h3" />
      <path d="M4 15.5h2.2L4 19h3" />
    </svg>
  )
}

export function IconCode(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 8 5 12l4 4" />
      <path d="m15 8 4 4-4 4" />
    </svg>
  )
}

export function IconLink(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M10 13a5 5 0 0 0 7.1 0l1.4-1.4a5 5 0 0 0-7.1-7.1L10 5.9" />
      <path d="M14 11a5 5 0 0 0-7.1 0L5.5 12.4a5 5 0 0 0 7.1 7.1L14 18.1" />
    </svg>
  )
}

export function IconImage(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m5 17 4.5-4.5L13 16l2.5-2.5L19 17" />
    </svg>
  )
}

export function IconTable(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M4 10h16" />
      <path d="M4 15h16" />
      <path d="M10 5v14" />
    </svg>
  )
}

export function IconHr(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 12h14" />
      <path d="M7 7h10" opacity="0.35" />
      <path d="M7 17h10" opacity="0.35" />
    </svg>
  )
}

export function IconMore(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="6" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="18" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconChevronDown(props: IconProps) {
  return (
    <svg {...base(props)} width={16} height={16}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base(props)} width={16} height={16}>
      <path d="m5 12 5 5L19 7" />
    </svg>
  )
}
