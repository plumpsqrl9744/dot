import { useState, useCallback } from 'react'
import type { ToastType } from '@renderer/shared/components/Toast'

interface ToastItem {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface UseToastReturn {
  toasts: ToastItem[]
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void
  removeToast: (id: string) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
  notification: (title: string, message?: string) => void
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback((
    type: ToastType,
    title: string,
    message?: string,
    duration?: number
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
    setToasts((prev) => [...prev, { id, type, title, message, duration }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const success = useCallback((title: string, message?: string) => {
    showToast('success', title, message)
  }, [showToast])

  const error = useCallback((title: string, message?: string) => {
    showToast('error', title, message)
  }, [showToast])

  const warning = useCallback((title: string, message?: string) => {
    showToast('warning', title, message)
  }, [showToast])

  const info = useCallback((title: string, message?: string) => {
    showToast('info', title, message)
  }, [showToast])

  const notification = useCallback((title: string, message?: string) => {
    showToast('notification', title, message)
  }, [showToast])

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info,
    notification
  }
}
