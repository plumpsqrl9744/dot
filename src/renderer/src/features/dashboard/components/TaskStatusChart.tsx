import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, Dot } from '@renderer/shared/components'

interface StatusData {
  name: string
  value: number
  color: string
}

interface TaskStatusChartProps {
  data: StatusData[]
}

export function TaskStatusChart({ data }: TaskStatusChartProps): React.JSX.Element {
  return (
    <Card padding="md">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Task Status</h3>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-default)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              fontSize: 12
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <Dot color={item.color} size="md" />
            <span className="text-[10px] text-[var(--text-secondary)]">{item.name}</span>
            <span className="text-[10px] font-medium text-[var(--text-primary)] ml-auto">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export type { TaskStatusChartProps, StatusData }
