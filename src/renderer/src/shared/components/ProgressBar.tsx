interface ProgressBarProps {
  /** 현재 값 (0-100 또는 value/max 형태) */
  value: number
  /** 최대 값 (기본 100) */
  max?: number
  /** 바 색상 */
  color?: 'primary' | 'success' | 'warning' | 'error'
  /** 바 높이 */
  size?: 'xs' | 'sm' | 'md'
  /** 애니메이션 여부 */
  animated?: boolean
  /** 라벨 표시 */
  showLabel?: boolean
  /** 추가 클래스 */
  className?: string
}

const colorMap = {
  primary: 'bg-[var(--primary)]',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error'
}

const sizeMap = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2'
}

export function ProgressBar({
  value,
  max = 100,
  color = 'primary',
  size = 'sm',
  animated = true,
  showLabel = false,
  className = ''
}: ProgressBarProps): React.JSX.Element {
  const percentage = Math.min(Math.round((value / max) * 100), 100)

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-[var(--font-size-xs)] text-[var(--text-secondary)]">
            {value}/{max}
          </span>
          <span className="text-[var(--font-size-xs)] text-[var(--text-placeholder)]">
            {percentage}%
          </span>
        </div>
      )}
      <div className={`w-full ${sizeMap[size]} bg-[var(--border-default)] rounded-full overflow-hidden`}>
        <div
          className={`h-full ${colorMap[color]} rounded-full ${animated ? 'transition-all duration-500' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export type { ProgressBarProps }
