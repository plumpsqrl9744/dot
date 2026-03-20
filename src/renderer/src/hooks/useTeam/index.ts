import { useState, useCallback, useMemo } from 'react'
import type { TeamMember, PendingInvite, ReceivedInvite } from '../../types'
import { MOCK_MEMBERS, MOCK_PENDING_INVITES, MOCK_RECEIVED_INVITES } from '../../constants'

interface UseTeamReturn {
  // 상태 (What)
  members: TeamMember[]
  pendingInvites: PendingInvite[]
  receivedInvites: ReceivedInvite[]
  onlineCount: number

  // 초대 폼 상태
  memberKeyInput: string
  inviteError: string
  inviteSuccess: boolean

  // 액션
  setMemberKeyInput: (value: string) => void
  sendInvite: () => void
  cancelInvite: (id: string) => void
  acceptInvite: (id: string) => void
  declineInvite: (id: string) => void
  clearInviteForm: () => void
}

export function useTeam(): UseTeamReturn {
  // 멤버 및 초대 상태
  const [members] = useState<TeamMember[]>(MOCK_MEMBERS)
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>(MOCK_PENDING_INVITES)
  const [receivedInvites, setReceivedInvites] = useState<ReceivedInvite[]>(MOCK_RECEIVED_INVITES)

  // 폼 상태
  const [memberKeyInput, setMemberKeyInputState] = useState('')
  const [inviteError, setInviteError] = useState('')
  const [inviteSuccess, setInviteSuccess] = useState(false)

  // 파생 상태
  const onlineCount = useMemo(
    () => members.filter((m) => m.status === 'online').length,
    [members]
  )

  // 액션들
  const setMemberKeyInput = useCallback((value: string) => {
    setMemberKeyInputState(value.toUpperCase())
    setInviteError('')
  }, [])

  const sendInvite = useCallback(() => {
    if (!memberKeyInput.trim()) {
      setInviteError('멤버 키를 입력해주세요.')
      return
    }

    // 이미 멤버인지 확인
    const existingMember = members.find((m) => m.memberKey === memberKeyInput)
    if (existingMember) {
      setInviteError('이미 팀에 속한 멤버입니다.')
      return
    }

    // 이미 초대했는지 확인
    const existingInvite = pendingInvites.find((p) => p.memberKey === memberKeyInput)
    if (existingInvite) {
      setInviteError('이미 초대를 보낸 멤버입니다.')
      return
    }

    // 초대 추가
    setPendingInvites((prev) => [
      {
        id: `p${Date.now()}`,
        memberKey: memberKeyInput,
        sentAt: '방금 전',
        status: 'pending'
      },
      ...prev
    ])

    setMemberKeyInputState('')
    setInviteError('')
    setInviteSuccess(true)
    setTimeout(() => setInviteSuccess(false), 3000)
  }, [memberKeyInput, members, pendingInvites])

  const cancelInvite = useCallback((id: string) => {
    setPendingInvites((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const acceptInvite = useCallback((id: string) => {
    setReceivedInvites((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const declineInvite = useCallback((id: string) => {
    setReceivedInvites((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const clearInviteForm = useCallback(() => {
    setMemberKeyInputState('')
    setInviteError('')
  }, [])

  return {
    members,
    pendingInvites,
    receivedInvites,
    onlineCount,
    memberKeyInput,
    inviteError,
    inviteSuccess,
    setMemberKeyInput,
    sendInvite,
    cancelInvite,
    acceptInvite,
    declineInvite,
    clearInviteForm
  }
}
