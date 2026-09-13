import type { ReactNode } from 'react'
import { GridBackdrop } from './motion/GridBackdrop'
import { ThemeToggle } from './ThemeToggle'
import { IconBook, IconFolder, IconHome } from './Icons'
import type { ColorMode } from '../hooks/useColorMode'
import type { Route } from '../hooks/useRouter'

interface SiteShellProps {
  route: Route
  onNavigate: (route: Route) => void
  colorMode: ColorMode
  onToggleColorMode: () => void
  children: ReactNode
}

const NAV_ITEMS: { key: Route; label: string; icon: typeof IconHome }[] = [
  { key: 'home', label: '首页', icon: IconHome },
  { key: 'articles', label: '我的文章', icon: IconFolder },
  { key: 'docs', label: '文档', icon: IconBook },
]

export function SiteShell({
  route,
  onNavigate,
  colorMode,
  onToggleColorMode,
  children,
}: SiteShellProps) {
  return (
    <div className="site-shell">
      <GridBackdrop variant={colorMode === 'dark' ? 'dark' : 'light'} />

      <header className="landing-nav site-nav">
        <button
          type="button"
          className="landing-brand landing-brand--text"
          onClick={() => onNavigate('home')}
          aria-label="微笺首页"
        >
          <span className="landing-brand-title">微笺</span>
          <span className="landing-brand-sub">Weijian</span>
        </button>

        <nav className="landing-nav-links" aria-label="站点导航">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = route === item.key
            return (
              <button
                key={item.key}
                type="button"
                className={`landing-nav-cta ${active ? 'is-active' : ''}`}
                aria-current={active ? 'page' : undefined}
                onClick={() => onNavigate(item.key)}
              >
                <Icon />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="landing-nav-spacer" />
        <div className="landing-nav-actions">
          <ThemeToggle mode={colorMode} onToggle={onToggleColorMode} />
        </div>
      </header>

      <div key={route} className="route-stage site-content">
        {children}
      </div>
    </div>
  )
}
