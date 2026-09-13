import { NavDropdown, NavMenuItem } from './NavDropdown'
import { ThemeToggle } from './ThemeToggle'
import type { ColorMode } from '../hooks/useColorMode'
import { IconArrowLeft, IconCopy, IconFile, IconFlask } from './Icons'

interface TopBarProps {
  onOpenArticles: () => void
  colorMode: ColorMode
  onToggleColorMode: () => void
  draftName: string
  onRename: (name: string) => void
  onCopyRich: () => void
  onImport: () => void
  onExport: () => void
  onResetSample: () => void
  onClear: () => void
}

export function TopBar({
  onOpenArticles,
  colorMode,
  onToggleColorMode,
  draftName,
  onRename,
  onCopyRich,
  onImport,
  onExport,
  onResetSample,
  onClear,
}: TopBarProps) {
  return (
    <header className="topbar topbar--editor">
      <button
        type="button"
        className="topbar-back"
        onClick={onOpenArticles}
        aria-label="返回我的文章"
      >
        <IconArrowLeft />
        <span className="topbar-back-text">我的文章</span>
      </button>

      <label className="draft-name-wrap" title="重命名当前文章">
        <span className="sr-only">文章标题</span>
        <input
          className="draft-name draft-name--title"
          value={draftName}
          onChange={(e) => onRename(e.target.value)}
          aria-label="文章标题"
        />
      </label>

      <NavDropdown label="文件" icon={<IconFile />}>
        {(close) => (
          <>
            <NavMenuItem
              onClick={() => {
                close()
                onImport()
              }}
            >
              导入 Markdown
            </NavMenuItem>
            <NavMenuItem
              onClick={() => {
                close()
                onExport()
              }}
            >
              导出 Markdown
            </NavMenuItem>
          </>
        )}
      </NavDropdown>

      <NavDropdown label="示例" icon={<IconFlask />}>
        {(close) => (
          <>
            <NavMenuItem
              onClick={() => {
                close()
                onResetSample()
              }}
            >
              载入示例
            </NavMenuItem>
            <NavMenuItem
              danger
              onClick={() => {
                close()
                onClear()
              }}
            >
              清空当前稿
            </NavMenuItem>
          </>
        )}
      </NavDropdown>

      <div className="topbar-spacer" />

      <button className="btn-primary topbar-copy" onClick={onCopyRich} type="button">
        <IconCopy />
        <span>复制到公众号</span>
      </button>

      <ThemeToggle mode={colorMode} onToggle={onToggleColorMode} />
    </header>
  )
}
