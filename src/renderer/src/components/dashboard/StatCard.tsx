interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    isPositive: boolean
  }
  icon: React.ReactNode
  color: 'primary' | 'success' | 'warning' | 'error'
}

const colorClasses = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error'
}

export function StatCard({ title, value, change, icon, color }: StatCardProps): React.JSX.Element {
  return (
    <div className="bg-white rounded-xl border border-border p-6 dot-shadow hover:dot-shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-placeholder">{title}</p>
          <p className="mt-2 text-3xl font-bold text-text">{value}</p>
          {change && (
            <p className={`mt-2 text-sm font-medium ${change.isPositive ? 'text-success' : 'text-error'}`}>
              <span>{change.isPositive ? '+' : ''}{change.value}%</span>
              <span className="text-placeholder ml-1">vs last week</span>
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>{icon}</div>
      </div>
    </div>
  )
}
