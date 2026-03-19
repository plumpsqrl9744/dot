import { Dot } from './Dot'

interface SectionHeaderProps {
  title: string
  count?: number
  /** 상태 점 색상 */
  dotColor?: 'primary' | 'success' | 'warning' | 'error'
  /** 뮤트 스타일 */
  muted?: boolean
  /** 우측 액션 영역 */
  action?: React.ReactNode
  /** 추가 클래스 */
  className?: string
}

export function SectionHeader({
  title,
  count,
  dotColor,
  muted = false,
  action,
  className = ''
}: SectionHeaderProps): React.JSX.Element {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-2">
        {dotColor && <Dot color={dotColor} size="sm" />}
        <h2
          className={`text-sm font-semibold ${
            muted ? 'text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
          }`}
        >
          {title}
        </h2>
        {count !== undefined && (
          <span className="text-xs text-[var(--text-placeholder)]">{count}</span>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

export type { SectionHeaderProps }
