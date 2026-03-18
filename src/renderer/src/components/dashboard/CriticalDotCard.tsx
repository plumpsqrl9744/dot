import { FiZap, FiClock, FiUser } from 'react-icons/fi'

interface CriticalDotCardProps {
  title: string
  from?: string
  timeLeft?: string
  isOverdue?: boolean
}

export function CriticalDotCard({
  title,
  from,
  timeLeft,
  isOverdue
}: CriticalDotCardProps): React.JSX.Element {
  return (
    <div
      className={`relative group p-4 rounded-xl border transition-all cursor-pointer ${
        isOverdue 
          ? 'bg-white border-error/30 hover:shadow-md' 
          : 'bg-white border-primary/20 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-text truncate pr-2 tracking-tight">{title}</h3>
        <span className={`shrink-0 ${isOverdue ? 'text-error' : 'text-primary'}`}>
          <FiZap size={18} fill={isOverdue ? 'currentColor' : 'none'} />
        </span>
      </div>

      <div className="space-y-2">
        {from && (
          <div className="flex items-center gap-2 text-placeholder">
            <FiUser size={13} />
            <span className="text-[12px]">From: <span className="text-text/70">{from}</span></span>
          </div>
        )}
        
        {timeLeft && (
          <div className={`flex items-center gap-2 ${isOverdue ? 'text-error' : 'text-primary'}`}>
            <FiClock size={13} />
            <span className="text-[12px] font-semibold tracking-tight">
              {timeLeft} {isOverdue ? '(Overdue)' : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
