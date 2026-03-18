interface ProgressChartProps {
  data: {
    label: string
    value: number
    total: number
  }[]
}

export function ProgressChart({ data }: ProgressChartProps): React.JSX.Element {
  return (
    <div className="bg-white rounded-xl border border-border p-6 dot-shadow">
      <h3 className="text-lg font-semibold text-text mb-6">Weekly Progress</h3>
      <div className="space-y-4">
        {data.map((item) => {
          const percentage = Math.round((item.value / item.total) * 100)
          return (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text">{item.label}</span>
                <span className="text-sm text-placeholder">
                  {item.value}/{item.total}
                </span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
