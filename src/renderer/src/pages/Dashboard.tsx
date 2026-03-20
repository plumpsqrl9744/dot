import { JSX, useMemo } from 'react'
import { FiCheckCircle, FiClock, FiAlertCircle, FiTrendingUp } from 'react-icons/fi'
import {
  StatCard,
  WeeklyActivityChart,
  TaskStatusChart,
  ProjectsChart,
  RecentActivity
} from '@renderer/features/dashboard'
import { Breadcrumb } from '@renderer/shared/components'
import {
  DASHBOARD_WEEKLY_DATA,
  DASHBOARD_PROJECT_DATA,
  DASHBOARD_STATUS_DATA,
  DASHBOARD_RECENT_ACTIVITY
} from '../constants'
import { useTasks } from '../store'
import { isTaskCompleted } from '../types'

export function Dashboard(): JSX.Element {
  const { tasks } = useTasks()

  const stats = useMemo(() => {
    const completed = tasks.filter((t) => isTaskCompleted(t)).length
    const active = tasks.filter((t) => !isTaskCompleted(t)).length
    const urgent = tasks.filter((t) => !isTaskCompleted(t) && t.dueStatus === 'urgent').length
    const total = tasks.length
    const productivity = total > 0 ? Math.round((completed / total) * 100) : 0
    return { completed, active, urgent, productivity }
  }, [tasks])

  const today = new Date()
  const dateString = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })

  return (
    <div className="h-full overflow-auto bg-white">
      <div className="max-w-[1200px] mx-auto px-8 py-5 space-y-5">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'Dashboard' }]} />

        {/* Header */}
        <header>
          <p className="text-xs text-[var(--text-placeholder)] font-medium">{dateString}</p>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] mt-1">Dashboard</h1>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard
            icon={<FiCheckCircle size={14} />}
            label="Completed"
            value={stats.completed}
            change={{ value: 12, isPositive: true }}
            color="success"
          />
          <StatCard
            icon={<FiClock size={14} />}
            label="In Progress"
            value={stats.active}
            change={{ value: 3, isPositive: false }}
            color="primary"
          />
          <StatCard
            icon={<FiAlertCircle size={14} />}
            label="Urgent"
            value={stats.urgent}
            subtext="needs attention"
            color="error"
          />
          <StatCard
            icon={<FiTrendingUp size={14} />}
            label="Productivity"
            value={`${stats.productivity}%`}
            change={{ value: 5, isPositive: true }}
            color="primary"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <WeeklyActivityChart data={DASHBOARD_WEEKLY_DATA} />
          </div>
          <TaskStatusChart data={DASHBOARD_STATUS_DATA} />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-3 gap-3 pb-6">
          <div className="col-span-2">
            <ProjectsChart data={DASHBOARD_PROJECT_DATA} />
          </div>
          <RecentActivity activities={DASHBOARD_RECENT_ACTIVITY} />
        </div>
      </div>
    </div>
  )
}
