import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import { FiHome, FiCheckSquare, FiCalendar, FiUsers, FiSettings, FiChevronLeft, FiPlus, FiFileText } from 'react-icons/fi'
import { LuChevronsUpDown } from 'react-icons/lu'
import { Avatar } from '@renderer/shared/components'
import type { SidebarMenuItem } from '../../App'
import { IconType } from 'react-icons'

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
  collapsed: boolean
  onToggle: () => void
  menuItems: SidebarMenuItem[]
}

interface NavItemConfig {
  id: string
  label: string
  icon: IconType
  badge?: number
  section: 'main' | 'workspace'
}

const ALL_NAV_ITEMS: NavItemConfig[] = [
  { id: 'dashboard', label: 'Home', icon: FiHome, section: 'main' },
  { id: 'tasks', label: 'My Tasks', icon: FiCheckSquare, badge: 3, section: 'main' },
  { id: 'calendar', label: 'Calendar', icon: FiCalendar, section: 'main' },
  { id: 'templates', label: 'Templates', icon: FiFileText, section: 'main' },
  { id: 'team', label: 'Team', icon: FiUsers, section: 'workspace' },
  { id: 'settings', label: 'Settings', icon: FiSettings, section: 'workspace' }
]

export function Sidebar({
  currentPage,
  onNavigate,
  collapsed,
  onToggle,
  menuItems
}: SidebarProps): React.JSX.Element {
  const isOnline = useOnlineStatus()

  // Filter items based on enabled state from menuItems
  const enabledIds = new Set(menuItems.filter((m) => m.enabled).map((m) => m.id))
  const mainItems = ALL_NAV_ITEMS.filter((item) => item.section === 'main' && enabledIds.has(item.id))
  const workspaceItems = ALL_NAV_ITEMS.filter((item) => item.section === 'workspace' && enabledIds.has(item.id))

  return (
    <aside
      className="h-screen flex flex-col bg-[var(--bg-secondary)] border-r border-[var(--border-default)] transition-[width] duration-200 ease-out overflow-hidden"
      style={{ width: collapsed ? 68 : 240 }}
    >
      {/* Header */}
      <div
        className="titlebar flex items-center shrink-0 h-[52px] px-3"
      >
        <div
          className={`flex items-center gap-2 min-w-0 flex-1 ${collapsed ? 'justify-center cursor-pointer' : ''}`}
          onClick={collapsed ? onToggle : undefined}
        >
          {/* Logo Dot */}
          <div className="w-6 h-6 relative shrink-0">
            <div className="absolute inset-0 rounded-full border-2 border-primary" />
            <div className="absolute inset-[3px] rounded-full bg-primary" />
          </div>
          <span
            className={`font-semibold text-[15px] text-text-primary whitespace-nowrap transition-opacity duration-200 ${
              collapsed ? 'opacity-0 w-0' : 'opacity-100'
            }`}
          >
            dot.
          </span>
        </div>
        <button
          onClick={onToggle}
          className={`w-7 h-7 flex items-center justify-center rounded-md bg-transparent text-text-placeholder hover:text-text-secondary transition-all duration-200 shrink-0 ${
            collapsed ? 'opacity-0 w-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <FiChevronLeft size={16} strokeWidth={2} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3">
        {/* Main Items */}
        {mainItems.length > 0 && (
          <div className="flex flex-col gap-1">
            {mainItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full h-9 flex items-center gap-2.5 rounded-md text-[13px] font-medium transition-colors ${
                  collapsed ? 'justify-center px-0' : 'justify-between px-3'
                } ${
                  currentPage === item.id
                    ? 'bg-primary/10 text-primary'
                    : 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <item.icon size={18} strokeWidth={1.5} className="shrink-0" />
                  <span
                    className={`whitespace-nowrap transition-opacity duration-200 ${
                      collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {item.badge && (
                  <span
                    className={`h-[18px] px-1.5 text-[11px] font-semibold rounded bg-primary text-white flex items-center justify-center shrink-0 transition-opacity duration-200 ${
                      collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Workspace Section */}
        {workspaceItems.length > 0 && (
          <>
            <div className={`mt-6 mb-2 flex items-center justify-between h-7 px-3 transition-opacity duration-200 ${
              collapsed ? 'opacity-0 h-0 mt-0 mb-0 overflow-hidden' : 'opacity-100'
            }`}>
              <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider whitespace-nowrap">
                Workspace
              </span>
              <button className="w-5 h-5 flex items-center justify-center rounded bg-transparent text-text-muted hover:text-text-secondary transition-colors">
                <FiPlus size={14} strokeWidth={2} />
              </button>
            </div>

            {/* Divider for collapsed state */}
            <div className={`border-t border-[var(--border-default)] transition-all duration-200 ${
              collapsed ? 'my-4 opacity-100' : 'my-0 opacity-0 h-0'
            }`} />

            {/* Workspace Items */}
            <div className="flex flex-col gap-1">
              {workspaceItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full h-9 flex items-center gap-2.5 rounded-md text-[13px] font-medium transition-colors ${
                    collapsed ? 'justify-center px-0' : 'px-3'
                  } ${
                    currentPage === item.id
                      ? 'bg-primary/10 text-primary'
                      : 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                  }`}
                >
                  <item.icon size={18} strokeWidth={1.5} className="shrink-0" />
                  <span
                    className={`whitespace-nowrap transition-opacity duration-200 ${
                      collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </nav>

      {/* User Profile */}
      <div className="border-t border-[var(--border-default)] p-3 shrink-0">
        <button
          className={`w-full h-11 flex items-center gap-2.5 rounded-lg bg-transparent transition-colors ${
            collapsed ? 'justify-center px-0' : 'justify-between px-3'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar
              name="U"
              size="md"
              status={isOnline ? 'online' : 'offline'}
              gradient
            />
            <div
              className={`text-left whitespace-nowrap transition-opacity duration-200 ${
                collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
              }`}
            >
              <p className="text-[13px] font-medium text-text-primary">User</p>
              <p className="text-[11px] text-text-placeholder">
                {isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <LuChevronsUpDown
            size={16}
            className={`text-text-muted shrink-0 transition-opacity duration-200 ${
              collapsed ? 'opacity-0 w-0' : 'opacity-100'
            }`}
          />
        </button>
      </div>
    </aside>
  )
}
