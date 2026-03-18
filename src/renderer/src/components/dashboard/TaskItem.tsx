import { useState } from 'react'

interface TaskItemProps {
  id: string
  title: string
  completed: boolean
  dueDate?: string
  priority: 'low' | 'medium' | 'high'
  onToggle: (id: string) => void
}

const priorityColors = {
  low: 'bg-success',
  medium: 'bg-warning',
  high: 'bg-error'
}

export function TaskItem({
  id,
  title,
  completed,
  dueDate,
  priority,
  onToggle
}: TaskItemProps): React.JSX.Element {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = (): void => {
    if (!completed) {
      setIsAnimating(true)
      setTimeout(() => {
        setIsAnimating(false)
        onToggle(id)
      }, 400)
    } else {
      onToggle(id)
    }
  }

  return (
    <div
      className={`group flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-blue-light/30 transition-all ${
        completed ? 'opacity-60' : ''
      }`}
    >
      {/* Completion Dot - 'dot.' brand interaction */}
      <button
        onClick={handleToggle}
        className="relative w-6 h-6 rounded-full border-2 border-border hover:border-primary transition-colors flex items-center justify-center"
      >
        {/* Fill animation */}
        <span
          className={`absolute inset-0.5 rounded-full bg-primary transition-transform duration-300 ${
            completed ? 'scale-100' : isAnimating ? 'scale-100' : 'scale-0'
          }`}
        />
        {/* Check mark */}
        {completed && (
          <svg className="relative w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${completed ? 'line-through text-placeholder' : 'text-text'}`}>
          {title}
        </p>
        {dueDate && (
          <p className="text-xs text-placeholder mt-1">{dueDate}</p>
        )}
      </div>

      {/* Priority Indicator */}
      <span className={`w-2 h-2 rounded-full ${priorityColors[priority]}`} title={`${priority} priority`} />
    </div>
  )
}
