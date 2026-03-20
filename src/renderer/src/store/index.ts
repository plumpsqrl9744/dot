import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'
import { createAppSlice, type AppSlice } from './slices/appSlice'
import { createTaskSlice, type TaskSlice } from './slices/taskSlice'
import { createToastSlice, type ToastSlice } from './slices/toastSlice'
import { createPeerSlice, type PeerSlice } from './slices/peerSlice'
import { createMailSlice, type MailSlice } from './slices/mailSlice'

// 전체 스토어 타입
type StoreState = AppSlice & TaskSlice & ToastSlice & PeerSlice & MailSlice

// 스토어 생성 - 모든 slice 결합
export const useStore = create<StoreState>()((...a) => ({
  ...createAppSlice(...a),
  ...createTaskSlice(...a),
  ...createToastSlice(...a),
  ...createPeerSlice(...a),
  ...createMailSlice(...a)
}))

// 선택적 훅들 - useShallow로 얕은 비교하여 불필요한 리렌더링 방지
export const useNavigation = () =>
  useStore(
    useShallow((state) => ({
      currentPage: state.currentPage,
      viewMode: state.viewMode,
      selectedTaskId: state.selectedTaskId,
      selectedTemplateId: state.selectedTemplateId,
      navigate: state.navigate,
      selectTask: state.selectTask,
      createTask: state.createTask,
      selectTemplate: state.selectTemplate,
      createTemplate: state.createTemplate,
      goBack: state.goBack
    }))
  )

export const useSidebar = () =>
  useStore(
    useShallow((state) => ({
      collapsed: state.sidebarCollapsed,
      menuItems: state.sidebarMenus,
      toggle: state.toggleSidebar,
      toggleMenuItem: state.toggleMenuItem
    }))
  )

export const useTasks = () =>
  useStore(
    useShallow((state) => ({
      tasks: state.tasks,
      viewTab: state.viewTab,
      groupBy: state.groupBy,
      sortBy: state.sortBy,
      tagFilter: state.tagFilter,
      setViewTab: state.setViewTab,
      setGroupBy: state.setGroupBy,
      setSortBy: state.setSortBy,
      setTagFilter: state.setTagFilter,
      deleteTask: state.deleteTask,
      addTask: state.addTask,
      updateTask: state.updateTask,
      getTaskById: state.getTaskById,
      toggleMyDay: state.toggleMyDay,
      setImportance: state.setImportance,
      toggleSubTask: state.toggleSubTask,
      addSubTask: state.addSubTask,
      deleteSubTask: state.deleteSubTask,
      toggleChecklist: state.toggleChecklist,
      addChecklist: state.addChecklist,
      deleteChecklist: state.deleteChecklist
    }))
  )

export const useToasts = () =>
  useStore(
    useShallow((state) => ({
      toasts: state.toasts,
      showToast: state.showToast,
      success: state.success,
      error: state.error,
      warning: state.warning,
      info: state.info,
      removeToast: state.removeToast,
      clearAll: state.clearAll
    }))
  )

export const usePeers = () =>
  useStore(
    useShallow((state) => ({
      peers: state.peers,
      receivedTasks: state.receivedTasks,
      sentTransfers: state.sentTransfers,
      setPeerStatus: state.setPeerStatus,
      acceptReceivedTask: state.acceptReceivedTask,
      declineReceivedTask: state.declineReceivedTask,
      addSentTransfer: state.addSentTransfer,
      updateTransferStatus: state.updateTransferStatus
    }))
  )

export const useMail = () =>
  useStore(
    useShallow((state) => ({
      mailAnalyses: state.mailAnalyses,
      mailFilter: state.mailFilter,
      analysisStatus: state.analysisStatus,
      mailConnection: state.mailConnection,
      autoAnalysis: state.autoAnalysis,
      setMailFilter: state.setMailFilter,
      approveAnalysis: state.approveAnalysis,
      dismissAnalysis: state.dismissAnalysis,
      setAnalysisStatus: state.setAnalysisStatus,
      setMailConnection: state.setMailConnection,
      toggleAutoAnalysis: state.toggleAutoAnalysis
    }))
  )

// 타입 re-export
export type { ToastItem, ToastType } from './slices/toastSlice'
