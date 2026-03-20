import { useState, useCallback, useRef, useEffect } from 'react'
import type { BadgeColorKey } from '../../constants/colors'

// Profile
interface Profile {
  name: string
  email: string
  role: string
}

// Status Badge
interface StatusBadge {
  id: string
  label: string
  color: string
  textColor: string
}

// Category Badge
interface CategoryBadge {
  id: string
  label: string
  color: BadgeColorKey
}

// Notification Settings
interface NotificationSettings {
  enabled: boolean
  urgentAlarm: boolean
  urgentRepeat: number
  urgentInterval: number
  warningAlarm: boolean
  warningRepeat: number
  sound: string
  desktop: boolean
}

// Hook Return Types
interface UseProfileReturn {
  profile: Profile
  updateProfile: (updates: Partial<Profile>) => void
  keyCopied: boolean
  copyMemberKey: () => void
}

interface UseNotificationsReturn {
  notifications: NotificationSettings
  updateNotification: <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ) => void
  toggleNotification: (key: 'enabled' | 'urgentAlarm' | 'warningAlarm' | 'desktop') => void
}

interface UseStatusBadgesReturn {
  badges: StatusBadge[]
  editingId: string | null
  editValue: string
  startEdit: (badge: StatusBadge) => void
  saveEdit: () => void
  cancelEdit: () => void
  updateColor: (id: string, color: string) => void
  setEditValue: (value: string) => void
}

interface UseCategoryBadgesReturn {
  badges: CategoryBadge[]
  editingId: string | null
  newLabel: string
  newColor: BadgeColorKey
  setNewLabel: (value: string) => void
  setNewColor: (color: BadgeColorKey) => void
  startEdit: (badge: CategoryBadge) => void
  saveEdit: () => void
  cancelEdit: () => void
  addBadge: () => void
  deleteBadge: (id: string) => void
  editRef: React.RefObject<HTMLDivElement>
}

// USER_MEMBER_KEY (실제로는 서버에서 받아옴)
const USER_MEMBER_KEY = 'DOT-USER-7K3M'

// Profile Hook
export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<Profile>({
    name: 'User',
    email: 'user@example.com',
    role: 'Developer'
  })
  const [keyCopied, setKeyCopied] = useState(false)

  const updateProfile = useCallback((updates: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...updates }))
  }, [])

  const copyMemberKey = useCallback(() => {
    navigator.clipboard.writeText(USER_MEMBER_KEY)
    setKeyCopied(true)
    setTimeout(() => setKeyCopied(false), 2000)
  }, [])

  return { profile, updateProfile, keyCopied, copyMemberKey }
}

// Notifications Hook
export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    enabled: true,
    urgentAlarm: true,
    urgentRepeat: 3,
    urgentInterval: 5,
    warningAlarm: true,
    warningRepeat: 1,
    sound: 'default',
    desktop: true
  })

  const updateNotification = useCallback(
    <K extends keyof NotificationSettings>(key: K, value: NotificationSettings[K]) => {
      setNotifications((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const toggleNotification = useCallback(
    (key: 'enabled' | 'urgentAlarm' | 'warningAlarm' | 'desktop') => {
      setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
    },
    []
  )

  return { notifications, updateNotification, toggleNotification }
}

// Status Badges Hook
export function useStatusBadges(): UseStatusBadgesReturn {
  const [badges, setBadges] = useState<StatusBadge[]>([
    { id: 'urgent', label: '긴급', color: '#EF4444', textColor: '#EF4444' },
    { id: 'warning', label: '주의', color: '#F97316', textColor: '#F97316' },
    { id: 'safe', label: '여유', color: '#22C55E', textColor: '#22C55E' }
  ])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const startEdit = useCallback((badge: StatusBadge) => {
    setEditingId(badge.id)
    setEditValue(badge.label)
  }, [])

  const saveEdit = useCallback(() => {
    if (!editingId) return
    setBadges((prev) =>
      prev.map((b) => (b.id === editingId ? { ...b, label: editValue } : b))
    )
    setEditingId(null)
  }, [editingId, editValue])

  const cancelEdit = useCallback(() => {
    setEditingId(null)
    setEditValue('')
  }, [])

  const updateColor = useCallback((id: string, color: string) => {
    setBadges((prev) =>
      prev.map((b) => (b.id === id ? { ...b, color, textColor: color } : b))
    )
  }, [])

  return {
    badges,
    editingId,
    editValue,
    startEdit,
    saveEdit,
    cancelEdit,
    updateColor,
    setEditValue
  }
}

// Category Badges Hook
export function useCategoryBadges(): UseCategoryBadgesReturn {
  const [badges, setBadges] = useState<CategoryBadge[]>([
    { id: '1', label: 'AMS', color: 'indigo' },
    { id: '2', label: 'WAS', color: 'pink' },
    { id: '3', label: 'Frontend', color: 'sky' },
    { id: '4', label: 'Backend', color: 'green' },
    { id: '5', label: 'QA', color: 'teal' },
    { id: '6', label: 'MARKETING', color: 'orange' },
    { id: '7', label: 'BIZ', color: 'amber' }
  ])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [newLabel, setNewLabel] = useState('')
  const [newColor, setNewColor] = useState<BadgeColorKey>('indigo')
  const editRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (editingId && editRef.current && !editRef.current.contains(e.target as Node)) {
        setEditingId(null)
        setNewLabel('')
        setNewColor('indigo')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [editingId])

  const startEdit = useCallback((badge: CategoryBadge) => {
    setEditingId(badge.id)
    setNewLabel(badge.label)
    setNewColor(badge.color)
  }, [])

  const saveEdit = useCallback(() => {
    if (!newLabel.trim() || !editingId) return
    setBadges((prev) =>
      prev.map((b) =>
        b.id === editingId ? { ...b, label: newLabel.toUpperCase(), color: newColor } : b
      )
    )
    setEditingId(null)
    setNewLabel('')
    setNewColor('indigo')
  }, [editingId, newLabel, newColor])

  const cancelEdit = useCallback(() => {
    setEditingId(null)
    setNewLabel('')
    setNewColor('indigo')
  }, [])

  const addBadge = useCallback(() => {
    if (!newLabel.trim()) return
    setBadges((prev) => [
      ...prev,
      { id: Date.now().toString(), label: newLabel.toUpperCase(), color: newColor }
    ])
    setNewLabel('')
    setNewColor('indigo')
  }, [newLabel, newColor])

  const deleteBadge = useCallback((id: string) => {
    setBadges((prev) => prev.filter((b) => b.id !== id))
    setEditingId(null)
    setNewLabel('')
    setNewColor('indigo')
  }, [])

  return {
    badges,
    editingId,
    newLabel,
    newColor,
    setNewLabel,
    setNewColor,
    startEdit,
    saveEdit,
    cancelEdit,
    addBadge,
    deleteBadge,
    editRef
  }
}
