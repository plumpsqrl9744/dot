import { useEffect } from 'react'
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
import { MailAnalysis } from './pages/MailAnalysis'
import { ToastContainer } from './shared/components'
import { useNavigation, useSidebar, useToasts } from './store'
import { PAGE_TITLES } from './constants'

function App(): React.JSX.Element {
  // zustand store에서 상태와 액션 가져오기
  const {
    currentPage,
    viewMode,
    selectedTaskId,
    selectedTemplateId,
    navigate,
    goBack,
    selectTask,
    createTask,
    selectTemplate,
    createTemplate
  } = useNavigation()

  const { collapsed, menuItems, toggle, toggleMenuItem } = useSidebar()
  const { toasts, removeToast, success } = useToasts()

  // 글로벌 키보드/마우스 네비게이션
  useEffect(() => {
    const handleGlobalNavigation = (e: MouseEvent | KeyboardEvent): void => {
      let isBack = false

      if (e.type === 'keydown') {
        const kbEvent = e as KeyboardEvent
        const target = kbEvent.target as HTMLElement
        const isInput =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable

        if (!isInput) {
          if (kbEvent.key === 'Backspace' || kbEvent.key === 'Escape') isBack = true
          if (kbEvent.metaKey && kbEvent.key === 'ArrowLeft') isBack = true
          if (kbEvent.altKey && kbEvent.key === 'ArrowLeft') isBack = true
        }
      }

      if (e.type === 'mousedown') {
        const mouseEvent = e as MouseEvent
        if (mouseEvent.button === 3) {
          mouseEvent.preventDefault()
          isBack = true
        }
      }

      if (isBack) goBack()
    }

    document.addEventListener('keydown', handleGlobalNavigation)
    document.addEventListener('mousedown', handleGlobalNavigation)
    return () => {
      document.removeEventListener('keydown', handleGlobalNavigation)
      document.removeEventListener('mousedown', handleGlobalNavigation)
    }
  }, [goBack])

  // 페이지 렌더링
  const renderContent = (): React.JSX.Element => {
    // Detail/Create 모드
    if (viewMode === 'detail' || viewMode === 'create') {
      if (selectedTaskId || (viewMode === 'create' && currentPage === 'tasks')) {
        return (
          <TaskDetail
            taskId={selectedTaskId}
            isNew={viewMode === 'create'}
            onBack={goBack}
          />
        )
      }
      if (selectedTemplateId || (viewMode === 'create' && currentPage === 'templates')) {
        return (
          <TemplateDetail
            templateId={selectedTemplateId}
            isNew={viewMode === 'create'}
            onBack={goBack}
          />
        )
      }
    }

    // List 모드
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'tasks':
        return <MyTasks onTaskClick={selectTask} onCreateTask={createTask} />
      case 'calendar':
        return <Calendar onEventClick={selectTask} onCreateTask={createTask} />
      case 'templates':
        return <Templates onCreateTemplate={createTemplate} onEditTemplate={selectTemplate} />
      case 'mail':
        return <MailAnalysis />
      case 'team':
        return <MyTeam />
      case 'settings':
        return (
          <Settings
            sidebarMenus={menuItems}
            onMenuToggle={toggleMenuItem}
            onShowToast={success}
          />
        )
      default:
        return (
          <div className="flex items-center justify-center h-full text-placeholder">
            {PAGE_TITLES[currentPage] || currentPage} page coming soon...
          </div>
        )
    }
  }

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-white">
        <Sidebar
          currentPage={currentPage}
          onNavigate={navigate}
          collapsed={collapsed}
          onToggle={toggle}
          menuItems={menuItems}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            title={PAGE_TITLES[currentPage] || 'Dashboard'}
            onToggleSidebar={toggle}
            onNavigateToSettings={() => navigate('settings')}
          />
          <main className="flex-1 overflow-hidden">{renderContent()}</main>
        </div>
      </div>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  )
}

export default App
