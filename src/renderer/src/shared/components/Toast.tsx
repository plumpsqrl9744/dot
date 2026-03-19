import { JSX, useEffect, useState } from 'react'
import { FiCheck, FiX, FiAlertCircle, FiInfo, FiBell } from 'react-icons/fi'

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'notification'

export interface ToastProps {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

const typeConfig = {
  success: {
    icon: FiCheck,
    bgColor: 'bg-[#22C55E]',
    iconBg: 'bg-white/20'
  },
  error: {
    icon: FiX,
    bgColor: 'bg-[#EF4444]',
    iconBg: 'bg-white/20'
  },
  warning: {
    icon: FiAlertCircle,
    bgColor: 'bg-[#F59E0B]',
    iconBg: 'bg-white/20'
  },
  info: {
    icon: FiInfo,
    bgColor: 'bg-[#3B82F6]',
    iconBg: 'bg-white/20'
  },
  notification: {
    icon: FiBell,
    bgColor: 'bg-[#6366F1]',
    iconBg: 'bg-white/20'
  }
}

export function Toast({ id, type, title, message, duration = 4000, onClose }: ToastProps): JSX.Element {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const config = typeConfig[type]
  const Icon = config.icon

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => {
      setIsVisible(true)
    })

    // Auto close
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = (): void => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose(id)
    }, 300)
  }

  return (
    <div
      className={`flex items-start gap-3 w-[320px] p-4 rounded-lg shadow-lg text-white transition-all duration-300 ease-out ${config.bgColor} ${
        isVisible && !isLeaving
          ? 'translate-x-0 opacity-100'
          : '-translate-x-full opacity-0'
      }`}
    >
      {/* Icon */}
      <div className={`shrink-0 w-8 h-8 rounded-full ${config.iconBg} flex items-center justify-center`}>
        <Icon size={16} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-sm font-semibold">{title}</p>
        {message && (
          <p className="text-xs text-white/80 mt-0.5 line-clamp-2">{message}</p>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="shrink-0 w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
      >
        <FiX size={14} />
      </button>
    </div>
  )
}

// Toast Container - 좌측 하단에 고정
export function ToastContainer({ toasts, onClose }: {
  toasts: Omit<ToastProps, 'onClose'>[]
  onClose: (id: string) => void
}): JSX.Element {
  return (
    <div className="fixed bottom-5 left-5 z-[9999] flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  )
}

export type { ToastProps as ToastItem }
