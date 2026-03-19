import { useState } from 'react'
import { FiCheckSquare, FiSquare, FiCheck, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { Badge, Avatar, Dot, ContextMenu } from '@renderer/shared/components'

interface TaskItemProps {
  id: string
  title: string
  completed: boolean
  tag?: string
  dueDate?: string
  dueStatus?: 'urgent' | 'warning' | 'safe'
  assignedBy?: string
  onToggle: (id: string) => void
  onClick?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

const statusColors = {
  urgent: 'error',
  warning: 'warning',
  safe: 'success'
} as const

export function TaskItem({
  id,
  title,
  completed,
  tag,
  dueDate,
  dueStatus = 'safe',
  assignedBy,
  onToggle,
  onClick,
  onEdit,
  onDelete
}: TaskItemProps): React.JSX.Element {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)

  const handleToggle = (e: React.MouseEvent): void => {
    e.stopPropagation()
    onToggle(id)
  }

  const handleClick = (): void => {
    onClick?.(id)
  }

  const handleContextMenu = (e: React.MouseEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }

  const closeContextMenu = (): void => {
    setContextMenu(null)
  }

  const contextMenuItems = [
    {
      label: completed ? '미완료로 변경' : '완료로 변경',
      icon: <FiCheck size={14} />,
      onClick: () => onToggle(id)
    },
    {
      label: '수정',
      icon: <FiEdit2 size={14} />,
      onClick: () => onEdit?.(id)
    },
    {
      label: '삭제',
      icon: <FiTrash2 size={14} />,
      onClick: () => onDelete?.(id),
      danger: true
    }
  ]

  return (
    <>
      <div
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        className={`group relative flex flex-col gap-2.5 px-3.5 py-3 rounded-[var(--radius-lg)] border transition-all duration-200 ease-out w-full cursor-pointer ${
          completed
            ? 'opacity-60 border-[var(--border-light)] bg-[var(--bg-default)]'
            : 'border-[var(--border-default)] bg-[var(--bg-default)] hover:bg-[var(--bg-secondary)] hover:border-[var(--border-default)]'
        }`}
        style={{ boxShadow: 'none' }}
        onMouseEnter={(e) => {
          if (!completed) {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)'
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        {/* Status Indicator */}
        <div className="absolute top-3 right-3 transition-transform duration-200 group-hover:scale-125">
          <Dot
            color={completed ? 'muted' : statusColors[dueStatus]}
            size="sm"
          />
        </div>

        {/* Title */}
        <h4
          className={`text-sm font-medium leading-snug pr-4 transition-colors ${
            completed ? 'text-[var(--text-placeholder)] line-through' : 'text-[var(--text-primary)]'
          }`}
        >
          {title}
        </h4>

        {/* Tag */}
        {tag && <Badge label={tag} />}

        {/* Bottom: Checkbox + DueDate + Assignee */}
        <div className="flex items-center justify-between pt-2 mt-0.5 border-t border-[var(--border-light)]">
          {/* Checkbox & ID */}
          <button
            onClick={(e) => handleToggle(e)}
            className={`flex items-center gap-1.5 text-[var(--font-size-sm)] font-medium transition-all duration-150 ${
              completed
                ? 'text-[var(--primary)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            {completed ? (
              <FiCheckSquare size={14} className="text-[var(--primary)]" strokeWidth={2} />
            ) : (
              <FiSquare size={14} strokeWidth={1.5} className="transition-colors" />
            )}
            <span className="text-[10px] tracking-tight opacity-70">DOT-{id.toUpperCase()}</span>
          </button>

          {/* Right side: DueDate + Assignee */}
          <div className="flex items-center gap-2.5">
            {dueDate && (
              <span
                className="text-[10px] font-semibold tracking-tight"
                style={{
                  color: completed
                    ? 'var(--text-muted)'
                    : `var(--${statusColors[dueStatus]})`
                }}
              >
                {dueDate}
              </span>
            )}
            <div className="transition-transform duration-150 group-hover:scale-105">
              <Avatar name={assignedBy} size="xs" gradient={!!assignedBy} />
            </div>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          items={contextMenuItems}
          position={contextMenu}
          onClose={closeContextMenu}
        />
      )}
    </>
  )
}

export type { TaskItemProps }
