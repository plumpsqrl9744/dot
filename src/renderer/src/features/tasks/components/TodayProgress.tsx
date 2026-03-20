import { ProgressBar } from '@renderer/shared/components'
import type { Task } from '@renderer/types'

interface TodayProgressProps {
  completed: number
  total: number
  tasks: Task[]
}

export function TodayProgress({ completed, total }: TodayProgressProps): React.JSX.Element {
  const today = new Date()
  const dateStr = today.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="flex items-center gap-6 px-5 py-4 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-default)]">
      {/* Left: Large percentage */}
      <div className="shrink-0">
        <span className="text-3xl font-bold text-[var(--primary)] tabular-nums leading-none">
          {percentage}
          <span className="text-lg font-semibold">%</span>
        </span>
      </div>

      {/* Center: Info + Progress bar */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[var(--text-primary)]">오늘 할 일</span>
            <span className="text-xs text-[var(--text-muted)]">{dateStr}</span>
          </div>
          <span className="text-xs font-medium text-[var(--text-secondary)] tabular-nums">
            {completed} / {total} 완료
          </span>
        </div>

        <ProgressBar value={completed} max={total || 1} color="primary" size="sm" />
      </div>
    </div>
  )
}
