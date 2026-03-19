import { FiCheckCircle, FiCalendar, FiUsers } from 'react-icons/fi'
import { Card } from '@renderer/shared/components'

interface Activity {
  id: number
  action: 'completed' | 'created' | 'assigned'
  task: string
  by?: string
  time: string
}

interface RecentActivityProps {
  activities: Activity[]
}

const actionConfig = {
  completed: {
    icon: FiCheckCircle,
    className: 'bg-success/10 text-success'
  },
  created: {
    icon: FiCalendar,
    className: 'bg-primary/10 text-primary'
  },
  assigned: {
    icon: FiUsers,
    className: 'bg-warning/10 text-warning'
  }
}

export function RecentActivity({ activities }: RecentActivityProps): React.JSX.Element {
  return (
    <Card padding="md">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Recent Activity</h3>
      <div className="space-y-2.5">
        {activities.map((activity) => {
          const config = actionConfig[activity.action]
          const Icon = config.icon

          return (
            <div key={activity.id} className="flex items-start gap-2">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${config.className}`}
              >
                <Icon size={10} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-primary truncate">{activity.task}</p>
                <p className="text-[10px] text-text-placeholder">
                  {activity.action === 'assigned' && activity.by ? `${activity.by} · ` : ''}
                  {activity.time}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export type { RecentActivityProps, Activity }
