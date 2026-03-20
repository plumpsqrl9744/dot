// Task 관련 타입 정의

export type DueStatus = 'urgent' | 'warning' | 'safe'
export type Importance = 'high' | 'medium' | 'low'
export type TaskViewTab = 'today' | 'upcoming' | 'all' | 'completed'
export type TaskGroupBy = 'importance' | 'category' | 'dueDate' | 'none'
export type TaskSortBy = 'importance' | 'dueDate' | 'createdAt' | 'title'

// 체크리스트 항목
export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

// 하위 태스크
export interface SubTask {
  id: string
  title: string
  completed: boolean
  checklist: ChecklistItem[]
  dueDate?: string
  dueStatus?: DueStatus
}

// 업무 주제 (1:N 구조)
export interface Task {
  id: string
  title: string
  description?: string
  subTasks: SubTask[]
  tag?: string
  dueDate?: string
  dueStatus?: DueStatus
  importance?: Importance
  isMyDay?: boolean
  assignedBy?: string
  createdAt?: string
  completedAt?: string
}

// computed helpers
export function isTaskCompleted(task: Task): boolean {
  return task.subTasks.length > 0 && task.subTasks.every((st) => st.completed)
}

export function getTaskProgress(task: Task): { completed: number; total: number } {
  const total = task.subTasks.length
  const completed = task.subTasks.filter((st) => st.completed).length
  return { completed, total }
}

export function getSubTaskProgress(subTask: SubTask): { completed: number; total: number } {
  const total = subTask.checklist.length
  const completed = subTask.checklist.filter((c) => c.completed).length
  return { completed, total }
}

export interface TaskFormData {
  title: string
  description: string
  tag: string
  dueDateObj: {
    isSameDay: boolean
    startDate: Date | null
    endDate: Date | null
    time: string
  }
  assignedBy: string
}
