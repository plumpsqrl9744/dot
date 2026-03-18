import { useOnlineStatus } from '../../hooks/useOnlineStatus'

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
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  },
  {
    id: 'tasks',
    label: 'My Tasks',
    icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    badge: 3
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5'
  }
]

const WORKSPACE_ITEMS = [
  {
    id: 'projects',
    label: 'Projects',
    icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z'
  },
  {
    id: 'team',
    label: 'Team',
    icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.43.992a6.759 6.759 0 010 .255c-.008.378.137.75.43.99l1.004.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c-.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
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
            <svg
              style={{ width: 16, height: 16 }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
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
              <svg
                style={{ width: 16, height: 16 }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
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
                <svg
                  style={{ width: 18, height: 18, flexShrink: 0 }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
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
              <svg
                style={{ width: 14, height: 14 }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
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
              <svg
                style={{ width: 18, height: 18, flexShrink: 0 }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
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
            <svg
              style={{ width: 16, height: 16, color: 'rgba(32,33,36,0.3)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
              />
            </svg>
          )}
        </button>
      </div>
    </aside>
  )
}
