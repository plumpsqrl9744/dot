// Navigation 및 App 상태 타입 정의

export type Page = 'dashboard' | 'tasks' | 'calendar' | 'templates' | 'team' | 'settings' | 'mail'

export type ViewMode = 'list' | 'detail' | 'create'

export interface AppState {
  currentPage: Page
  viewMode: ViewMode
  selectedTaskId: string | null
  selectedTemplateId: string | null
  sidebarCollapsed: boolean
}

export interface SidebarMenuItem {
  id: string
  label: string
  enabled: boolean
}

// App Actions - 선언형 상태 전이
export type AppAction =
  | { type: 'NAVIGATE'; page: Page }
  | { type: 'SELECT_TASK'; taskId: string }
  | { type: 'CREATE_TASK' }
  | { type: 'SELECT_TEMPLATE'; templateId: string }
  | { type: 'CREATE_TEMPLATE' }
  | { type: 'BACK' }
  | { type: 'TOGGLE_SIDEBAR' }
