// LLM 메일 분석 관련 타입 정의

export type MailImportance = 'high' | 'medium' | 'low'
export type MailReviewStatus = 'pending' | 'approved' | 'dismissed'
export type MailFilter = 'all' | 'pending' | 'approved' | 'dismissed'
export type AnalysisStatus = 'idle' | 'analyzing' | 'error'

export interface MailAnalysis {
  id: string
  subject: string
  sender: string
  senderEmail: string
  receivedAt: string
  bodyPreview: string
  needed: boolean
  // LLM 분석 결과
  suggestedTitle: string
  importance: MailImportance
  category: string
  reviewStatus: MailReviewStatus
  analyzedAt: string
}

export interface MailConnectionStatus {
  isConnected: boolean
  lastSyncAt?: string
  error?: string
}
