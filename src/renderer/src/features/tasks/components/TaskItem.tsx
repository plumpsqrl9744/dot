import { useState } from 'react'
import {
  FiChevronDown,
  FiChevronRight,
  FiCheck,
  FiSquare,
  FiCheckSquare,
  FiEdit2,
  FiTrash2
} from 'react-icons/fi'
import { Badge, Avatar, ProgressBar, ContextMenu } from '@renderer/shared/components'
import type { Task, SubTask } from '@renderer/types'
import { isTaskCompleted, getTaskProgress, getSubTaskProgress } from '@renderer/types'

// ── Types ──────────────────────────────────────────────────────

export interface TaskRowProps {
  task: Task
  onToggleSubTask: (taskId: string, subTaskId: string) => void
  onToggleChecklist: (taskId: string, subTaskId: string, checklistId: string) => void
  onClick?: (taskId: string) => void
  onEdit?: (taskId: string) => void
  onDelete?: (taskId: string) => void
  onToggleMyDay?: (taskId: string) => void
}

// ── SubTask Row ────────────────────────────────────────────────

function SubTaskRow({
  subTask,
  taskId,
  onToggleSubTask,
  onToggleChecklist
}: {
  subTask: SubTask
  taskId: string
  onToggleSubTask: (taskId: string, subTaskId: string) => void
  onToggleChecklist: (taskId: string, subTaskId: string, checklistId: string) => void
}): React.JSX.Element {
  const [expanded, setExpanded] = useState(false)
  const progress = getSubTaskProgress(subTask)
  const hasChecklist = subTask.checklist.length > 0

  return (
    <div className="pl-6">
      {/* SubTask header row */}
      <div
        className={`flex items-center gap-2 py-1.5 group/sub ${
          subTask.completed ? 'opacity-50' : ''
        }`}
      >
        {/* Expand toggle or spacer */}
        {hasChecklist ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setExpanded(!expanded)
            }}
            className="w-4 h-4 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors shrink-0"
          >
            {expanded ? <FiChevronDown size={12} /> : <FiChevronRight size={12} />}
          </button>
        ) : (
          <span className="w-4 shrink-0" />
        )}

        {/* Toggle checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleSubTask(taskId, subTask.id)
          }}
          className="shrink-0 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
        >
          {subTask.completed ? (
            <FiCheckSquare size={14} className="text-[var(--primary)]" />
          ) : (
            <FiSquare size={14} />
          )}
        </button>

        {/* Title */}
        <span
          className={`text-xs flex-1 ${
            subTask.completed
              ? 'text-[var(--text-placeholder)] line-through'
              : 'text-[var(--text-secondary)]'
          }`}
        >
          {subTask.title}
        </span>

        {/* Checklist progress */}
        {hasChecklist && (
          <span className="text-[10px] text-[var(--text-muted)] tabular-nums shrink-0">
            {progress.completed}/{progress.total}
          </span>
        )}

        {/* Due date */}
        {subTask.dueDate && !subTask.completed && (
          <span
            className="text-[10px] font-semibold tabular-nums shrink-0"
            style={{ color: subTask.dueStatus === 'urgent' ? 'var(--error)' : subTask.dueStatus === 'warning' ? 'var(--warning)' : 'var(--success)' }}
          >
            {subTask.dueDate}
          </span>
        )}
      </div>

      {/* Checklist items (expanded) */}
      {expanded && hasChecklist && (
        <div className="pl-6 pb-1">
          {subTask.checklist.map((item, index) => {
            const isLast = index === subTask.checklist.length - 1
            return (
              <div key={item.id} className="flex items-center gap-2 py-0.5">
                {/* Tree connector */}
                <span className="w-4 text-[var(--border-default)] text-xs leading-none flex items-center justify-center shrink-0">
                  {isLast ? '\u2514' : '\u251C'}
                </span>

                {/* Checkbox */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleChecklist(taskId, subTask.id, item.id)
                  }}
                  className="shrink-0 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                >
                  {item.completed ? (
                    <FiCheckSquare size={12} className="text-[var(--primary)]" />
                  ) : (
                    <FiSquare size={12} />
                  )}
                </button>

                {/* Text */}
                <span
                  className={`text-[11px] ${
                    item.completed
                      ? 'text-[var(--text-placeholder)] line-through'
                      : 'text-[var(--text-muted)]'
                  }`}
                >
                  {item.text}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── TaskRow (Main Export) ──────────────────────────────────────

export function TaskRow({
  task,
  onToggleSubTask,
  onToggleChecklist,
  onClick,
  onEdit,
  onDelete,
  onToggleMyDay
}: TaskRowProps): React.JSX.Element {
  const [expanded, setExpanded] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)

  const completed = isTaskCompleted(task)
  const progress = getTaskProgress(task)
  const hasSubTasks = task.subTasks.length > 0

  const handleContextMenu = (e: React.MouseEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }

  const contextMenuItems = [
    {
      label: task.isMyDay ? '오늘 할 일에서 제거' : '오늘 할 일에 추가',
      onClick: () => onToggleMyDay?.(task.id)
    },
    {
      label: '수정',
      icon: <FiEdit2 size={14} />,
      onClick: () => onEdit?.(task.id)
    },
    {
      label: '삭제',
      icon: <FiTrash2 size={14} />,
      onClick: () => onDelete?.(task.id),
      danger: true
    }
  ]

  return (
    <>
      <div
        onContextMenu={handleContextMenu}
        className={`rounded-[var(--radius-lg)] border transition-all duration-200 ${
          completed
            ? 'opacity-50 border-[var(--border-light)] bg-[var(--bg-default)]'
            : 'border-[var(--border-default)] bg-[var(--bg-default)] hover:border-[var(--border-default)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
        }`}
      >
        {/* ── Task Header Row ── */}
        <div
          className="flex items-center gap-3 px-4 py-3 cursor-pointer"
          onClick={() => onClick?.(task.id)}
        >
          {/* Completion indicator */}
          <div className="shrink-0 w-4 flex justify-center">
            {completed ? (
              <FiCheck size={14} className="text-[var(--primary)]" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]" />
            )}
          </div>

          {/* Title + MyDay badge */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <h4
              className={`text-sm font-medium truncate ${
                completed
                  ? 'text-[var(--text-placeholder)] line-through'
                  : 'text-[var(--text-primary)]'
              }`}
            >
              {task.title}
            </h4>
            {task.isMyDay && !completed && (
              <span className="shrink-0 text-[9px] font-semibold px-1.5 py-0.5 rounded-[var(--radius-sm)] text-[var(--primary)] bg-[var(--primary)]/10">
                Today
              </span>
            )}
          </div>

          {/* Right side meta — fixed widths for alignment */}
          <div className="flex items-center shrink-0">
            {/* Tag: fixed width */}
            <div className="w-24 flex justify-end">
              {task.tag && <Badge label={task.tag} size="sm" />}
            </div>

            {/* Progress: fixed width */}
            <div className="w-20 flex items-center justify-end gap-1.5">
              {hasSubTasks && (
                <>
                  <span className="text-[10px] font-medium text-[var(--text-muted)] tabular-nums">
                    {progress.completed}/{progress.total}
                  </span>
                  <div className="w-10">
                    <ProgressBar
                      value={progress.completed}
                      max={progress.total || 1}
                      color={completed ? 'success' : 'primary'}
                      size="xs"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Due date: fixed width, urgency color */}
            <div className="w-14 flex justify-end">
              {task.dueDate && (
                <span
                  className="text-[10px] font-semibold tabular-nums whitespace-nowrap"
                  style={{
                    color: completed
                      ? 'var(--text-muted)'
                      : statusColors[task.dueStatus || 'safe']
                  }}
                >
                  {task.dueDate}
                </span>
              )}
            </div>

            {/* Assignee: fixed width */}
            <div className="w-8 flex justify-center">
              {task.assignedBy && <Avatar name={task.assignedBy} size="xs" gradient />}
            </div>

            {/* Expand chevron: fixed width */}
            <div className="w-6 flex justify-center">
              {hasSubTasks && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setExpanded(!expanded)
                  }}
                  className="w-5 h-5 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors rounded hover:bg-[var(--bg-secondary)]"
                >
                  {expanded ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── SubTask List (Accordion) ── */}
        {expanded && hasSubTasks && (
          <div className="border-t border-[var(--border-light)] px-4 py-2">
            {task.subTasks.map((subTask) => (
              <SubTaskRow
                key={subTask.id}
                subTask={subTask}
                taskId={task.id}
                onToggleSubTask={onToggleSubTask}
                onToggleChecklist={onToggleChecklist}
              />
            ))}
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          items={contextMenuItems}
          position={contextMenu}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  )
}

// Keep backward-compatible export name
export { TaskRow as TaskItem }
export type { TaskRowProps as TaskItemProps }
