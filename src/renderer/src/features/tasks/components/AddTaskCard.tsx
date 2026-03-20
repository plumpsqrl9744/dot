import { FiPlus } from 'react-icons/fi'

interface AddTaskCardProps {
  onClick?: () => void
}

export function AddTaskCard({ onClick }: AddTaskCardProps): React.JSX.Element {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 w-full px-4 py-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--border-default)] text-[var(--text-placeholder)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all bg-[var(--bg-default)]/50 hover:bg-[var(--bg-default)]"
    >
      <FiPlus size={14} />
      <span className="text-sm font-medium">New Task</span>
    </button>
  )
}

export type { AddTaskCardProps }
