import { JSX, useState } from 'react'
import { FiPlus, FiSearch } from 'react-icons/fi'
import { SectionHeader, Button, FilterTabs, Card, Breadcrumb } from '@renderer/shared/components'
import { TaskItem, AddTaskCard } from '@renderer/features/tasks'

interface MyTasksProps {
  onTaskClick?: (taskId: string) => void
}

export function MyTasks({ onTaskClick }: MyTasksProps): JSX.Element {
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: '마케팅 미팅 회의록 정리',
      completed: false,
      tag: 'MARKETING',
      dueDate: 'D-1',
      dueStatus: 'urgent' as const,
      assignedBy: '김철수'
    },
    {
      id: '2',
      title: '클라이언트 메일 발송',
      completed: true,
      tag: 'AMS',
      dueDate: 'D-0',
      dueStatus: 'safe' as const
    },
    {
      id: '3',
      title: '서버 아키텍처 다이어그램 작성',
      completed: false,
      tag: 'WAS',
      dueDate: 'D-5',
      dueStatus: 'safe' as const,
      assignedBy: '이영희'
    },
    {
      id: '4',
      title: '경쟁사 분석 보고서',
      completed: false,
      tag: 'BIZ',
      dueDate: 'D-3',
      dueStatus: 'warning' as const
    },
    {
      id: '5',
      title: '주간 업무 보고',
      completed: false,
      dueDate: 'D-5',
      dueStatus: 'safe' as const
    },
    {
      id: '6',
      title: '포트폴리오 정리',
      completed: false,
      tag: 'PERSONAL'
    },
    {
      id: 'critical-1',
      title: '제안서 최종 수정',
      completed: false,
      tag: 'BIZ',
      dueDate: 'D-0',
      dueStatus: 'urgent' as const,
      assignedBy: '박지민'
    },
    {
      id: 'critical-2',
      title: 'UI 디자인 검토',
      completed: false,
      tag: 'FRONTEND',
      dueDate: '1일 경과',
      dueStatus: 'urgent' as const,
      assignedBy: '김철수'
    },
    {
      id: 'critical-3',
      title: '서버 부하 테스트',
      completed: false,
      tag: 'WAS',
      dueDate: 'D-1',
      dueStatus: 'urgent' as const
    }
  ])

  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  const toggleTask = (id: string): void => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const deleteTask = (id: string): void => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const editTask = (id: string): void => {
    // TODO: 수정 모달 열기
    console.log('Edit task:', id)
  }

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const urgentTasks = filteredTasks.filter((t) => t.dueStatus === 'urgent' && !t.completed)
  const warningTasks = filteredTasks.filter((t) => t.dueStatus === 'warning' && !t.completed)
  const safeTasks = filteredTasks.filter(
    (t) => (!t.dueStatus || t.dueStatus === 'safe') && !t.completed
  )
  const completedTasks = filteredTasks.filter((t) => t.completed)

  return (
    <div className="h-full overflow-auto bg-white">
      <div className="max-w-[1200px] mx-auto px-8 py-5 space-y-5">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'My Tasks' }]} />

        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">My Tasks</h1>
            <p className="text-sm text-[var(--text-placeholder)] mt-1">
              {tasks.filter((t) => !t.completed).length} tasks remaining
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" icon={<FiSearch size={12} />}>
              Search
              <kbd className="text-[9px] text-[var(--text-muted)] px-1 py-0.5 rounded bg-[var(--bg-secondary)] ml-1">
                ⌘K
              </kbd>
            </Button>
            <Button icon={<FiPlus size={12} strokeWidth={2.5} />}>New</Button>
          </div>
        </header>

        {/* Filter Tabs */}
        <FilterTabs
          options={[
            { value: 'all', label: 'All', count: tasks.length },
            { value: 'active', label: 'Active', count: tasks.filter((t) => !t.completed).length },
            { value: 'completed', label: 'Completed', count: tasks.filter((t) => t.completed).length }
          ]}
          value={filter}
          onChange={setFilter}
        />

        {/* Urgent Tasks */}
        {urgentTasks.length > 0 && (
          <section>
            <SectionHeader title="Urgent" count={urgentTasks.length} dotColor="error" className="mb-2.5" />
            <div className="grid grid-cols-3 gap-3">
              {urgentTasks.map((task) => (
                <TaskItem key={task.id} {...task} onToggle={toggleTask} onClick={onTaskClick} onEdit={editTask} onDelete={deleteTask} />
              ))}
            </div>
          </section>
        )}

        {/* Warning Tasks */}
        {warningTasks.length > 0 && (
          <section>
            <SectionHeader title="Due Soon" count={warningTasks.length} dotColor="warning" className="mb-2.5" />
            <div className="grid grid-cols-3 gap-3">
              {warningTasks.map((task) => (
                <TaskItem key={task.id} {...task} onToggle={toggleTask} onClick={onTaskClick} onEdit={editTask} onDelete={deleteTask} />
              ))}
            </div>
          </section>
        )}

        {/* Safe / Backlog Tasks */}
        {safeTasks.length > 0 && (
          <section>
            <SectionHeader title="Backlog" count={safeTasks.length} className="mb-2.5" />
            <div className="grid grid-cols-3 gap-3">
              {safeTasks.map((task) => (
                <TaskItem key={task.id} {...task} onToggle={toggleTask} onClick={onTaskClick} onEdit={editTask} onDelete={deleteTask} />
              ))}
              <AddTaskCard />
            </div>
          </section>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && filter !== 'active' && (
          <section className="pb-6">
            <SectionHeader title="Completed" count={completedTasks.length} muted className="mb-2.5" />
            <div className="grid grid-cols-3 gap-3">
              {completedTasks.map((task) => (
                <TaskItem key={task.id} {...task} onToggle={toggleTask} onClick={onTaskClick} onEdit={editTask} onDelete={deleteTask} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
