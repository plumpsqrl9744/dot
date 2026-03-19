import { useState, useEffect, useRef } from 'react'
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
  const [isNewTask, setIsNewTask] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [isNewTemplate, setIsNewTemplate] = useState(false)
  const [sidebarMenus, setSidebarMenus] = useState<SidebarMenuItem[]>(defaultSidebarMenus)
  const toast = useToast()

  interface AppState {
    page: string
    taskId: string | null
    isNewTask: boolean
    templateId: string | null
    isNewTemplate: boolean
  }

  const historyRef = useRef<AppState[]>([])
  const forwardHistoryRef = useRef<AppState[]>([])
  const currentStateRef = useRef<AppState>({ 
    page: currentPage, 
    taskId: selectedTaskId, 
    isNewTask: isNewTask, 
    templateId: selectedTemplateId, 
    isNewTemplate: isNewTemplate 
  })

  useEffect(() => {
    currentStateRef.current = {
      page: currentPage,
      taskId: selectedTaskId,
      isNewTask: isNewTask,
      templateId: selectedTemplateId,
      isNewTemplate: isNewTemplate
    }
  }, [currentPage, selectedTaskId, isNewTask, selectedTemplateId, isNewTemplate])

  const pushHistory = () => {
    historyRef.current.push({ ...currentStateRef.current })
    if (historyRef.current.length > 50) historyRef.current.shift()
    // Clear forward history upon new action
    forwardHistoryRef.current = []
  }

  const goBack = () => {
    if (historyRef.current.length > 0) {
      forwardHistoryRef.current.push({ ...currentStateRef.current })
      if (forwardHistoryRef.current.length > 50) forwardHistoryRef.current.shift()

      const lastState = historyRef.current.pop()!
      setCurrentPage(lastState.page)
      setSelectedTaskId(lastState.taskId)
      setIsNewTask(lastState.isNewTask)
      setSelectedTemplateId(lastState.templateId)
      setIsNewTemplate(lastState.isNewTemplate)
    } else {
      if (selectedTaskId || isNewTask || selectedTemplateId || isNewTemplate) {
        forwardHistoryRef.current.push({ ...currentStateRef.current })
        setSelectedTaskId(null)
        setIsNewTask(false)
        setSelectedTemplateId(null)
        setIsNewTemplate(false)
      }
    }
  }

  const goForward = () => {
    if (forwardHistoryRef.current.length > 0) {
      historyRef.current.push({ ...currentStateRef.current })
      if (historyRef.current.length > 50) historyRef.current.shift()

      const nextState = forwardHistoryRef.current.pop()!
      setCurrentPage(nextState.page)
      setSelectedTaskId(nextState.taskId)
      setIsNewTask(nextState.isNewTask)
      setSelectedTemplateId(nextState.templateId)
      setIsNewTemplate(nextState.isNewTemplate)
    }
  }

  useEffect(() => {
    const handleGlobalBack = (e: MouseEvent | KeyboardEvent) => {
      let isBack = false
      let isForward = false

      if (e.type === 'keydown') {
        const kbEvent = e as KeyboardEvent
        const target = kbEvent.target as HTMLElement
        const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable
        
        if (!isInput) {
          if (kbEvent.key === 'Backspace' || kbEvent.key === 'Escape') isBack = true
          if (kbEvent.metaKey && kbEvent.key === 'ArrowLeft') isBack = true // Cmd + Left
          if (kbEvent.metaKey && kbEvent.key === 'ArrowRight') isForward = true // Cmd + Right
          if (kbEvent.altKey && kbEvent.key === 'ArrowLeft') isBack = true // Alt + Left
          if (kbEvent.altKey && kbEvent.key === 'ArrowRight') isForward = true // Alt + Right
        }
      }
      
      if (e.type === 'mousedown') {
        const mouseEvent = e as MouseEvent
        if (mouseEvent.button === 3) { // Mouse 4 (Thumb back)
          mouseEvent.preventDefault()
          isBack = true
        } else if (mouseEvent.button === 4) { // Mouse 5 (Thumb forward)
          mouseEvent.preventDefault()
          isForward = true
        }
      }

      if (isBack) goBack()
      if (isForward) goForward()
    }

    document.addEventListener('keydown', handleGlobalBack)
    document.addEventListener('mousedown', handleGlobalBack)
    return () => {
      document.removeEventListener('keydown', handleGlobalBack)
      document.removeEventListener('mousedown', handleGlobalBack)
    }
  }, [])


  const handleNavigate = (page: string): void => {
    if (currentPage === page && !selectedTaskId && !isNewTask && !selectedTemplateId && !isNewTemplate) return
    pushHistory()
    setCurrentPage(page)
    setSelectedTaskId(null)
    setIsNewTask(false)
    setSelectedTemplateId(null)
    setIsNewTemplate(false)
  }

  const handleTaskClick = (taskId: string): void => {
    if (selectedTaskId === taskId && !isNewTask) return
    pushHistory()
    setSelectedTaskId(taskId)
    setIsNewTask(false)
  }

  const handleCreateTask = (): void => {
    pushHistory()
    setIsNewTask(true)
    setSelectedTaskId(null)
  }

  const handleBackFromDetail = (): void => {
    goBack()
  }

  const handleCreateTemplate = (): void => {
    pushHistory()
    setIsNewTemplate(true)
    setSelectedTemplateId(null)
  }

  const handleEditTemplate = (templateId: string): void => {
    if (selectedTemplateId === templateId && !isNewTemplate) return
    pushHistory()
    setSelectedTemplateId(templateId)
    setIsNewTemplate(false)
  }

  const handleBackFromTemplateDetail = (): void => {
    goBack()
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
            {selectedTaskId || isNewTask ? (
              <TaskDetail taskId={selectedTaskId} isNew={isNewTask} onBack={handleBackFromDetail} />
            ) : selectedTemplateId || isNewTemplate ? (
              <TemplateDetail
                templateId={selectedTemplateId}
                isNew={isNewTemplate}
                onBack={handleBackFromTemplateDetail}
              />
            ) : (
              <>
                {currentPage === 'dashboard' && <Dashboard />}
                {currentPage === 'tasks' && <MyTasks onTaskClick={handleTaskClick} onCreateTask={handleCreateTask} />}
                {currentPage === 'calendar' && <Calendar onEventClick={handleTaskClick} onCreateTask={handleCreateTask} />}
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
