import { FiCheckSquare, FiSquare, FiUser } from 'react-icons/fi'
import { Badge } from '@renderer/shared/components'

interface TaskItemProps {
  id: string
  title: string
  completed: boolean
  /** 프로젝트/주제 태그 (예: AMS, WAS, Frontend 등) */
  tag?: string
  /** 마감 기한 표시 (예: D-3, D-1, 1일 경과 등) */
  dueDate?: string
  /** 마감 상태: urgent(빨강), warning(노랑), safe(초록) */
  dueStatus?: 'urgent' | 'warning' | 'safe'
  /** 부여자 이름 (없으면 본인) */
  assignedBy?: string
  onToggle: (id: string) => void
}

const statusColors = {
  urgent: 'var(--error)',
  warning: 'var(--warning)',
  safe: 'var(--success)'
}

export function TaskItem({
  id,
  title,
  completed,
  tag,
  dueDate,
  dueStatus = 'safe',
  assignedBy,
  onToggle
}: TaskItemProps): React.JSX.Element {
  const handleToggle = (): void => {
    onToggle(id)
  }

  return (
    <div
      className={`group relative flex flex-col gap-2.5 px-3.5 py-3 rounded-[var(--radius-lg)] border transition-all duration-200 ease-out w-full ${
        completed
          ? 'opacity-60 border-[var(--border-light)] bg-[var(--bg-default)]'
          : 'border-[var(--border-default)] bg-[var(--bg-default)] hover:bg-[var(--bg-secondary)] hover:border-[var(--border-default)]'
      }`}
      style={{
        boxShadow: 'none'
      }}
      onMouseEnter={(e) => {
        if (!completed) {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)'
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Status Indicator (우측 상단 점) */}
      <div
        className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full transition-transform duration-200 group-hover:scale-125"
        style={{ backgroundColor: completed ? 'var(--text-muted)' : statusColors[dueStatus] }}
        title={dueStatus === 'urgent' ? '마감 임박' : dueStatus === 'warning' ? '주의' : '여유'}
      />

      {/* Title */}
      <h4
        className={`text-sm font-medium leading-snug pr-4 transition-colors ${
          completed ? 'text-text-placeholder line-through' : 'text-text-primary'
        }`}
      >
        {title}
      </h4>

      {/* Tag (프로젝트/주제) */}
      {tag && <Badge label={tag} />}

      {/* Bottom: Checkbox + DueDate + Assignee */}
      <div className="flex items-center justify-between pt-2 mt-0.5 border-t border-[var(--border-light)]">
        {/* Checkbox & ID */}
        <button
          onClick={handleToggle}
          className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-150 ${
            completed ? 'text-primary' : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          {completed ? (
            <FiCheckSquare size={14} className="text-primary" strokeWidth={2} />
          ) : (
            <FiSquare size={14} strokeWidth={1.5} className="transition-colors" />
          )}
          <span className="text-[10px] tracking-tight opacity-70">DOT-{id.toUpperCase()}</span>
        </button>

        {/* Right side: DueDate + Assignee */}
        <div className="flex items-center gap-2.5">
          {/* Due Date */}
          {dueDate && (
            <span
              className="text-[10px] font-semibold tracking-tight"
              style={{
                color: completed ? 'var(--text-muted)' : statusColors[dueStatus]
              }}
            >
              {dueDate}
            </span>
          )}

          {/* Assignee Icon */}
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold transition-transform duration-150 group-hover:scale-105 ${
              assignedBy
                ? 'bg-gradient-to-br from-primary to-blue-mid text-white shadow-sm'
                : 'bg-bg-secondary text-text-placeholder'
            }`}
            title={assignedBy || '본인'}
          >
            {assignedBy ? assignedBy[0].toUpperCase() : <FiUser size={10} />}
          </div>
        </div>
      </div>
    </div>
  )
}
