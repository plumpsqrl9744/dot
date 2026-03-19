import { Card } from '@renderer/shared/components'

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  change?: { value: number; isPositive: boolean }
  subtext?: string
  color: 'primary' | 'success' | 'warning' | 'error'
}

const colorMap = {
  primary: 'var(--primary)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--error)'
}

export function StatCard({
  icon,
  label,
  value,
  change,
  subtext,
  color
}: StatCardProps): React.JSX.Element {
  return (
    <Card padding="sm" hoverable>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span style={{ color: colorMap[color] }}>{icon}</span>
        <span className="text-xs font-medium text-[var(--text-placeholder)]">{label}</span>
      </div>
      <p
        className="text-xl font-semibold"
        style={{ color: color === 'primary' ? 'var(--text-primary)' : colorMap[color] }}
      >
        {value}
      </p>
      {change && (
        <p className="text-xs mt-0.5">
          <span style={{ color: change.isPositive ? 'var(--success)' : 'var(--error)' }}>
            {change.isPositive ? '+' : '-'}
            {change.value}%
          </span>
          <span className="text-[var(--text-muted)] ml-1">vs last week</span>
        </p>
      )}
      {subtext && <p className="text-xs text-[var(--text-muted)] mt-0.5">{subtext}</p>}
    </Card>
  )
}

export type { StatCardProps }
