/** 发丝网格 + 噪点，Awwwards 极简底图 */
export function GridBackdrop({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  return (
    <div className={`grid-backdrop grid-backdrop--${variant}`} aria-hidden="true">
      <div className="grid-backdrop__lines" />
      <div className="grid-backdrop__glow" />
      <div className="grid-backdrop__noise" />
    </div>
  )
}
