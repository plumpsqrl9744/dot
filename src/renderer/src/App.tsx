import { useState } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { Dashboard } from './pages/Dashboard'
import { MyTasks } from './pages/MyTasks'
import { Calendar } from './pages/Calendar'
import { TaskDetail } from './pages/TaskDetail'
import { MyTeam } from './pages/MyTeam'
import { Settings } from './pages/Settings'
import { Templates } from './pages/Templates'
import { TemplateDetail } from './pages/TemplateDetail'
import { ToastContainer } from './shared/components'
import { useToast } from './hooks/useToast'

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  tasks: 'My Tasks',
  calendar: 'Calendar',
  projects: 'Projects',
  team: 'Team',
  templates: 'Templates',
  settings: 'Settings'
}

export interface SidebarMenuItem {
  id: string
  label: string
  enabled: boolean
}

const defaultSidebarMenus: SidebarMenuItem[] = [
  { id: 'dashboard', label: 'Home', enabled: true },
  { id: 'tasks', label: 'My Tasks', enabled: true },
  { id: 'calendar', label: 'Calendar', enabled: true },
  { id: 'templates', label: 'Templates', enabled: true },
  { id: 'team', label: 'Team', enabled: true },
  { id: 'settings', label: 'Settings', enabled: true }
]

function App(): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [isNewTemplate, setIsNewTemplate] = useState(false)
  const [sidebarMenus, setSidebarMenus] = useState<SidebarMenuItem[]>(defaultSidebarMenus)
  const toast = useToast()

  const handleNavigate = (page: string): void => {
    setCurrentPage(page)
    setSelectedTaskId(null)
    setSelectedTemplateId(null)
    setIsNewTemplate(false)
  }

  const handleTaskClick = (taskId: string): void => {
    setSelectedTaskId(taskId)
  }

  const handleBackFromDetail = (): void => {
    setSelectedTaskId(null)
  }

  const handleCreateTemplate = (): void => {
    setIsNewTemplate(true)
    setSelectedTemplateId(null)
  }

  const handleEditTemplate = (templateId: string): void => {
    setSelectedTemplateId(templateId)
    setIsNewTemplate(false)
  }

  const handleBackFromTemplateDetail = (): void => {
    setSelectedTemplateId(null)
    setIsNewTemplate(false)
  }

  const toggleSidebar = (): void => {
    setSidebarCollapsed((prev) => !prev)
  }

  const handleMenuToggle = (id: string): void => {
    setSidebarMenus((prev) =>
      prev.map((menu) => (menu.id === id ? { ...menu, enabled: !menu.enabled } : menu))
    )
  }

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-white">
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
          menuItems={sidebarMenus}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            title={pageTitles[currentPage] || 'Dashboard'}
            onToggleSidebar={toggleSidebar}
            onNavigateToSettings={() => handleNavigate('settings')}
          />
          <main className="flex-1 overflow-hidden">
            {selectedTaskId ? (
              <TaskDetail taskId={selectedTaskId} onBack={handleBackFromDetail} />
            ) : selectedTemplateId || isNewTemplate ? (
              <TemplateDetail
                templateId={selectedTemplateId}
                isNew={isNewTemplate}
                onBack={handleBackFromTemplateDetail}
              />
            ) : (
              <>
                {currentPage === 'dashboard' && <Dashboard />}
                {currentPage === 'tasks' && <MyTasks onTaskClick={handleTaskClick} />}
                {currentPage === 'calendar' && <Calendar onEventClick={handleTaskClick} />}
                {currentPage === 'templates' && (
                  <Templates
                    onCreateTemplate={handleCreateTemplate}
                    onEditTemplate={handleEditTemplate}
                  />
                )}
                {currentPage === 'team' && <MyTeam />}
                {currentPage === 'settings' && (
                  <Settings
                    sidebarMenus={sidebarMenus}
                    onMenuToggle={handleMenuToggle}
                    onShowToast={toast.success}
                  />
                )}
                {!['dashboard', 'tasks', 'calendar', 'templates', 'team', 'settings'].includes(currentPage) && (
                  <div className="flex items-center justify-center h-full text-placeholder">
                    {pageTitles[currentPage]} page coming soon...
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </>
  )
}

export default App
