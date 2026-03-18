import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import {
  FiHome,
  FiCheckSquare,
  FiCalendar,
  FiFolder,
  FiUsers,
  FiSettings,
  FiChevronLeft,
  FiSearch,
  FiPlus
} from 'react-icons/fi'
import { LuChevronsUpDown } from 'react-icons/lu'

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
  collapsed: boolean
  onToggle: () => void
}

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Home',
    icon: FiHome
  },
  {
    id: 'tasks',
    label: 'My Tasks',
    icon: FiCheckSquare,
    badge: 3
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: FiCalendar
  }
]

const WORKSPACE_ITEMS = [
  {
    id: 'projects',
    label: 'Projects',
    icon: FiFolder
  },
  {
    id: 'team',
    label: 'Team',
    icon: FiUsers
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: FiSettings
  }
]

export function Sidebar({
  currentPage,
  onNavigate,
  collapsed,
  onToggle
}: SidebarProps): React.JSX.Element {
  const isOnline = useOnlineStatus()

  const baseButtonStyle = {
    width: '100%',
    height: 36,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    paddingLeft: collapsed ? 0 : 12,
    paddingRight: collapsed ? 0 : 12,
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    transition: 'all 0.15s'
  }

  return (
    <aside
      style={{
        width: collapsed ? 68 : 240,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F7F7F7',
        borderRight: '1px solid rgba(0,0,0,0.1)',
        transition: 'width 0.3s'
      }}
    >
      {/* Header */}
      <div
        className="titlebar"
        style={{
          height: 52,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: collapsed ? '0 12px' : '0 14px'
        }}
      >
        {!collapsed && (
          <button
            onClick={onToggle}
            style={{
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
              border: 'none',
              background: 'transparent',
              color: 'rgba(32,33,36,0.4)',
              cursor: 'pointer'
            }}
          >
            <FiChevronLeft style={{ width: 16, height: 16 }} strokeWidth={2} />
          </button>
        )}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: collapsed ? 'pointer' : 'default'
          }}
          onClick={collapsed ? onToggle : undefined}
        >
          <div style={{ width: 24, height: 24, position: 'relative', flexShrink: 0 }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '2px solid #007AFF'
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 3,
                borderRadius: '50%',
                backgroundColor: '#007AFF'
              }}
            />
          </div>
          {!collapsed && (
            <span style={{ fontWeight: 600, fontSize: 15, color: '#202124' }}>dot.</span>
          )}
        </div>
      </div>

      {/* Search */}
      {!collapsed && (
        <div style={{ padding: '0 14px', marginBottom: 8 }}>
          <button
            style={{
              ...baseButtonStyle,
              justifyContent: 'space-between',
              color: 'rgba(32,33,36,0.4)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FiSearch style={{ width: 16, height: 16 }} strokeWidth={1.5} />
              <span>Search</span>
            </div>
            <kbd
              style={{
                fontSize: 10,
                color: 'rgba(32,33,36,0.3)',
                padding: '2px 6px',
                borderRadius: 4,
                border: '1px solid rgba(0,0,0,0.1)',
                background: 'rgba(255,255,255,0.5)'
              }}
            >
              ⌘K
            </kbd>
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: collapsed ? '12px 12px' : '12px 14px' }}>
        {/* Main Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              style={{
                ...baseButtonStyle,
                justifyContent: collapsed ? 'center' : 'space-between',
                backgroundColor: currentPage === item.id ? 'rgba(0,122,255,0.1)' : 'transparent',
                color: currentPage === item.id ? '#007AFF' : 'rgba(32,33,36,0.6)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <item.icon style={{ width: 18, height: 18, flexShrink: 0 }} strokeWidth={1.5} />
                {!collapsed && <span>{item.label}</span>}
              </div>
              {!collapsed && item.badge && (
                <span
                  style={{
                    height: 18,
                    padding: '0 6px',
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: 4,
                    backgroundColor: '#007AFF',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Workspace Section */}
        {!collapsed ? (
          <div
            style={{
              marginTop: 24,
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: 28,
              paddingLeft: 12,
              paddingRight: 12
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: 'rgba(32,33,36,0.35)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Workspace
            </span>
            <button
              style={{
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
                border: 'none',
                background: 'transparent',
                color: 'rgba(32,33,36,0.3)',
                cursor: 'pointer'
              }}
            >
              <FiPlus style={{ width: 14, height: 14 }} strokeWidth={2} />
            </button>
          </div>
        ) : (
          <div style={{ margin: '16px 0', borderTop: '1px solid rgba(0,0,0,0.1)' }} />
        )}

        {/* Workspace Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {WORKSPACE_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              style={{
                ...baseButtonStyle,
                justifyContent: collapsed ? 'center' : 'flex-start',
                backgroundColor: currentPage === item.id ? 'rgba(0,122,255,0.1)' : 'transparent',
                color: currentPage === item.id ? '#007AFF' : 'rgba(32,33,36,0.6)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <item.icon style={{ width: 18, height: 18, flexShrink: 0 }} strokeWidth={1.5} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div
        style={{ borderTop: '1px solid rgba(0,0,0,0.1)', padding: collapsed ? 12 : '12px 14px' }}
      >
        <button
          style={{
            width: '100%',
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            gap: 10,
            paddingLeft: collapsed ? 0 : 12,
            paddingRight: collapsed ? 0 : 12,
            borderRadius: 8,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #007AFF, #5494F3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 500
                }}
              >
                U
              </div>
              <span
                style={{
                  position: 'absolute',
                  bottom: -2,
                  right: -2,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  border: '2px solid #F7F7F7',
                  backgroundColor: isOnline ? '#22C55E' : 'rgba(32,33,36,0.3)'
                }}
              />
            </div>
            {!collapsed && (
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#202124', margin: 0 }}>User</p>
                <p style={{ fontSize: 11, color: 'rgba(32,33,36,0.4)', margin: 0 }}>
                  {isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            )}
          </div>
          {!collapsed && (
            <LuChevronsUpDown style={{ width: 16, height: 16, color: 'rgba(32,33,36,0.3)' }} />
          )}
        </button>
      </div>
    </aside>
  )
}
