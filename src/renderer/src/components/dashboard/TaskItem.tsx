import {} from 'react'
import { FiCheckSquare, FiSquare, FiMoreHorizontal, FiUser, FiClock } from 'react-icons/fi'

interface TaskItemProps {
  id: string
  title: string
  completed: boolean
  dueDate?: string
  priority?: 'low' | 'medium' | 'high'
  from?: string
  time?: string
  onToggle: (id: string) => void
}

const tagStyles = {
  low: 'bg-[#E3F2FD] text-[#007AFF]',
  medium: 'bg-[#FFF3E0] text-[#F57C00]',
  high: 'bg-[#FFEBEE] text-[#D32F2F]'
}

export function TaskItem({
  id,
  title,
  completed,
  dueDate,
  priority,
  from,
  time,
  onToggle
}: TaskItemProps): React.JSX.Element {
  const handleToggle = (): void => {
    onToggle(id)
  }

  return (
    <div
      className={`group flex flex-col gap-6 bg-white px-14 py-10 rounded-[32px] border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 w-full ${
        completed
          ? 'opacity-60 border-border/40'
          : 'border-border/60 shadow-sm hover:border-primary/40'
      }`}
    >
      {/* Top: Title */}
      <div className="flex justify-between items-start gap-4">
        <h4
          className={`text-[19px] font-bold leading-tight tracking-tight mt-1 transition-colors ${
            completed ? 'text-text-placeholder line-through' : 'text-text-primary'
          }`}
        >
          {title}
        </h4>
        <button className="opacity-0 group-hover:opacity-100 p-2 rounded-xl hover:bg-black/[0.04] text-text-placeholder transition-all shrink-0">
          <FiMoreHorizontal size={24} />
        </button>
      </div>

      {/* Middle: Tag/Label */}
      <div className="flex flex-wrap gap-2">
        {priority && (
          <span
            className={`px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-[0.1em] ${tagStyles[priority]}`}
          >
            {priority === 'high' ? 'CRITICAL' : priority === 'medium' ? 'FEEDBACK' : 'INBOX'}
          </span>
        )}
      </div>

      {/* Bottom: ID/Checkbox & Avatars */}
      <div className="flex items-center justify-between mt-4 pt-7 border-t border-border/10">
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggle}
            className={`flex items-center gap-3 text-sm font-bold transition-colors ${
              completed ? 'text-primary' : 'text-text-secondary group-hover:text-text-primary'
            }`}
          >
            {completed ? (
              <FiCheckSquare size={22} className="text-primary" />
            ) : (
              <FiSquare size={22} />
            )}
            <span className="text-[15px] tracking-tight font-black opacity-80">
              DOT-{id.toUpperCase()}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-5">
          {from && (
            <div className="flex -space-x-4">
              <div
                className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-mid to-primary border-2 border-white flex items-center justify-center text-[12px] font-black text-white shadow-md relative z-10"
                title={from}
              >
                {from[0]}
              </div>
              <div className="w-9 h-9 rounded-full bg-[#F1F3F4] border-2 border-white flex items-center justify-center text-text-placeholder shadow-sm">
                <FiUser size={16} />
              </div>
            </div>
          )}
          {(dueDate || time) && (
            <div
              className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl text-[13px] font-bold ${
                completed
                  ? 'text-text-placeholder bg-black/[0.03]'
                  : 'text-text-primary bg-primary/5'
              }`}
            >
              <FiClock size={16} />
              <span>{time ? `${time} PM` : dueDate}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
