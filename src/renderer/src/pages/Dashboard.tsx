import { JSX } from 'react'
import { FiCheckCircle, FiClock, FiAlertCircle, FiTrendingUp } from 'react-icons/fi'
import {
  StatCard,
  WeeklyActivityChart,
  TaskStatusChart,
  ProjectsChart,
  RecentActivity
} from '@renderer/features/dashboard'
import { Breadcrumb } from '@renderer/shared/components'

// Mock data
const weeklyData = [
  { name: 'Mon', completed: 4, created: 6 },
  { name: 'Tue', completed: 7, created: 5 },
  { name: 'Wed', completed: 5, created: 8 },
  { name: 'Thu', completed: 8, created: 4 },
  { name: 'Fri', completed: 6, created: 7 },
  { name: 'Sat', completed: 3, created: 2 },
  { name: 'Sun', completed: 2, created: 1 }
]

const projectData = [
  { name: 'AMS', tasks: 12, color: '#2563EB' },
  { name: 'WAS', tasks: 8, color: '#5494F3' },
  { name: 'Frontend', tasks: 15, color: '#22C55E' },
  { name: 'BIZ', tasks: 6, color: '#F57C00' },
  { name: 'Personal', tasks: 4, color: '#9CA3AF' }
]

const statusDistribution = [
  { name: 'Completed', value: 24, color: '#22C55E' },
  { name: 'In Progress', value: 12, color: '#2563EB' },
  { name: 'Urgent', value: 5, color: '#D32F2F' },
  { name: 'Due Soon', value: 8, color: '#F57C00' }
]

const recentActivity = [
  { id: 1, action: 'completed' as const, task: '마케팅 미팅 회의록', time: '2시간 전' },
  { id: 2, action: 'created' as const, task: '서버 부하 테스트', time: '3시간 전' },
  { id: 3, action: 'assigned' as const, task: 'UI 디자인 검토', by: '김철수', time: '5시간 전' },
  { id: 4, action: 'completed' as const, task: '주간 보고서 작성', time: '어제' },
  { id: 5, action: 'created' as const, task: 'API 문서화', time: '어제' }
]

export function Dashboard(): JSX.Element {
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
            value={24}
            change={{ value: 12, isPositive: true }}
            color="success"
          />
          <StatCard
            icon={<FiClock size={14} />}
            label="In Progress"
            value={12}
            change={{ value: 3, isPositive: false }}
            color="primary"
          />
          <StatCard
            icon={<FiAlertCircle size={14} />}
            label="Urgent"
            value={5}
            subtext="needs attention"
            color="error"
          />
          <StatCard
            icon={<FiTrendingUp size={14} />}
            label="Productivity"
            value="87%"
            change={{ value: 5, isPositive: true }}
            color="primary"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <WeeklyActivityChart data={weeklyData} />
          </div>
          <TaskStatusChart data={statusDistribution} />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-3 gap-3 pb-6">
          <div className="col-span-2">
            <ProjectsChart data={projectData} />
          </div>
          <RecentActivity activities={recentActivity} />
        </div>
      </div>
    </div>
  )
}
