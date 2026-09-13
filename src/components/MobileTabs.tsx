import type { MobileTab } from '../types'

interface MobileTabsProps {
  tab: MobileTab
  onChange: (tab: MobileTab) => void
}

export function MobileTabs({ tab, onChange }: MobileTabsProps) {
  return (
    <div className="segment" role="tablist" aria-label="编辑预览切换">
      <div className="segment-inner">
        <button
          type="button"
          role="tab"
          aria-pressed={tab === 'write'}
          onClick={() => onChange('write')}
        >
          写作
        </button>
        <button
          type="button"
          role="tab"
          aria-pressed={tab === 'preview'}
          onClick={() => onChange('preview')}
        >
          预览
        </button>
      </div>
    </div>
  )
}
