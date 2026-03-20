import type { StateCreator } from 'zustand'
import type { MailAnalysis, MailFilter, AnalysisStatus, MailConnectionStatus } from '../../types'
import { MOCK_MAIL_ANALYSES } from '../../constants'

export interface MailSlice {
  // 상태
  mailAnalyses: MailAnalysis[]
  mailFilter: MailFilter
  analysisStatus: AnalysisStatus
  mailConnection: MailConnectionStatus
  autoAnalysis: boolean

  // 액션
  setMailFilter: (filter: MailFilter) => void
  approveAnalysis: (id: string) => void
  dismissAnalysis: (id: string) => void
  setAnalysisStatus: (status: AnalysisStatus) => void
  setMailConnection: (connection: MailConnectionStatus) => void
  toggleAutoAnalysis: () => void
}

export const createMailSlice: StateCreator<MailSlice, [], [], MailSlice> = (set) => ({
  // 초기 상태 (mock)
  mailAnalyses: MOCK_MAIL_ANALYSES,
  mailFilter: 'pending',
  analysisStatus: 'idle',
  mailConnection: { isConnected: true, lastSyncAt: '5분 전' },
  autoAnalysis: true,

  // 액션
  setMailFilter: (filter) => set({ mailFilter: filter }),

  approveAnalysis: (id) =>
    set((state) => ({
      mailAnalyses: state.mailAnalyses.map((m) =>
        m.id === id ? { ...m, reviewStatus: 'approved' as const } : m
      )
    })),

  dismissAnalysis: (id) =>
    set((state) => ({
      mailAnalyses: state.mailAnalyses.map((m) =>
        m.id === id ? { ...m, reviewStatus: 'dismissed' as const } : m
      )
    })),

  setAnalysisStatus: (status) => set({ analysisStatus: status }),

  setMailConnection: (connection) => set({ mailConnection: connection }),

  toggleAutoAnalysis: () =>
    set((state) => ({ autoAnalysis: !state.autoAnalysis }))
})
