import { useState, useRef, useEffect } from 'react'
import { FiSearch, FiSettings, FiBell, FiMenu, FiCheck, FiClock, FiAlertCircle, FiUserPlus } from 'react-icons/fi'
import { VscChromeMinimize, VscChromeMaximize, VscChromeRestore, VscChromeClose } from 'react-icons/vsc'
import { Avatar } from '@renderer/shared/components'

interface Notification {
  id: string
  type: 'task_assigned' | 'task_due' | 'task_completed' | 'team_invite'
  title: string
  description: string
  time: string
  read: boolean
  from?: string
}

interface HeaderProps {
  title: string
  onToggleSidebar?: () => void
  onNavigateToSettings?: () => void
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'task_assigned',
    title: '새 태스크 배정',
    description: '김철수님이 "UI 디자인 검토" 태스크를 배정했습니다.',
    time: '5분 전',
    read: false,
    from: '김철수'
  },
  {
    id: '2',
    type: 'task_due',
    title: '마감 임박',
    description: '"제안서 최종 수정" 태스크가 오늘 마감입니다.',
    time: '30분 전',
    read: false
  },
  {
    id: '3',
    type: 'task_completed',
    title: '태스크 완료',
    description: '이영희님이 "서버 배포" 태스크를 완료했습니다.',
    time: '1시간 전',
    read: true,
    from: '이영희'
  },
  {
    id: '4',
    type: 'team_invite',
    title: '팀 초대',
    description: '박서준님이 "Design Team"에 초대했습니다.',
    time: '2시간 전',
    read: true,
    from: '박서준'
  },
  {
    id: '5',
    type: 'task_due',
    title: '마감 임박',
    description: '"마케팅 미팅 회의록" 태스크 마감이 D-1 입니다.',
    time: '3시간 전',
    read: true
  }
]

const notificationIcons = {
  task_assigned: <FiUserPlus size={14} />,
  task_due: <FiAlertCircle size={14} />,
  task_completed: <FiCheck size={14} />,
  team_invite: <FiUserPlus size={14} />
}

const notificationColors = {
  task_assigned: 'text-[var(--primary)] bg-[var(--primary)]/10',
  task_due: 'text-[var(--error)] bg-[var(--error)]/10',
  task_completed: 'text-[var(--success)] bg-[var(--success)]/10',
  team_invite: 'text-[var(--primary)] bg-[var(--primary)]/10'
}

function WindowControls(): React.JSX.Element {
  const [isMaximized, setIsMaximized] = useState(false)
  const [hovered, setHovered] = useState<'minimize' | 'maximize' | 'close' | null>(null)

  useEffect(() => {
    window.api.isMaximized().then(setIsMaximized)
    const unsubscribe = window.api.onMaximizedChange(setIsMaximized)
    return unsubscribe
  }, [])

  return (
    <div className="flex items-center gap-2 px-3">
      {/* Minimize - Yellow */}
      <button
        onClick={() => window.api.minimizeWindow()}
        onMouseEnter={() => setHovered('minimize')}
        onMouseLeave={() => setHovered(null)}
        className="w-3 h-3 rounded-full flex items-center justify-center transition-all bg-[#FBBF24] hover:bg-[#F59E0B] hover:scale-110"
        title="최소화"
      >
        {hovered === 'minimize' && <VscChromeMinimize size={7} className="text-[#78350F]" />}
      </button>

      {/* Maximize - Green */}
      <button
        onClick={() => window.api.maximizeWindow()}
        onMouseEnter={() => setHovered('maximize')}
        onMouseLeave={() => setHovered(null)}
        className="w-3 h-3 rounded-full flex items-center justify-center transition-all bg-[#34D399] hover:bg-[#10B981] hover:scale-110"
        title={isMaximized ? '복원' : '최대화'}
      >
        {hovered === 'maximize' && (
          isMaximized
            ? <VscChromeRestore size={7} className="text-[#064E3B]" />
            : <VscChromeMaximize size={7} className="text-[#064E3B]" />
        )}
      </button>

      {/* Close - Red */}
      <button
        onClick={() => window.api.closeWindow()}
        onMouseEnter={() => setHovered('close')}
        onMouseLeave={() => setHovered(null)}
        className="w-3 h-3 rounded-full flex items-center justify-center transition-all bg-[#F87171] hover:bg-[#EF4444] hover:scale-110"
        title="닫기"
      >
        {hovered === 'close' && <VscChromeClose size={7} className="text-[#7F1D1D]" />}
      </button>
    </div>
  )
}

export function Header({ onToggleSidebar, onNavigateToSettings }: HeaderProps): React.JSX.Element {
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAllAsRead = (): void => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleMarkAsRead = (id: string): void => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  return (
    <header className="h-12 bg-white border-b border-[var(--border-light)] flex items-center justify-between shrink-0">
      {/* Left Section */}
      <div className="flex items-center h-full">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="w-7 h-7 ml-4 rounded-md hover:bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-placeholder)] hover:text-[var(--text-secondary)] transition-colors lg:hidden"
          >
            <FiMenu size={16} strokeWidth={1.5} />
          </button>
        )}

        {/* Search Bar */}
        <div className="titlebar flex items-center h-full px-4">
          <div className="relative max-w-sm w-64">
            <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-placeholder)]" size={14} />
            <input
              type="text"
              placeholder="검색..."
              className="w-full h-7 pl-8 pr-3 bg-[var(--bg-secondary)] border border-transparent rounded-md text-xs text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] transition-all focus:bg-white focus:border-[var(--border-default)] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Center - Drag Region */}
      <div className="titlebar flex-1 h-full" />

      {/* Right Section */}
      <div className="flex items-center h-full">
        {/* Actions */}
        <div className="flex items-center gap-1 px-3">
          {/* Notifications */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                showNotifications
                  ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                  : 'hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              <FiBell size={16} strokeWidth={1.5} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--error)] rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-[var(--border-default)] shadow-xl z-50 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-light)] bg-gradient-to-r from-[var(--bg-secondary)] to-white">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">알림</h3>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-[var(--primary)] to-[#818CF8] text-white rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-[var(--primary)] hover:underline font-medium"
                    >
                      모두 읽음
                    </button>
                  )}
                </div>

                {/* Notification List */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-sm text-[var(--text-muted)]">
                      알림이 없습니다.
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleMarkAsRead(notification.id)}
                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-[var(--bg-hover)] ${
                          !notification.read ? 'bg-gradient-to-r from-[var(--primary)]/5 to-transparent' : ''
                        }`}
                      >
                        {notification.from ? (
                          <Avatar name={notification.from} size="sm" gradient />
                        ) : (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notificationColors[notification.type]}`}>
                            {notificationIcons[notification.type]}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-medium ${!notification.read ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                              {notification.title}
                            </span>
                            {!notification.read && (
                              <span className="w-1.5 h-1.5 bg-gradient-to-r from-[var(--primary)] to-[#818CF8] rounded-full shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">
                            {notification.description}
                          </p>
                          <div className="flex items-center gap-1 mt-1 text-[10px] text-[var(--text-placeholder)]">
                            <FiClock size={10} />
                            <span>{notification.time}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-[var(--border-light)] px-4 py-2.5 bg-gradient-to-r from-white to-[var(--bg-secondary)]">
                  <button className="w-full text-xs text-center text-[var(--primary)] hover:text-[var(--primary-hover)] py-1 font-medium">
                    모든 알림 보기
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Global Settings */}
          <button
            onClick={onNavigateToSettings}
            className="w-8 h-8 rounded-lg hover:bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            <FiSettings size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-[var(--border-default)]" />

        {/* Window Controls - Right Side */}
        <WindowControls />
      </div>
    </header>
  )
}
