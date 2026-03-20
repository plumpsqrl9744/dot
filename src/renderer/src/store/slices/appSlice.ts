import type { StateCreator } from 'zustand'
import type { Page, ViewMode, SidebarMenuItem } from '../../types'
import { DEFAULT_SIDEBAR_MENUS } from '../../constants'

export interface AppSlice {
  // 상태 (What)
  currentPage: Page
  viewMode: ViewMode
  selectedTaskId: string | null
  selectedTemplateId: string | null
  sidebarCollapsed: boolean
  sidebarMenus: SidebarMenuItem[]

  // 액션
  navigate: (page: Page) => void
  selectTask: (taskId: string) => void
  createTask: () => void
  selectTemplate: (templateId: string) => void
  createTemplate: () => void
  goBack: () => void
  toggleSidebar: () => void
  toggleMenuItem: (id: string) => void
}

export const createAppSlice: StateCreator<AppSlice, [], [], AppSlice> = (set) => ({
  // 초기 상태
  currentPage: 'dashboard',
  viewMode: 'list',
  selectedTaskId: null,
  selectedTemplateId: null,
  sidebarCollapsed: false,
  sidebarMenus: DEFAULT_SIDEBAR_MENUS,

  // 액션들 - 상태 전이 로직 캡슐화
  navigate: (page) =>
    set({
      currentPage: page,
      viewMode: 'list',
      selectedTaskId: null,
      selectedTemplateId: null
    }),

  selectTask: (taskId) =>
    set({
      currentPage: 'tasks',
      viewMode: 'detail',
      selectedTaskId: taskId,
      selectedTemplateId: null
    }),

  createTask: () =>
    set({
      currentPage: 'tasks',
      viewMode: 'create',
      selectedTaskId: null,
      selectedTemplateId: null
    }),

  selectTemplate: (templateId) =>
    set({
      currentPage: 'templates',
      viewMode: 'detail',
      selectedTaskId: null,
      selectedTemplateId: templateId
    }),

  createTemplate: () =>
    set({
      currentPage: 'templates',
      viewMode: 'create',
      selectedTaskId: null,
      selectedTemplateId: null
    }),

  goBack: () =>
    set({
      viewMode: 'list',
      selectedTaskId: null,
      selectedTemplateId: null
    }),

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  toggleMenuItem: (id) =>
    set((state) => ({
      sidebarMenus: state.sidebarMenus.map((menu) =>
        menu.id === id ? { ...menu, enabled: !menu.enabled } : menu
      )
    }))
})
