import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card } from '@renderer/shared/components'

interface ProjectData {
  name: string
  tasks: number
  color: string
}

interface ProjectsChartProps {
  data: ProjectData[]
}

export function ProjectsChart({ data }: ProjectsChartProps): React.JSX.Element {
  return (
    <Card padding="md">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Tasks by Project</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: 'var(--text-placeholder)' }}
            axisLine={{ stroke: 'var(--border-light)' }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
            axisLine={{ stroke: 'var(--border-light)' }}
            width={70}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-default)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              fontSize: 12
            }}
          />
          <Bar dataKey="tasks" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

export type { ProjectsChartProps, ProjectData }
