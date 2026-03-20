// P2P 연결 관련 타입 정의

export type PeerConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'failed'

export interface TaskTransfer {
  id: string
  taskId: string
  taskTitle: string
  taskTag?: string
  fromMemberKey: string
  toMemberKey: string
  sentAt: string
  status: 'sending' | 'sent' | 'accepted' | 'declined'
}

export interface ReceivedTask {
  id: string
  taskTitle: string
  taskTag?: string
  fromName: string
  fromMemberKey: string
  receivedAt: string
  status: 'pending' | 'accepted' | 'declined'
}
