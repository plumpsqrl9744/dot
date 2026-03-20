import type { StateCreator } from 'zustand'
import type { Task, SubTask, ChecklistItem, TaskViewTab, TaskGroupBy, TaskSortBy } from '../../types'
import { MOCK_TASKS } from '../../constants'

export interface TaskSlice {
  // 상태
  tasks: Task[]
  viewTab: TaskViewTab
  groupBy: TaskGroupBy
  sortBy: TaskSortBy
  tagFilter: string | null

  // 액션
  setViewTab: (tab: TaskViewTab) => void
  setGroupBy: (groupBy: TaskGroupBy) => void
  setSortBy: (sortBy: TaskSortBy) => void
  setTagFilter: (tag: string | null) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  getTaskById: (id: string) => Task | undefined
  toggleMyDay: (id: string) => void
  setImportance: (id: string, importance: Task['importance']) => void
  // SubTask 액션
  toggleSubTask: (taskId: string, subTaskId: string) => void
  addSubTask: (taskId: string, subTask: SubTask) => void
  deleteSubTask: (taskId: string, subTaskId: string) => void
  // Checklist 액션
  toggleChecklist: (taskId: string, subTaskId: string, checklistId: string) => void
  addChecklist: (taskId: string, subTaskId: string, item: ChecklistItem) => void
  deleteChecklist: (taskId: string, subTaskId: string, checklistId: string) => void
}

const viewDefaults: Record<TaskViewTab, { groupBy: TaskGroupBy; sortBy: TaskSortBy }> = {
  today: { groupBy: 'importance', sortBy: 'importance' },
  upcoming: { groupBy: 'dueDate', sortBy: 'dueDate' },
  all: { groupBy: 'importance', sortBy: 'importance' },
  completed: { groupBy: 'none', sortBy: 'importance' }
}

export const createTaskSlice: StateCreator<TaskSlice, [], [], TaskSlice> = (set, get) => ({
  // 초기 상태
  tasks: MOCK_TASKS,
  viewTab: 'today',
  groupBy: 'importance',
  sortBy: 'importance',
  tagFilter: null,

  // 뷰 액션
  setViewTab: (viewTab) => {
    const defaults = viewDefaults[viewTab]
    set({ viewTab, groupBy: defaults.groupBy, sortBy: defaults.sortBy, tagFilter: null })
  },
  setGroupBy: (groupBy) => set({ groupBy }),
  setSortBy: (sortBy) => set({ sortBy }),
  setTagFilter: (tagFilter) => set({ tagFilter }),

  // Task CRUD
  addTask: (task) =>
    set((state) => ({ tasks: [...state.tasks, task] })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t))
    })),

  deleteTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

  getTaskById: (id) => get().tasks.find((t) => t.id === id),

  toggleMyDay: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, isMyDay: !t.isMyDay } : t
      )
    })),

  setImportance: (id, importance) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, importance } : t))
    })),

  // SubTask 액션 — 토글 시 하위 Checklist도 함께 변경
  toggleSubTask: (taskId, subTaskId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subTasks: t.subTasks.map((st) => {
                if (st.id !== subTaskId) return st
                const newCompleted = !st.completed
                return {
                  ...st,
                  completed: newCompleted,
                  checklist: st.checklist.map((c) => ({ ...c, completed: newCompleted }))
                }
              })
            }
          : t
      )
    })),

  addSubTask: (taskId, subTask) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, subTasks: [...t.subTasks, subTask] } : t
      )
    })),

  deleteSubTask: (taskId, subTaskId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, subTasks: t.subTasks.filter((st) => st.id !== subTaskId) }
          : t
      )
    })),

  // Checklist 액션
  toggleChecklist: (taskId, subTaskId, checklistId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subTasks: t.subTasks.map((st) =>
                st.id === subTaskId
                  ? {
                      ...st,
                      checklist: st.checklist.map((c) =>
                        c.id === checklistId ? { ...c, completed: !c.completed } : c
                      )
                    }
                  : st
              )
            }
          : t
      )
    })),

  addChecklist: (taskId, subTaskId, item) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subTasks: t.subTasks.map((st) =>
                st.id === subTaskId
                  ? { ...st, checklist: [...st.checklist, item] }
                  : st
              )
            }
          : t
      )
    })),

  deleteChecklist: (taskId, subTaskId, checklistId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subTasks: t.subTasks.map((st) =>
                st.id === subTaskId
                  ? { ...st, checklist: st.checklist.filter((c) => c.id !== checklistId) }
                  : st
              )
            }
          : t
      )
    }))
})
