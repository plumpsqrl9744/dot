import { JSX, useMemo } from 'react'
import { FiPlus, FiSearch } from 'react-icons/fi'
import {
  SectionHeader,
  Button,
  FilterTabs,
  Breadcrumb
} from '@renderer/shared/components'
import {
  TaskRow,
  AddTaskCard,
  TodayProgress,
  TaskFilterBar
} from '@renderer/features/tasks'
import { useTasks, useToasts } from '@renderer/store'
import type { Task, TaskGroupBy, TaskSortBy } from '@renderer/types'
import { isTaskCompleted } from '@renderer/types'

interface MyTasksProps {
  onTaskClick?: (taskId: string) => void
  onCreateTask?: () => void
}

// ── Utility functions ──────────────────────────────────────────────

function parseDueDate(dueDate?: string): number {
  if (!dueDate) return Infinity
  if (dueDate.includes('\uACBD\uACFC')) return -(parseInt(dueDate) || 1)
  const match = dueDate.match(/D-(\d+)/)
  if (match) return parseInt(match[1])
  return Infinity
}

const IMPORTANCE_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 }

function sortTasks(tasks: Task[], sortBy: TaskSortBy): Task[] {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'importance': {
        const ai = IMPORTANCE_ORDER[a.importance || ''] ?? 3
        const bi = IMPORTANCE_ORDER[b.importance || ''] ?? 3
        return ai !== bi ? ai - bi : parseDueDate(a.dueDate) - parseDueDate(b.dueDate)
      }
      case 'dueDate':
        return parseDueDate(a.dueDate) - parseDueDate(b.dueDate)
      case 'createdAt':
        return (b.createdAt || '').localeCompare(a.createdAt || '')
      case 'title':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })
}

interface TaskGroup {
  title: string
  dotColor?: 'primary' | 'success' | 'warning' | 'error'
  tasks: Task[]
}

function groupTasks(tasks: Task[], groupBy: TaskGroupBy, sortBy: TaskSortBy): TaskGroup[] {
  if (groupBy === 'none') {
    return tasks.length > 0 ? [{ title: '', tasks: sortTasks(tasks, sortBy) }] : []
  }

  let groups: TaskGroup[]

  switch (groupBy) {
    case 'importance':
      groups = [
        { title: '\uB192\uC74C (High)', dotColor: 'error', tasks: tasks.filter((t) => t.importance === 'high') },
        { title: '\uBCF4\uD1B5 (Medium)', dotColor: 'warning', tasks: tasks.filter((t) => t.importance === 'medium') },
        { title: '\uB0AE\uC74C (Low)', dotColor: 'primary', tasks: tasks.filter((t) => t.importance === 'low') },
        { title: '\uBBF8\uC124\uC815', tasks: tasks.filter((t) => !t.importance) }
      ]
      break

    case 'category': {
      const tagMap: Record<string, Task[]> = {}
      tasks.forEach((t) => {
        const key = t.tag || '\uBBF8\uBD84\uB958'
        if (!tagMap[key]) tagMap[key] = []
        tagMap[key].push(t)
      })
      groups = Object.entries(tagMap)
        .map(([tag, tagTasks]) => ({ title: tag, tasks: tagTasks }))
        .sort((a, b) => b.tasks.length - a.tasks.length)
      break
    }

    case 'dueDate':
      groups = [
        { title: '\uAE30\uD55C \uCD08\uACFC', dotColor: 'error', tasks: tasks.filter((t) => t.dueDate?.includes('\uACBD\uACFC')) },
        { title: '\uC624\uB298', dotColor: 'error', tasks: tasks.filter((t) => t.dueDate === 'D-0') },
        { title: '\uB0B4\uC77C', dotColor: 'warning', tasks: tasks.filter((t) => t.dueDate === 'D-1') },
        {
          title: '\uC774\uBC88 \uC8FC',
          dotColor: 'warning',
          tasks: tasks.filter((t) => {
            const d = parseDueDate(t.dueDate)
            return d >= 2 && d <= 5
          })
        },
        {
          title: '\uB2E4\uC74C \uC8FC \uC774\uD6C4',
          dotColor: 'success',
          tasks: tasks.filter((t) => {
            const d = parseDueDate(t.dueDate)
            return d > 5 && d < Infinity
          })
        },
        { title: '\uB9C8\uAC10\uC77C \uC5C6\uC74C', tasks: tasks.filter((t) => !t.dueDate) }
      ]
      break

    default:
      groups = [{ title: '', tasks }]
  }

  return groups
    .filter((g) => g.tasks.length > 0)
    .map((g) => ({ ...g, tasks: sortTasks(g.tasks, sortBy) }))
}

function isTaskToday(task: Task): boolean {
  return !!(task.isMyDay || task.dueDate === 'D-0' || task.dueDate?.includes('\uACBD\uACFC'))
}

// ── Component ──────────────────────────────────────────────────────

export function MyTasks({ onTaskClick, onCreateTask }: MyTasksProps): JSX.Element {
  const {
    tasks,
    viewTab,
    groupBy,
    sortBy,
    tagFilter,
    setViewTab,
    setGroupBy,
    setSortBy,
    setTagFilter,
    deleteTask,
    toggleMyDay,
    toggleSubTask,
    toggleChecklist
  } = useTasks()
  const { success } = useToasts()

  // Derived data — use computed isTaskCompleted
  const activeTasks = useMemo(() => tasks.filter((t) => !isTaskCompleted(t)), [tasks])
  const completedTasksList = useMemo(() => tasks.filter((t) => isTaskCompleted(t)), [tasks])

  const filteredByView = useMemo(() => {
    switch (viewTab) {
      case 'today':
        return tasks.filter((t) => isTaskToday(t) && !isTaskCompleted(t))
      case 'upcoming':
        return activeTasks.filter((t) => {
          if (!t.dueDate) return false
          const d = parseDueDate(t.dueDate)
          return d > 0 && d < Infinity
        })
      case 'all':
        return activeTasks
      case 'completed':
        return completedTasksList
      default:
        return activeTasks
    }
  }, [tasks, activeTasks, completedTasksList, viewTab])

  const filteredByTag = useMemo(() => {
    if (!tagFilter) return filteredByView
    return filteredByView.filter((t) => t.tag === tagFilter)
  }, [filteredByView, tagFilter])

  const taskGroups = useMemo(
    () => groupTasks(filteredByTag, groupBy, sortBy),
    [filteredByTag, groupBy, sortBy]
  )

  const availableTags = useMemo(() => {
    const tags = new Set<string>()
    tasks.forEach((t) => {
      if (t.tag) tags.add(t.tag)
    })
    return Array.from(tags).sort()
  }, [tasks])

  // Today progress
  const todayTasks = useMemo(() => tasks.filter(isTaskToday), [tasks])
  const todayCompleted = useMemo(
    () => todayTasks.filter((t) => isTaskCompleted(t)).length,
    [todayTasks]
  )

  // Tab counts
  const todayCount = tasks.filter((t) => isTaskToday(t) && !isTaskCompleted(t)).length
  const upcomingCount = activeTasks.filter((t) => {
    if (!t.dueDate) return false
    const d = parseDueDate(t.dueDate)
    return d > 0 && d < Infinity
  }).length

  const handleToggleMyDay = (id: string): void => {
    const task = tasks.find((t) => t.id === id)
    if (task && !task.isMyDay) {
      success('\uC624\uB298 \uD560 \uC77C\uC5D0 \uCD94\uAC00\uD588\uC2B5\uB2C8\uB2E4')
    }
    toggleMyDay(id)
  }

  const editTask = (id: string): void => {
    onTaskClick?.(id)
  }

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-[1200px] mx-auto px-8 py-5 space-y-5">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'My Tasks' }]} />

        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">My Tasks</h1>
            <p className="text-sm text-[var(--text-placeholder)] mt-1">
              {activeTasks.length} tasks remaining
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" icon={<FiSearch size={12} />}>
              Search
              <kbd className="text-[9px] text-[var(--text-muted)] px-1 py-0.5 rounded bg-[var(--bg-secondary)] ml-1">
                \u2318K
              </kbd>
            </Button>
            <Button icon={<FiPlus size={12} strokeWidth={2.5} />} onClick={onCreateTask}>
              New
            </Button>
          </div>
        </header>

        {/* Today Progress (only in today view) */}
        {viewTab === 'today' && (
          <TodayProgress completed={todayCompleted} total={todayTasks.length} tasks={todayTasks} />
        )}

        {/* View Tabs */}
        <FilterTabs
          options={[
            { value: 'today' as const, label: '\uC624\uB298', count: todayCount },
            { value: 'upcoming' as const, label: '\uC608\uC815', count: upcomingCount },
            { value: 'all' as const, label: '\uC804\uCCB4', count: activeTasks.length },
            { value: 'completed' as const, label: '\uC644\uB8CC', count: completedTasksList.length }
          ]}
          value={viewTab}
          onChange={setViewTab}
        />

        {/* Filter Bar */}
        <TaskFilterBar
          groupBy={groupBy}
          sortBy={sortBy}
          tagFilter={tagFilter}
          availableTags={availableTags}
          onGroupByChange={setGroupBy}
          onSortByChange={setSortBy}
          onTagFilterChange={setTagFilter}
        />

        {/* Task Sections — vertical list */}
        {taskGroups.length === 0 ? (
          <EmptyState viewTab={viewTab} onCreateTask={onCreateTask} />
        ) : (
          taskGroups.map((group) => (
            <section key={group.title || '__flat'}>
              {group.title && (
                <SectionHeader
                  title={group.title}
                  count={group.tasks.length}
                  muted={viewTab === 'completed'}
                  className="mb-2.5"
                />
              )}
              <div className="flex flex-col gap-2">
                {group.tasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onToggleSubTask={toggleSubTask}
                    onToggleChecklist={toggleChecklist}
                    onClick={onTaskClick}
                    onEdit={editTask}
                    onDelete={deleteTask}
                    onToggleMyDay={handleToggleMyDay}
                  />
                ))}
              </div>
            </section>
          ))
        )}

        {/* Add Task Card (only in "all" view when tasks exist) */}
        {viewTab === 'all' && taskGroups.length > 0 && (
          <AddTaskCard onClick={onCreateTask} />
        )}
      </div>
    </div>
  )
}

// ── Empty State ────────────────────────────────────────────────────

function EmptyState({
  viewTab,
  onCreateTask
}: {
  viewTab: string
  onCreateTask?: () => void
}): JSX.Element {
  const messages: Record<string, { title: string; desc: string }> = {
    today: {
      title: '오늘 할 일이 없습니다',
      desc: '우클릭 메뉴에서 오늘 할 일을 추가해보세요'
    },
    upcoming: {
      title: '예정된 태스크가 없습니다',
      desc: '마감일이 있는 태스크가 여기에 표시됩니다'
    },
    all: {
      title: '태스크가 없습니다',
      desc: '새로운 태스크를 만들어보세요'
    },
    completed: {
      title: '완료된 태스크가 없습니다',
      desc: '태스크를 완료하면 여기에 표시됩니다'
    }
  }
  const msg = messages[viewTab] || messages.all

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-1">{msg.title}</h3>
      <p className="text-xs text-[var(--text-placeholder)] mb-4">{msg.desc}</p>
      {viewTab === 'all' && (
        <Button icon={<FiPlus size={12} />} onClick={onCreateTask}>
          New Task
        </Button>
      )}
    </div>
  )
}
