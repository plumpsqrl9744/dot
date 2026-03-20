// 색상 상수 정의

export const STATUS_COLORS = {
  urgent: 'error',
  warning: 'warning',
  safe: 'success'
} as const

export const BADGE_COLORS = {
  indigo: { bg: 'rgba(99, 102, 241, 0.12)', text: 'rgb(99, 102, 241)', hex: '#6366F1' },
  pink: { bg: 'rgba(236, 72, 153, 0.12)', text: 'rgb(236, 72, 153)', hex: '#EC4899' },
  sky: { bg: 'rgba(14, 165, 233, 0.12)', text: 'rgb(14, 165, 233)', hex: '#0EA5E9' },
  green: { bg: 'rgba(34, 197, 94, 0.12)', text: 'rgb(34, 197, 94)', hex: '#22C55E' },
  orange: { bg: 'rgba(249, 115, 22, 0.12)', text: 'rgb(249, 115, 22)', hex: '#F97316' },
  purple: { bg: 'rgba(168, 85, 247, 0.12)', text: 'rgb(168, 85, 247)', hex: '#A855F7' },
  teal: { bg: 'rgba(20, 184, 166, 0.12)', text: 'rgb(20, 184, 166)', hex: '#14B8A6' },
  amber: { bg: 'rgba(245, 158, 11, 0.12)', text: 'rgb(245, 158, 11)', hex: '#F59E0B' },
  red: { bg: 'rgba(239, 68, 68, 0.12)', text: 'rgb(239, 68, 68)', hex: '#EF4444' },
  gray: { bg: 'rgba(107, 114, 128, 0.12)', text: 'rgb(107, 114, 128)', hex: '#6B7280' }
} as const

export type BadgeColorKey = keyof typeof BADGE_COLORS

export const COLOR_PALETTE = [
  { label: 'Red', value: '#EF4444' },
  { label: 'Orange', value: '#F97316' },
  { label: 'Amber', value: '#F59E0B' },
  { label: 'Green', value: '#22C55E' },
  { label: 'Blue', value: '#3B82F6' },
  { label: 'Purple', value: '#A855F7' },
  { label: 'Gray', value: '#6B7280' }
] as const

export const ROLE_COLORS: Record<'owner' | 'admin' | 'member', 'indigo' | 'orange' | 'gray'> = {
  owner: 'indigo',
  admin: 'orange',
  member: 'gray'
}

export const ROLE_LABELS = {
  owner: 'Owner',
  admin: 'Admin',
  member: 'Member'
} as const
