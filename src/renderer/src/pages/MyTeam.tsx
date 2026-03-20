import { JSX, useState, useMemo } from 'react'
import {
  FiPlus,
  FiMail,
  FiTrash2,
  FiEdit2,
  FiUsers,
  FiArrowLeft,
  FiCheck,
  FiX,
  FiClock,
  FiUserPlus,
  FiSend,
  FiAlertTriangle,
  FiRefreshCw
} from 'react-icons/fi'
import { Button, Card, Breadcrumb, Avatar, Badge, Dot, Modal } from '@renderer/shared/components'
import { MOCK_MEMBERS, MOCK_PENDING_INVITES, MOCK_RECEIVED_INVITES, USER_MEMBER_KEY } from '../constants'
import { TAGS } from '../constants/form-options'
import { usePeers, useToasts } from '../store'
import type {
  TeamMember,
  PendingInvite,
  ReceivedInvite,
  PeerConnectionStatus
} from '../types'

// --- P2P 상태 헬퍼 ---

function getPeerStatusColor(status?: PeerConnectionStatus): string {
  switch (status) {
    case 'connected':
      return 'var(--success)'
    case 'connecting':
      return 'var(--warning)'
    case 'failed':
      return 'var(--error)'
    default:
      return 'var(--text-muted)'
  }
}

function getPeerStatusLabel(status?: PeerConnectionStatus): string {
  switch (status) {
    case 'connected':
      return 'Connected'
    case 'connecting':
      return 'Connecting...'
    case 'failed':
      return 'Failed'
    default:
      return 'Offline'
  }
}

// --- 상수 ---

const roleLabels = {
  owner: 'Owner',
  admin: 'Admin',
  member: 'Member'
}

const roleColors: Record<'owner' | 'admin' | 'member', 'indigo' | 'orange' | 'gray'> = {
  owner: 'indigo',
  admin: 'orange',
  member: 'gray'
}

// --- 컴포넌트 ---

interface MyTeamProps {
  showAddMember?: boolean
  onBack?: () => void
}

export function MyTeam({ showAddMember = false, onBack }: MyTeamProps): JSX.Element {
  const [members] = useState<TeamMember[]>(MOCK_MEMBERS)
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>(MOCK_PENDING_INVITES)
  const [receivedInvites, setReceivedInvites] = useState<ReceivedInvite[]>(MOCK_RECEIVED_INVITES)
  const [isAddMode, setIsAddMode] = useState(showAddMember)
  const [memberKeyInput, setMemberKeyInput] = useState('')
  const [inviteError, setInviteError] = useState('')
  const [inviteSuccess, setInviteSuccess] = useState(false)

  // P2P store
  const {
    peers,
    receivedTasks,
    setPeerStatus,
    acceptReceivedTask,
    declineReceivedTask,
    addSentTransfer
  } = usePeers()
  const { success: toastSuccess } = useToasts()

  // Send Task 모달
  const [sendModalOpen, setSendModalOpen] = useState(false)
  const [sendTarget, setSendTarget] = useState<TeamMember | null>(null)
  const [sendTaskTitle, setSendTaskTitle] = useState('')
  const [sendTaskTag, setSendTaskTag] = useState('')

  const onlineCount = members.filter((m) => m.status === 'online').length

  // P2P 연결 통계
  const peerStats = useMemo(() => {
    const nonSelfMembers = members.filter((m) => m.memberKey !== USER_MEMBER_KEY)
    const connectedCount = nonSelfMembers.filter(
      (m) => peers[m.memberKey] === 'connected'
    ).length
    const failedCount = nonSelfMembers.filter((m) => peers[m.memberKey] === 'failed').length
    return {
      total: nonSelfMembers.length,
      connected: connectedCount,
      failed: failedCount
    }
  }, [members, peers])

  // 받은 태스크 중 pending 상태만 필터
  const pendingReceivedTasks = useMemo(
    () => receivedTasks.filter((t) => t.status === 'pending'),
    [receivedTasks]
  )

  // --- 핸들러 ---

  const handleSendInvite = (): void => {
    if (!memberKeyInput.trim()) {
      setInviteError('멤버 키를 입력해주세요.')
      return
    }
    const existingMember = members.find((m) => m.memberKey === memberKeyInput.toUpperCase())
    if (existingMember) {
      setInviteError('이미 팀에 속한 멤버입니다.')
      return
    }
    const existingInvite = pendingInvites.find(
      (p) => p.memberKey === memberKeyInput.toUpperCase()
    )
    if (existingInvite) {
      setInviteError('이미 초대를 보낸 멤버입니다.')
      return
    }
    setPendingInvites((prev) => [
      {
        id: `p${Date.now()}`,
        memberKey: memberKeyInput.toUpperCase(),
        sentAt: '방금 전',
        status: 'pending'
      },
      ...prev
    ])
    setMemberKeyInput('')
    setInviteError('')
    setInviteSuccess(true)
    setTimeout(() => setInviteSuccess(false), 3000)
  }

  const handleCancelInvite = (id: string): void => {
    setPendingInvites((prev) => prev.filter((p) => p.id !== id))
  }

  const handleAcceptInvite = (id: string): void => {
    setReceivedInvites((prev) => prev.filter((r) => r.id !== id))
  }

  const handleDeclineInvite = (id: string): void => {
    setReceivedInvites((prev) => prev.filter((r) => r.id !== id))
  }

  const handleBack = (): void => {
    if (onBack) {
      onBack()
    } else {
      setIsAddMode(false)
    }
    setMemberKeyInput('')
    setInviteError('')
  }

  const handleRetryPeer = (memberKey: string): void => {
    setPeerStatus(memberKey, 'connecting')
    // 시뮬레이션: 2초 후 connected
    setTimeout(() => {
      setPeerStatus(memberKey, 'connected')
    }, 2000)
  }

  const handleRetryAllFailed = (): void => {
    members
      .filter((m) => m.memberKey !== USER_MEMBER_KEY && peers[m.memberKey] === 'failed')
      .forEach((m) => handleRetryPeer(m.memberKey))
  }

  const handleOpenSendModal = (member: TeamMember): void => {
    setSendTarget(member)
    setSendTaskTitle('')
    setSendTaskTag('')
    setSendModalOpen(true)
  }

  const handleSendTask = (): void => {
    if (!sendTarget || !sendTaskTitle.trim()) return
    addSentTransfer({
      taskId: `task-${Date.now()}`,
      taskTitle: sendTaskTitle.trim(),
      taskTag: sendTaskTag || undefined,
      fromMemberKey: USER_MEMBER_KEY,
      toMemberKey: sendTarget.memberKey
    })
    setSendModalOpen(false)
    setSendTarget(null)
    setSendTaskTitle('')
    setSendTaskTag('')
    toastSuccess('Task Sent', `"${sendTaskTitle.trim()}" sent to ${sendTarget.name}`)
  }

  const handleAcceptReceivedTask = (id: string): void => {
    acceptReceivedTask(id)
    toastSuccess('Task Accepted', 'The task has been added to your list.')
  }

  const handleDeclineReceivedTask = (id: string): void => {
    declineReceivedTask(id)
  }

  // ========================
  //  Add Member View
  // ========================
  if (isAddMode) {
    return (
      <div className="h-full overflow-auto bg-white">
        <div className="max-w-[1200px] mx-auto px-8 py-5 space-y-5">
          {/* Breadcrumb */}
          <Breadcrumb items={[{ label: 'My Team', href: '#' }, { label: 'Add Member' }]} />

          {/* Back Button */}
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <FiArrowLeft size={16} />
            <span>Back to Team</span>
          </button>

          {/* Header */}
          <header>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Add Member</h1>
            <p className="text-sm text-[var(--text-placeholder)] mt-1">
              Enter the member's unique key to send an invitation
            </p>
          </header>

          {/* Add Member Form */}
          <Card>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Member Key
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={memberKeyInput}
                    onChange={(e) => {
                      setMemberKeyInput(e.target.value.toUpperCase())
                      setInviteError('')
                    }}
                    placeholder="DOT-XXXX-XXXX"
                    className="flex-1 h-10 px-3 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-md text-sm text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] focus:outline-none font-mono tracking-wider"
                  />
                  <Button onClick={handleSendInvite} icon={<FiUserPlus size={14} />}>
                    Send Invite
                  </Button>
                </div>
                {inviteError && <p className="text-xs text-[var(--error)]">{inviteError}</p>}
                {inviteSuccess && (
                  <p className="text-xs text-[var(--success)]">
                    초대를 보냈습니다. 상대방이 수락하면 팀에 추가됩니다.
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-[var(--border-light)]">
                <p className="text-xs text-[var(--text-muted)]">
                  멤버 키는 Settings 페이지에서 확인할 수 있습니다. 초대를 보내면 상대방이 수락해야
                  팀에 추가됩니다.
                </p>
              </div>
            </div>
          </Card>

          {/* Pending Invites */}
          {pendingInvites.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <FiClock size={14} className="text-[var(--text-muted)]" />
                Pending Invites
                <span className="text-xs text-[var(--text-muted)]">({pendingInvites.length})</span>
              </h2>
              <Card padding="none">
                <div className="divide-y divide-[var(--border-light)]">
                  {pendingInvites.map((invite) => (
                    <div key={invite.id} className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
                          <FiUserPlus size={14} className="text-[var(--text-muted)]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono text-[var(--text-primary)]">
                              {invite.memberKey}
                            </span>
                            <Badge label="Pending" variant="amber" size="sm" uppercase={false} />
                          </div>
                          {invite.name && (
                            <p className="text-xs text-[var(--text-muted)]">{invite.name}</p>
                          )}
                          <p className="text-xs text-[var(--text-placeholder)]">{invite.sentAt}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCancelInvite(invite.id)}
                        className="text-xs text-[var(--text-muted)] hover:text-[var(--error)] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            </section>
          )}

          {/* Received Invites */}
          {receivedInvites.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <FiMail size={14} className="text-[var(--text-muted)]" />
                Received Invites
                <span className="text-xs text-[var(--text-muted)]">
                  ({receivedInvites.length})
                </span>
              </h2>
              <Card padding="none">
                <div className="divide-y divide-[var(--border-light)]">
                  {receivedInvites.map((invite) => (
                    <div key={invite.id} className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={invite.fromName} size="md" gradient />
                        <div>
                          <p className="text-sm font-medium text-[var(--text-primary)]">
                            {invite.teamName}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">
                            From {invite.fromName} · {invite.receivedAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleAcceptInvite(invite.id)}
                          className="h-8 px-3 flex items-center gap-1.5 bg-[var(--primary)] text-white text-xs font-medium rounded-md hover:bg-[var(--primary-hover)] transition-colors"
                        >
                          <FiCheck size={12} />
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeclineInvite(invite.id)}
                          className="h-8 px-3 flex items-center gap-1.5 bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-xs font-medium rounded-md hover:bg-[var(--bg-tertiary)] transition-colors"
                        >
                          <FiX size={12} />
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </section>
          )}

          {/* Received Tasks */}
          {pendingReceivedTasks.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <FiSend size={14} className="text-[var(--text-muted)]" />
                Received Tasks
                <span className="text-xs text-[var(--text-muted)]">
                  ({pendingReceivedTasks.length})
                </span>
              </h2>
              <Card padding="none">
                <div className="divide-y divide-[var(--border-light)]">
                  {pendingReceivedTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={task.fromName} size="md" gradient />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[var(--text-primary)]">
                              {task.taskTitle}
                            </span>
                            {task.taskTag && <Badge label={task.taskTag} size="sm" />}
                          </div>
                          <p className="text-xs text-[var(--text-muted)]">
                            From {task.fromName} · {task.receivedAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleAcceptReceivedTask(task.id)}
                          className="h-8 px-3 flex items-center gap-1.5 bg-[var(--primary)] text-white text-xs font-medium rounded-md hover:bg-[var(--primary-hover)] transition-colors"
                        >
                          <FiCheck size={12} />
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeclineReceivedTask(task.id)}
                          className="h-8 px-3 flex items-center gap-1.5 bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-xs font-medium rounded-md hover:bg-[var(--bg-tertiary)] transition-colors"
                        >
                          <FiX size={12} />
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </section>
          )}
        </div>
      </div>
    )
  }

  // ========================
  //  Team List View (메인)
  // ========================
  return (
    <div className="h-full overflow-auto bg-white">
      <div className="max-w-[1200px] mx-auto px-8 py-5 space-y-5">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'My Team' }]} />

        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">My Team</h1>
            <p className="text-sm text-[var(--text-placeholder)] mt-1">
              {members.length} members, {onlineCount} online
            </p>
          </div>
          <Button icon={<FiPlus size={12} strokeWidth={2.5} />} onClick={() => setIsAddMode(true)}>
            Add Member
          </Button>
        </header>

        {/* P2P 연결 상태 요약 바 */}
        <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg">
          <div className="flex items-center gap-2">
            <Dot color="var(--success)" size="sm" />
            <span className="text-sm text-[var(--text-primary)]">
              {peerStats.connected}/{peerStats.total} connected
            </span>
          </div>
        </div>

        {/* P2P 연결 실패 경고 배너 */}
        {peerStats.failed > 0 && (
          <div className="flex items-center justify-between p-3 bg-[var(--error)]/5 border border-[var(--error)]/20 rounded-lg">
            <div className="flex items-center gap-2">
              <FiAlertTriangle size={16} className="text-[var(--error)]" />
              <span className="text-sm text-[var(--text-primary)]">
                {peerStats.failed} peer{peerStats.failed > 1 ? 's' : ''} disconnected.
              </span>
            </div>
            <button
              onClick={handleRetryAllFailed}
              className="flex items-center gap-1.5 text-xs font-medium text-[var(--error)] hover:underline"
            >
              <FiRefreshCw size={12} />
              Retry
            </button>
          </div>
        )}

        {/* Received Invites Alert */}
        {receivedInvites.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-[var(--primary-bg)] border border-[var(--primary)]/20 rounded-lg">
            <div className="flex items-center gap-2">
              <FiMail size={16} className="text-[var(--primary)]" />
              <span className="text-sm text-[var(--text-primary)]">
                {receivedInvites.length}개의 팀 초대가 있습니다.
              </span>
            </div>
            <button
              onClick={() => setIsAddMode(true)}
              className="text-xs font-medium text-[var(--primary)] hover:underline"
            >
              View Invites
            </button>
          </div>
        )}

        {/* Received Tasks Alert */}
        {pendingReceivedTasks.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-[var(--warning)]/5 border border-[var(--warning)]/20 rounded-lg">
            <div className="flex items-center gap-2">
              <FiSend size={16} className="text-[var(--warning)]" />
              <span className="text-sm text-[var(--text-primary)]">
                {pendingReceivedTasks.length}개의 받은 태스크가 대기 중입니다.
              </span>
            </div>
            <button
              onClick={() => setIsAddMode(true)}
              className="text-xs font-medium text-[var(--warning)] hover:underline"
            >
              View Tasks
            </button>
          </div>
        )}

        {/* Team Members Card */}
        <Card padding="none">
          {/* Card Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-light)]">
            <div className="flex items-center gap-2">
              <FiUsers size={16} className="text-[var(--text-muted)]" />
              <span className="text-sm font-medium text-[var(--text-secondary)]">Team Members</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-muted)]">
                {onlineCount} / {members.length} online
              </span>
            </div>
          </div>

          {/* Members List */}
          <div className="divide-y divide-[var(--border-light)]">
            {members.map((member) => {
              const isSelf = member.memberKey === USER_MEMBER_KEY
              const peerStatus = peers[member.memberKey] as PeerConnectionStatus | undefined
              const isConnected = peerStatus === 'connected'
              const isFailed = peerStatus === 'failed'
              const isConnecting = peerStatus === 'connecting'

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar + P2P Dot */}
                    <div className="relative">
                      <Avatar name={member.name} size="md" status={member.status} gradient />
                      {!isSelf && (
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${isConnecting ? 'animate-pulse' : ''}`}
                          style={{ backgroundColor: getPeerStatusColor(peerStatus) }}
                          title={getPeerStatusLabel(peerStatus)}
                        />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          {member.name}
                        </span>
                        {isSelf && (
                          <span className="text-xs text-[var(--text-muted)]">(You)</span>
                        )}
                        <Badge
                          label={roleLabels[member.role]}
                          variant={roleColors[member.role]}
                          size="sm"
                          uppercase={false}
                        />
                      </div>
                      <p className="text-xs text-[var(--text-muted)]">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-[var(--text-secondary)]">
                      {member.tasksCount} tasks
                    </span>

                    {/* P2P 상태 라벨 (본인 제외) */}
                    {!isSelf && (
                      <span
                        className="text-[10px] font-medium"
                        style={{ color: getPeerStatusColor(peerStatus) }}
                      >
                        {getPeerStatusLabel(peerStatus)}
                      </span>
                    )}

                    <div className="flex items-center gap-1">
                      {/* Send Task 버튼 (connected 멤버에게만) */}
                      {!isSelf && isConnected && (
                        <button
                          onClick={() => handleOpenSendModal(member)}
                          className="w-7 h-7 flex items-center justify-center rounded text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors"
                          title={`Send task to ${member.name}`}
                        >
                          <FiSend size={14} />
                        </button>
                      )}

                      {/* Retry 버튼 (failed 멤버에게만) */}
                      {!isSelf && isFailed && (
                        <button
                          onClick={() => handleRetryPeer(member.memberKey)}
                          className="w-7 h-7 flex items-center justify-center rounded text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors"
                          title="Retry connection"
                        >
                          <FiRefreshCw size={14} />
                        </button>
                      )}

                      <button className="w-7 h-7 flex items-center justify-center rounded text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
                        <FiMail size={14} />
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center rounded text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
                        <FiEdit2 size={14} />
                      </button>
                      {member.role !== 'owner' && (
                        <button className="w-7 h-7 flex items-center justify-center rounded text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors">
                          <FiTrash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Add Member */}
          <div className="p-4 border-t border-[var(--border-light)]">
            <button
              onClick={() => setIsAddMode(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-md border border-dashed border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:border-[var(--text-muted)] transition-colors"
            >
              <FiPlus size={14} />
              <span className="text-xs font-medium">Add new member</span>
            </button>
          </div>
        </Card>

        {/* Received Tasks 섹션 (메인 뷰) */}
        {pendingReceivedTasks.length > 0 && (
          <section>
            <h2 className="text-sm font-medium text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <FiSend size={14} className="text-[var(--text-muted)]" />
              Received Tasks
              <span className="text-xs text-[var(--text-muted)]">
                ({pendingReceivedTasks.length})
              </span>
            </h2>
            <Card padding="none">
              <div className="divide-y divide-[var(--border-light)]">
                {pendingReceivedTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={task.fromName} size="md" gradient />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[var(--text-primary)]">
                            {task.taskTitle}
                          </span>
                          {task.taskTag && <Badge label={task.taskTag} size="sm" />}
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">
                          From {task.fromName} · {task.receivedAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleAcceptReceivedTask(task.id)}
                        className="h-8 px-3 flex items-center gap-1.5 bg-[var(--primary)] text-white text-xs font-medium rounded-md hover:bg-[var(--primary-hover)] transition-colors"
                      >
                        <FiCheck size={12} />
                        Accept
                      </button>
                      <button
                        onClick={() => handleDeclineReceivedTask(task.id)}
                        className="h-8 px-3 flex items-center gap-1.5 bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-xs font-medium rounded-md hover:bg-[var(--bg-tertiary)] transition-colors"
                      >
                        <FiX size={12} />
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}
      </div>

      {/* Send Task 모달 */}
      <Modal
        isOpen={sendModalOpen && !!sendTarget}
        onClose={() => setSendModalOpen(false)}
        title="Send Task"
      >
        {sendTarget && (
          <>
            {/* 수신자 정보 */}
            <div className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-lg">
              <Avatar name={sendTarget.name} size="md" gradient />
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {sendTarget.name}
                </p>
                <p className="text-xs text-[var(--text-muted)]">{sendTarget.email}</p>
              </div>
            </div>

            {/* 태스크 제목 */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-secondary)]">
                Task Title
              </label>
              <input
                type="text"
                value={sendTaskTitle}
                onChange={(e) => setSendTaskTitle(e.target.value)}
                placeholder="Enter task title..."
                className="w-full h-10 px-3 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-md text-sm text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] focus:outline-none"
                autoFocus
              />
            </div>

            {/* 태그 선택 */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-secondary)]">
                Tag <span className="text-[var(--text-muted)] font-normal">(optional)</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSendTaskTag(sendTaskTag === tag ? '' : tag)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      sendTaskTag === tag
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Send 버튼 */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSendModalOpen(false)}
                className="h-9 px-4 text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg-secondary)] rounded-md hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                Cancel
              </button>
              <Button
                onClick={handleSendTask}
                icon={<FiSend size={14} />}
                disabled={!sendTaskTitle.trim()}
              >
                Send
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
