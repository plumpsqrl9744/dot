import { useState } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { Dashboard } from './pages/Dashboard'

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  tasks: 'My Tasks',
  calendar: 'Calendar',
  projects: 'Projects',
  team: 'Team',
  settings: 'Settings'
}

function App(): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleNavigate = (page: string): void => {
    setCurrentPage(page)
  }

  const toggleSidebar = (): void => {
    setSidebarCollapsed((prev) => !prev)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={pageTitles[currentPage] || 'Dashboard'} onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-hidden">
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage !== 'dashboard' && (
            <div className="flex items-center justify-center h-full text-placeholder">
              {pageTitles[currentPage]} page coming soon...
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
