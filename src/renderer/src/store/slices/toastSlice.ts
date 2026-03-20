import type { StateCreator } from 'zustand'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: string
  type: ToastType
  title: string
  message?: string
}

export interface ToastSlice {
  // 상태
  toasts: ToastItem[]

  // 액션
  showToast: (title: string, message?: string, type?: ToastType) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
  removeToast: (id: string) => void
  clearAll: () => void
}

export const createToastSlice: StateCreator<ToastSlice, [], [], ToastSlice> = (set) => {
  const addToast = (title: string, message?: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    set((state) => ({
      toasts: [...state.toasts, { id, type, title, message }]
    }))

    // 3초 후 자동 제거
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }))
    }, 3000)
  }

  return {
    // 초기 상태
    toasts: [],

    // 액션
    showToast: addToast,
    success: (title, message) => addToast(title, message, 'success'),
    error: (title, message) => addToast(title, message, 'error'),
    warning: (title, message) => addToast(title, message, 'warning'),
    info: (title, message) => addToast(title, message, 'info'),

    removeToast: (id) =>
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      })),

    clearAll: () => set({ toasts: [] })
  }
}
