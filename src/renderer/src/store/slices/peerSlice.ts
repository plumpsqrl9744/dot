import type { StateCreator } from 'zustand'
import type { PeerConnectionStatus, ReceivedTask, TaskTransfer } from '../../types'
import { MOCK_PEER_STATUSES, MOCK_RECEIVED_TASKS, MOCK_SENT_TRANSFERS } from '../../constants'

export interface PeerSlice {
  // 상태
  peers: Record<string, PeerConnectionStatus>
  receivedTasks: ReceivedTask[]
  sentTransfers: TaskTransfer[]

  // 액션
  setPeerStatus: (memberKey: string, status: PeerConnectionStatus) => void
  acceptReceivedTask: (id: string) => void
  declineReceivedTask: (id: string) => void
  addSentTransfer: (transfer: Omit<TaskTransfer, 'id' | 'sentAt' | 'status'>) => void
  updateTransferStatus: (id: string, status: TaskTransfer['status']) => void
}

export const createPeerSlice: StateCreator<PeerSlice, [], [], PeerSlice> = (set) => ({
  // 초기 상태 (mock)
  peers: MOCK_PEER_STATUSES,
  receivedTasks: MOCK_RECEIVED_TASKS,
  sentTransfers: MOCK_SENT_TRANSFERS,

  // 액션
  setPeerStatus: (memberKey, status) =>
    set((state) => ({
      peers: { ...state.peers, [memberKey]: status }
    })),

  acceptReceivedTask: (id) =>
    set((state) => ({
      receivedTasks: state.receivedTasks.map((t) =>
        t.id === id ? { ...t, status: 'accepted' as const } : t
      )
    })),

  declineReceivedTask: (id) =>
    set((state) => ({
      receivedTasks: state.receivedTasks.map((t) =>
        t.id === id ? { ...t, status: 'declined' as const } : t
      )
    })),

  addSentTransfer: (transfer) =>
    set((state) => ({
      sentTransfers: [
        {
          ...transfer,
          id: `transfer-${Date.now()}`,
          sentAt: '방금 전',
          status: 'sending' as const
        },
        ...state.sentTransfers
      ]
    })),

  updateTransferStatus: (id, status) =>
    set((state) => ({
      sentTransfers: state.sentTransfers.map((t) =>
        t.id === id ? { ...t, status } : t
      )
    }))
})
