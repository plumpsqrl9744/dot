// Team 관련 타입 정의

export type MemberRole = 'owner' | 'admin' | 'member'
export type MemberStatus = 'online' | 'offline' | 'away'
export type InviteStatus = 'pending' | 'accepted' | 'declined'

export interface TeamMember {
  id: string
  name: string
  email: string
  role: MemberRole
  status: MemberStatus
  tasksCount: number
  memberKey: string
}

export interface PendingInvite {
  id: string
  memberKey: string
  name?: string
  email?: string
  sentAt: string
  status: InviteStatus
}

export interface ReceivedInvite {
  id: string
  fromName: string
  fromEmail: string
  teamName: string
  receivedAt: string
}

export interface Follower {
  id: string
  name: string
  email: string
}
