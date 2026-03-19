import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { Card, Dot } from '@renderer/shared/components'

interface WeeklyData {
  name: string
  completed: number
  created: number
}

interface WeeklyActivityChartProps {
  data: WeeklyData[]
}

export function WeeklyActivityChart({ data }: WeeklyActivityChartProps): React.JSX.Element {
  return (
    <Card padding="md">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Weekly Activity</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: 'var(--text-placeholder)' }}
            axisLine={{ stroke: 'var(--border-light)' }}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--text-placeholder)' }}
            axisLine={{ stroke: 'var(--border-light)' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-default)',
              border: '1px solid var(--border-default)',
              borderRadius: 6,
              fontSize: 11
            }}
          />
          <Area
            type="monotone"
            dataKey="completed"
            stroke="#22C55E"
            fillOpacity={1}
            fill="url(#colorCompleted)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="created"
            stroke="#2563EB"
            fillOpacity={1}
            fill="url(#colorCreated)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <Dot color="success" size="md" />
          <span className="text-xs text-[var(--text-secondary)]">Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Dot color="primary" size="md" />
          <span className="text-xs text-[var(--text-secondary)]">Created</span>
        </div>
      </div>
    </Card>
  )
}

export type { WeeklyActivityChartProps, WeeklyData }
