import { JSX, useState } from 'react'
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
  FiUserPlus
} from 'react-icons/fi'
import { Button, Card, Breadcrumb, Avatar, Badge } from '@renderer/shared/components'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'member'
  status: 'online' | 'offline' | 'away'
  tasksCount: number
  memberKey: string
}

interface PendingInvite {
  id: string
  memberKey: string
  name?: string
  email?: string
  sentAt: string
  status: 'pending' | 'accepted' | 'declined'
}

interface ReceivedInvite {
  id: string
  fromName: string
  fromEmail: string
  teamName: string
  receivedAt: string
}

const mockMembers: TeamMember[] = [
  {
    id: 'm1',
    name: '김철수',
    email: 'kim@dot.com',
    role: 'owner',
    status: 'online',
    tasksCount: 8,
    memberKey: 'DOT-KIM-7X2K'
  },
  {
    id: 'm2',
    name: '이영희',
    email: 'lee@dot.com',
    role: 'admin',
    status: 'online',
    tasksCount: 5,
    memberKey: 'DOT-LEE-9M3P'
  },
  {
    id: 'm3',
    name: '박지민',
    email: 'park@dot.com',
    role: 'member',
    status: 'away',
    tasksCount: 3,
    memberKey: 'DOT-PARK-4H8N'
  },
  {
    id: 'm4',
    name: '정민수',
    email: 'jung@dot.com',
    role: 'member',
    status: 'online',
    tasksCount: 12,
    memberKey: 'DOT-JUNG-2F5Q'
  },
  {
    id: 'm5',
    name: '최수진',
    email: 'choi@dot.com',
    role: 'member',
    status: 'offline',
    tasksCount: 4,
    memberKey: 'DOT-CHOI-6R1W'
  },
  {
    id: 'm6',
    name: '한소희',
    email: 'han@dot.com',
    role: 'member',
    status: 'online',
    tasksCount: 6,
    memberKey: 'DOT-HAN-8T4Y'
  }
]

const mockPendingInvites: PendingInvite[] = [
  {
    id: 'p1',
    memberKey: 'DOT-SONG-3K7L',
    name: '송민호',
    email: 'song@dot.com',
    sentAt: '2시간 전',
    status: 'pending'
  },
  { id: 'p2', memberKey: 'DOT-KANG-5N9M', sentAt: '1일 전', status: 'pending' }
]

const mockReceivedInvites: ReceivedInvite[] = [
  {
    id: 'r1',
    fromName: '박서준',
    fromEmail: 'psj@company.com',
    teamName: 'Design Team',
    receivedAt: '30분 전'
  }
]

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

interface MyTeamProps {
  showAddMember?: boolean
  onBack?: () => void
}

export function MyTeam({ showAddMember = false, onBack }: MyTeamProps): JSX.Element {
  const [members] = useState<TeamMember[]>(mockMembers)
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>(mockPendingInvites)
  const [receivedInvites, setReceivedInvites] = useState<ReceivedInvite[]>(mockReceivedInvites)
  const [isAddMode, setIsAddMode] = useState(showAddMember)
  const [memberKeyInput, setMemberKeyInput] = useState('')
  const [inviteError, setInviteError] = useState('')
  const [inviteSuccess, setInviteSuccess] = useState(false)

  const onlineCount = members.filter((m) => m.status === 'online').length

  const handleSendInvite = (): void => {
    if (!memberKeyInput.trim()) {
      setInviteError('멤버 키를 입력해주세요.')
      return
    }

    // Check if already a member
    const existingMember = members.find((m) => m.memberKey === memberKeyInput.toUpperCase())
    if (existingMember) {
      setInviteError('이미 팀에 속한 멤버입니다.')
      return
    }

    // Check if already invited
    const existingInvite = pendingInvites.find((p) => p.memberKey === memberKeyInput.toUpperCase())
    if (existingInvite) {
      setInviteError('이미 초대를 보낸 멤버입니다.')
      return
    }

    // Add to pending invites
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
    // In real app, this would add the team to user's teams
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

  // Add Member View
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
                <span className="text-xs text-[var(--text-muted)]">({receivedInvites.length})</span>
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
        </div>
      </div>
    )
  }

  // Team List View
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
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={member.name} size="md" status={member.status} gradient />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {member.name}
                      </span>
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
                  <div className="flex items-center gap-1">
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
            ))}
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
      </div>
    </div>
  )
}
