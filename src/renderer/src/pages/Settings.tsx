import { JSX, useState, useRef, useEffect } from 'react'
import {
  FiUser,
  FiBell,
  FiMenu,
  FiTag,
  FiAlertCircle,
  FiPlus,
  FiEdit2,
  FiCheck,
  FiX,
  FiTrash2,
  FiCopy,
  FiKey,
  FiMail,
  FiCpu
} from 'react-icons/fi'
import { Breadcrumb, Button, Avatar, Dot } from '@renderer/shared/components'
import { useMail } from '../store'
import type { SidebarMenuItem } from '../types'

// Types
interface StatusBadge {
  id: string
  label: string
  color: string
  textColor: string
  threshold?: number
}

interface CategoryBadge {
  id: string
  label: string
  color: keyof typeof BADGE_COLORS
}

interface SettingsProps {
  sidebarMenus: SidebarMenuItem[]
  onMenuToggle: (id: string) => void
  onShowToast?: (title: string, message?: string) => void
}

// Constants
const BADGE_COLORS = {
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

const STATUS_COLORS = [
  { label: 'Red', value: '#EF4444' },
  { label: 'Orange', value: '#F97316' },
  { label: 'Amber', value: '#F59E0B' },
  { label: 'Green', value: '#22C55E' },
  { label: 'Blue', value: '#3B82F6' },
  { label: 'Purple', value: '#A855F7' },
  { label: 'Gray', value: '#6B7280' }
]

// Section Component
function SettingsSection({
  icon,
  title,
  description,
  children
}: {
  icon: React.ReactNode
  title: string
  description: string
  children: React.ReactNode
}): JSX.Element {
  return (
    <section className="bg-[var(--bg-default)] rounded-lg border border-[var(--border-default)]">
      <div className="p-4 border-b border-[var(--border-light)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)]">
            {icon}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h2>
            <p className="text-xs text-[var(--text-placeholder)]">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </section>
  )
}

// Input Field Component
function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text'
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
}): JSX.Element {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-[var(--text-secondary)]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 px-3 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-md text-sm text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] focus:outline-none"
      />
    </div>
  )
}

// Toggle Switch Component
function Toggle({
  checked,
  onChange,
  label
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}): JSX.Element {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2.5"
    >
      <div
        className={`w-10 h-6 rounded-full transition-all duration-200 relative shrink-0 ${
          checked
            ? 'bg-[var(--primary)]'
            : 'bg-[var(--border-default)]'
        }`}
      >
        <div
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-200 ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </div>
      {label && <span className="text-xs text-[var(--text-secondary)]">{label}</span>}
    </button>
  )
}

// Select Component
function Select({
  label,
  value,
  onChange,
  options
}: {
  label: string
  value: string | number
  onChange: (value: string) => void
  options: { label: string; value: string | number }[]
}): JSX.Element {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-[var(--text-secondary)]">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-9 px-3 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-md text-sm text-[var(--text-primary)] focus:outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20width%3d%2212%22%20height%3d%2212%22%20viewBox%3d%220%200%2012%2012%22%3e%3cpath%20fill%3d%22%236b7280%22%20d%3d%22M3%204.5L6%207.5L9%204.5%22%2f%3e%3c%2fsvg%3e')] bg-no-repeat bg-[center_right_12px]"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

// Color Picker Component
function ColorPicker({
  value,
  onChange,
  colors
}: {
  value: string
  onChange: (color: string) => void
  colors: { label: string; value: string }[]
}): JSX.Element {
  return (
    <div className="flex items-center gap-1.5">
      {colors.map((color) => (
        <button
          key={color.value}
          onClick={() => onChange(color.value)}
          className={`w-6 h-6 rounded-full transition-all ${
            value === color.value ? 'ring-2 ring-offset-2 ring-[var(--primary)]' : ''
          }`}
          style={{ backgroundColor: color.value }}
          title={color.label}
        />
      ))}
    </div>
  )
}

// LLM Model Options
const LLM_MODELS = [
  { label: 'Qwen2.5 3B (추천)', value: 'qwen2.5:3b' },
  { label: 'EXAONE 3.5 2.4B', value: 'exaone3.5:2.4b' },
  { label: 'Gemma 3 4B', value: 'gemma3:4b' }
]

const POLLING_INTERVALS = [
  { label: '5분', value: 5 },
  { label: '15분', value: 15 },
  { label: '30분', value: 30 },
  { label: '60분', value: 60 },
  { label: '수동', value: 0 }
]

// Mail Analysis Settings Section
function MailSettingsSection({
  onShowToast
}: {
  onShowToast?: (title: string, message?: string) => void
}): JSX.Element {
  const { mailConnection, autoAnalysis, toggleAutoAnalysis } = useMail()

  const [imapServer, setImapServer] = useState('mail.hanbiro.com')
  const [imapPort, setImapPort] = useState('993')
  const [imapEmail, setImapEmail] = useState('')
  const [imapPassword, setImapPassword] = useState('')
  const [selectedModel, setSelectedModel] = useState('qwen2.5:3b')
  const [pollingInterval, setPollingInterval] = useState(15)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)

  const handleTestConnection = (): void => {
    if (!imapEmail || !imapPassword) {
      onShowToast?.('연결 실패', '이메일과 비밀번호를 입력해주세요.')
      return
    }
    setIsTesting(true)
    setTestResult(null)
    // Mock: 2초 후 성공
    setTimeout(() => {
      setIsTesting(false)
      setTestResult('success')
      onShowToast?.('연결 성공', 'IMAP 서버에 정상적으로 연결되었습니다.')
      setImapPassword('') // 테스트 후 비밀번호 clear (safeStorage로 전달 가정)
    }, 2000)
  }

  return (
    <SettingsSection
      icon={<FiMail size={16} />}
      title="Mail Analysis"
      description="한비로 메일 연동 및 LLM 분석 설정"
    >
      <div className="space-y-5">
        {/* Connection Status */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2.5">
            <Dot
              color={mailConnection.isConnected ? 'var(--success)' : 'var(--error)'}
              size="sm"
            />
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {mailConnection.isConnected ? '연결됨' : '연결 안 됨'}
              </p>
              {mailConnection.lastSyncAt && (
                <p className="text-xs text-[var(--text-placeholder)]">
                  마지막 동기화: {mailConnection.lastSyncAt}
                </p>
              )}
            </div>
          </div>
          <Toggle
            checked={autoAnalysis}
            onChange={toggleAutoAnalysis}
            label="자동 분석"
          />
        </div>

        {/* IMAP Settings */}
        <div className="border-t border-[var(--border-light)] pt-4">
          <div className="flex items-center gap-2 mb-4">
            <FiMail size={14} className="text-[var(--text-muted)]" />
            <span className="text-sm font-medium text-[var(--text-primary)]">IMAP 설정</span>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <InputField
                  label="받는 메일 서버"
                  value={imapServer}
                  onChange={setImapServer}
                  placeholder="mail.domain.com"
                />
              </div>
              <InputField
                label="포트"
                value={imapPort}
                onChange={setImapPort}
                placeholder="993"
              />
            </div>
            <InputField
              label="이메일"
              value={imapEmail}
              onChange={setImapEmail}
              placeholder="user@company.com"
              type="email"
            />
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-secondary)]">비밀번호</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={imapPassword}
                  onChange={(e) => setImapPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 h-9 px-3 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-md text-sm text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] focus:outline-none"
                />
                <button
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="h-9 px-3 flex items-center gap-1.5 bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-secondary)] text-xs font-medium rounded-md hover:bg-[var(--bg-tertiary)] disabled:opacity-50 transition-colors"
                >
                  {isTesting ? (
                    <>
                      <div className="w-3 h-3 border-2 border-[var(--text-muted)] border-t-transparent rounded-full animate-spin" />
                      테스트 중...
                    </>
                  ) : (
                    '연결 테스트'
                  )}
                </button>
              </div>
              {testResult === 'success' && (
                <p className="text-xs text-[var(--success)]">연결 성공! 비밀번호가 안전하게 저장되었습니다.</p>
              )}
              {testResult === 'error' && (
                <p className="text-xs text-[var(--error)]">연결 실패. 서버 주소와 인증 정보를 확인해주세요.</p>
              )}
              <p className="text-xs text-[var(--text-muted)]">
                비밀번호는 로컬 암호화 저장소(safeStorage)에만 보관됩니다. 외부 전송 없음.
              </p>
            </div>
          </div>
        </div>

        {/* LLM Settings */}
        <div className="border-t border-[var(--border-light)] pt-4">
          <div className="flex items-center gap-2 mb-4">
            <FiCpu size={14} className="text-[var(--text-muted)]" />
            <span className="text-sm font-medium text-[var(--text-primary)]">LLM 모델 설정</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="분석 모델"
              value={selectedModel}
              onChange={setSelectedModel}
              options={LLM_MODELS}
            />
            <Select
              label="폴링 주기"
              value={pollingInterval}
              onChange={(v) => setPollingInterval(parseInt(v))}
              options={POLLING_INTERVALS}
            />
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-2">
            Ollama가 로컬에 설치되어 있어야 합니다. 모든 분석은 PC 내에서 처리됩니다.
          </p>
        </div>
      </div>
    </SettingsSection>
  )
}

// Generate a unique member key (in real app, this would come from the server)
const USER_MEMBER_KEY = 'DOT-USER-7K3M'

export function Settings({ sidebarMenus, onMenuToggle, onShowToast }: SettingsProps): JSX.Element {
  // Profile State
  const [profile, setProfile] = useState({
    name: 'User',
    email: 'user@example.com',
    role: 'Developer'
  })
  const [keyCopied, setKeyCopied] = useState(false)

  const handleCopyKey = (): void => {
    navigator.clipboard.writeText(USER_MEMBER_KEY)
    setKeyCopied(true)
    setTimeout(() => setKeyCopied(false), 2000)
  }

  // Notification Settings State
  const [notifications, setNotifications] = useState({
    enabled: true,
    urgentAlarm: true,
    urgentRepeat: 3,
    urgentInterval: 5,
    warningAlarm: true,
    warningRepeat: 1,
    sound: 'default',
    desktop: true
  })

  const [statusBadges, setStatusBadges] = useState<StatusBadge[]>([
    { id: 'urgent', label: '긴급', color: '#EF4444', textColor: '#EF4444', threshold: 1 },
    { id: 'warning', label: '주의', color: '#F97316', textColor: '#F97316', threshold: 3 },
    { id: 'safe', label: '여유', color: '#22C55E', textColor: '#22C55E' }
  ])
  const [editingStatus, setEditingStatus] = useState<string | null>(null)
  const [statusEditValue, setStatusEditValue] = useState('')

  const handleStatusThresholdChange = (index: number, newThreshold: number) => {
    setStatusBadges(prev => {
      const next = [...prev]
      next[index] = { ...next[index], threshold: newThreshold }
      // Cascade bump subsequent thresholds
      for (let i = index + 1; i < next.length - 1; i++) {
        const prevTh = next[i - 1].threshold!
        if (next[i].threshold! <= prevTh) {
           next[i] = { ...next[i], threshold: prevTh + 1 }
        }
      }
      return next
    })
  }

  const addStatusBadge = () => {
    setStatusBadges(prev => {
      const lastRegularBadge = prev[prev.length - 2] || prev[0]
      const newThreshold = (lastRegularBadge?.threshold || 0) + 2
      
      const newBadge: StatusBadge = {
        id: Date.now().toString(),
        label: '신규 상태',
        color: '#3B82F6',
        textColor: '#3B82F6',
        threshold: newThreshold
      }
      const next = [...prev]
      next.splice(next.length - 1, 0, newBadge)
      return next
    })
  }

  const removeStatusBadge = (id: string) => {
    setStatusBadges(prev => {
      if (prev.length <= 2) return prev // Ensure at least 1 threshold + 1 fallback remains
      // do not allow removing the exact last item (fallback) directly by id check if we wanted, 
      // but UI won't show delete on fallback anyway
      return prev.filter(b => b.id !== id)
    })
  }

  // Category Badge State
  const [categoryBadges, setCategoryBadges] = useState<CategoryBadge[]>([
    { id: '1', label: 'AMS', color: 'indigo' },
    { id: '2', label: 'WAS', color: 'pink' },
    { id: '3', label: 'Frontend', color: 'sky' },
    { id: '4', label: 'Backend', color: 'green' },
    { id: '5', label: 'QA', color: 'teal' },
    { id: '6', label: 'MARKETING', color: 'orange' },
    { id: '7', label: 'BIZ', color: 'amber' }
  ])
  const [newCategory, setNewCategory] = useState({ label: '', color: 'indigo' as keyof typeof BADGE_COLORS })
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const categoryEditRef = useRef<HTMLDivElement>(null)

  // Outside click handler for category edit
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (editingCategory && categoryEditRef.current && !categoryEditRef.current.contains(e.target as Node)) {
        setEditingCategory(null)
        setNewCategory({ label: '', color: 'indigo' })
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [editingCategory])

  // Handlers
  const updateStatusBadge = (id: string, updates: Partial<StatusBadge>): void => {
    setStatusBadges((prev) =>
      prev.map((badge) => (badge.id === id ? { ...badge, ...updates } : badge))
    )
  }

  const startEditStatus = (badge: StatusBadge): void => {
    setEditingStatus(badge.id)
    setStatusEditValue(badge.label)
  }

  const saveStatusEdit = (id: string): void => {
    updateStatusBadge(id, { label: statusEditValue })
    setEditingStatus(null)
  }

  const addCategoryBadge = (): void => {
    if (!newCategory.label.trim()) return
    setCategoryBadges((prev) => [
      ...prev,
      { id: Date.now().toString(), label: newCategory.label.toUpperCase(), color: newCategory.color }
    ])
    setNewCategory({ label: '', color: 'indigo' })
  }

  const deleteCategoryBadge = (id: string): void => {
    setCategoryBadges((prev) => prev.filter((badge) => badge.id !== id))
  }

  const updateCategoryBadge = (id: string, updates: Partial<CategoryBadge>): void => {
    setCategoryBadges((prev) =>
      prev.map((badge) => (badge.id === id ? { ...badge, ...updates } : badge))
    )
  }

  const startEditCategory = (badge: CategoryBadge): void => {
    setEditingCategory(badge.id)
    setNewCategory({ label: badge.label, color: badge.color })
  }

  const saveEditCategory = (): void => {
    if (!newCategory.label.trim() || !editingCategory) return
    updateCategoryBadge(editingCategory, {
      label: newCategory.label.toUpperCase(),
      color: newCategory.color
    })
    setEditingCategory(null)
    setNewCategory({ label: '', color: 'indigo' })
  }


  return (
    <div className="h-full overflow-auto bg-white">
      <div className="max-w-[1200px] mx-auto px-8 py-5 space-y-5">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'Settings' }]} />

        {/* Header */}
        <header>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Settings</h1>
          <p className="text-sm text-[var(--text-placeholder)] mt-1">
            Customize your workspace and preferences
          </p>
        </header>

        {/* Profile Section */}
        <SettingsSection
          icon={<FiUser size={16} />}
          title="Profile"
          description="Manage your personal information"
        >
          <div className="space-y-5">
            <div className="flex items-start gap-6">
              <div className="flex flex-col items-center gap-2">
                <Avatar name={profile.name} size="xl" gradient />
                <Button variant="ghost" size="xs">
                  Change
                </Button>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <InputField
                  label="Name"
                  value={profile.name}
                  onChange={(value) => setProfile((p) => ({ ...p, name: value }))}
                  placeholder="Your name"
                />
                <InputField
                  label="Role"
                  value={profile.role}
                  onChange={(value) => setProfile((p) => ({ ...p, role: value }))}
                  placeholder="Your role"
                />
                <div className="col-span-2">
                  <InputField
                    label="Email"
                    value={profile.email}
                    onChange={(value) => setProfile((p) => ({ ...p, email: value }))}
                    placeholder="your@email.com"
                    type="email"
                  />
                </div>
              </div>
            </div>

            {/* Member Key */}
            <div className="pt-4 border-t border-[var(--border-light)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiKey size={14} className="text-[var(--text-muted)]" />
                  <span className="text-xs font-medium text-[var(--text-secondary)]">Member Key</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-[var(--bg-secondary)] rounded-md text-sm font-mono font-medium text-[var(--text-primary)] tracking-wider">
                    {USER_MEMBER_KEY}
                  </span>
                  <button
                    onClick={handleCopyKey}
                    className="h-8 px-2 flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-md transition-colors"
                  >
                    <FiCopy size={12} />
                    {keyCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-2">
                Share this key with others to let them invite you to their team.
              </p>
            </div>
          </div>
        </SettingsSection>

        {/* Notification Section */}
        <SettingsSection
          icon={<FiBell size={16} />}
          title="Notifications & Alarms"
          description="Configure how you receive alerts for tasks"
        >
          <div className="space-y-5">
            {/* Master Toggle */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Enable Notifications</p>
                <p className="text-xs text-[var(--text-placeholder)]">Receive alerts for task updates</p>
              </div>
              <Toggle
                checked={notifications.enabled}
                onChange={(checked) => setNotifications((n) => ({ ...n, enabled: checked }))}
              />
            </div>

            {notifications.enabled && (
              <>
                <div className="border-t border-[var(--border-light)] pt-4">
                  {/* Urgent Alarm Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Dot color="error" size="sm" />
                      <span className="text-sm font-medium text-[var(--text-primary)]">Urgent Tasks</span>
                    </div>
                    <div className="pl-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--text-secondary)]">Enable alarm</span>
                        <Toggle
                          checked={notifications.urgentAlarm}
                          onChange={(checked) =>
                            setNotifications((n) => ({ ...n, urgentAlarm: checked }))
                          }
                        />
                      </div>
                      {notifications.urgentAlarm && (
                        <div className="grid grid-cols-2 gap-3">
                          <Select
                            label="Repeat count"
                            value={notifications.urgentRepeat}
                            onChange={(v) =>
                              setNotifications((n) => ({ ...n, urgentRepeat: parseInt(v) }))
                            }
                            options={[
                              { label: '1 time', value: 1 },
                              { label: '2 times', value: 2 },
                              { label: '3 times', value: 3 },
                              { label: '5 times', value: 5 },
                              { label: 'Until dismissed', value: 0 }
                            ]}
                          />
                          <Select
                            label="Interval (minutes)"
                            value={notifications.urgentInterval}
                            onChange={(v) =>
                              setNotifications((n) => ({ ...n, urgentInterval: parseInt(v) }))
                            }
                            options={[
                              { label: '1 min', value: 1 },
                              { label: '5 min', value: 5 },
                              { label: '10 min', value: 10 },
                              { label: '15 min', value: 15 },
                              { label: '30 min', value: 30 }
                            ]}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-[var(--border-light)] pt-4">
                  {/* Warning Alarm Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Dot color="warning" size="sm" />
                      <span className="text-sm font-medium text-[var(--text-primary)]">Due Soon Tasks</span>
                    </div>
                    <div className="pl-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--text-secondary)]">Enable alarm</span>
                        <Toggle
                          checked={notifications.warningAlarm}
                          onChange={(checked) =>
                            setNotifications((n) => ({ ...n, warningAlarm: checked }))
                          }
                        />
                      </div>
                      {notifications.warningAlarm && (
                        <Select
                          label="Repeat count"
                          value={notifications.warningRepeat}
                          onChange={(v) =>
                            setNotifications((n) => ({ ...n, warningRepeat: parseInt(v) }))
                          }
                          options={[
                            { label: '1 time', value: 1 },
                            { label: '2 times', value: 2 },
                            { label: '3 times', value: 3 }
                          ]}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-[var(--border-light)] pt-4">
                  {/* General Settings */}
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="Notification Sound"
                      value={notifications.sound}
                      onChange={(v) => setNotifications((n) => ({ ...n, sound: v }))}
                      options={[
                        { label: 'Default', value: 'default' },
                        { label: 'Chime', value: 'chime' },
                        { label: 'Bell', value: 'bell' },
                        { label: 'Alert', value: 'alert' },
                        { label: 'None', value: 'none' }
                      ]}
                    />
                    <div className="flex items-end pb-1">
                      <Toggle
                        checked={notifications.desktop}
                        onChange={(checked) =>
                          setNotifications((n) => ({ ...n, desktop: checked }))
                        }
                        label="Desktop notifications"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </SettingsSection>

        {/* Sidebar Customization */}
        <SettingsSection
          icon={<FiMenu size={16} />}
          title="Sidebar Menu"
          description="Choose which menu items to display"
        >
          <div className="space-y-2">
            {sidebarMenus.map((menu) => (
              <div
                key={menu.id}
                className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <span
                  className={`text-sm ${
                    menu.enabled ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
                  }`}
                >
                  {menu.label}
                </span>
                <Toggle
                  checked={menu.enabled}
                  onChange={() => onMenuToggle(menu.id)}
                />
              </div>
            ))}
          </div>
        </SettingsSection>

        {/* Status Badge Settings */}
        <SettingsSection
          icon={<FiAlertCircle size={16} />}
          title="Status Badges & Auto-rules"
          description="마감일(D-Day)에 따른 상태 뱃지의 전환 기준 기한(Threshold)을 무제한으로 커스텀하세요."
        >
          <div className="space-y-4">
            {statusBadges.map((badge, idx) => {
              const isFirst = idx === 0
              const isLast = idx === statusBadges.length - 1
              
              const prevThreshold = isFirst ? 0 : statusBadges[idx - 1].threshold!

              let description = ''
              if (isLast) {
                description = `마감 ${prevThreshold + 1}일 이상 남은 '그 외 모든 일정'을 뜻합니다.`
              } else if (isFirst) {
                description = `설정한 기한(${badge.threshold}일)만큼 남았거나 지났을 때 표시됩니다.`
              } else {
                description = `앞선 단계에 해당되지 않으면서 ${badge.threshold}일 이하로 남았을 때 표시됩니다.`
              }

              return (
                <div
                  key={badge.id}
                  className={`p-3.5 border rounded-xl transition-all ${editingStatus === badge.id ? 'border-[var(--primary)] bg-primary/5 shadow-sm' : 'border-[var(--border-light)] bg-white hover:border-[var(--border-default)]'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Dot color={badge.color} size="md" />
                      {editingStatus === badge.id ? (
                        <input
                          type="text"
                          value={statusEditValue}
                          onChange={(e) => setStatusEditValue(e.target.value)}
                          className="h-8 px-2 w-28 bg-white border border-[var(--border-default)] rounded-md text-sm text-[var(--text-primary)] font-bold focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                          autoFocus
                          placeholder="라벨"
                        />
                      ) : (
                        <span className="text-[13px] font-bold tracking-wide" style={{ color: badge.color }}>
                          {badge.label}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <ColorPicker
                        value={badge.color}
                        onChange={(color) => updateStatusBadge(badge.id, { color, textColor: color })}
                        colors={STATUS_COLORS}
                      />
                      <div className="w-px h-3 bg-[var(--border-default)] mx-1" />
                      {editingStatus === badge.id ? (
                        <>
                          <button onClick={() => saveStatusEdit(badge.id)} className="w-6 h-6 flex items-center justify-center rounded-md bg-[var(--primary)] text-white hover:opacity-90 transition-opacity">
                            <FiCheck size={13} />
                          </button>
                          <button onClick={() => setEditingStatus(null)} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors">
                            <FiX size={13} />
                          </button>
                        </>
                      ) : (
                        <button onClick={() => startEditStatus(badge)} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors">
                          <FiEdit2 size={13} />
                        </button>
                      )}
                      
                      {!isLast && statusBadges.length > 2 && (
                        <button onClick={() => removeStatusBadge(badge.id)} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-[var(--error)]/10 text-[var(--text-muted)] hover:text-[var(--error)] transition-colors">
                          <FiTrash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-[var(--border-light)] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-medium text-[var(--text-placeholder)] tracking-wide">{description}</span>
                    </div>
                    
                    {!isLast && (
                      <div className="flex items-center gap-1.5 bg-[var(--bg-secondary)] px-2.5 py-1.5 rounded-[8px] border border-[var(--border-light)] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                        <span className="text-[11px] font-medium text-[var(--text-secondary)]">마감</span>
                        <div className="relative">
                          <select
                            value={badge.threshold}
                            onChange={(e) => handleStatusThresholdChange(idx, parseInt(e.target.value))}
                            className="text-[12px] font-bold text-[var(--primary)] bg-transparent appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--primary)] rounded text-center pl-1 pr-3 py-0.5"
                          >
                             {Array.from({length: 61}, (_, i) => i).map(v => (
                                <option key={v} value={v} disabled={!isFirst && v <= prevThreshold}>{v}일</option>
                             ))}
                          </select>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg width="8" height="8" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                               <path d="M3 4.5L6 7.5L9 4.5" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                        <span className="text-[11px] font-medium text-[var(--text-secondary)]">이하 잔여 시 전환</span>
                      </div>
                    )}
                    {isLast && (
                       <div className="flex items-center bg-[var(--bg-secondary)] px-3 py-1.5 rounded-[8px] border border-[var(--border-light)]">
                         <span className="text-[11px] font-bold text-[var(--success)] tracking-wide">그 외 전부 적용</span>
                       </div>
                    )}
                  </div>
                </div>
              )
            })}
            
            <button
              onClick={addStatusBadge}
              className="w-full h-10 mt-2 flex items-center justify-center gap-2 border border-dashed border-[var(--border-default)] rounded-xl text-sm font-semibold text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all"
            >
              <FiPlus size={16} />
              새 상태 규칙 추가하기
            </button>
          </div>
        </SettingsSection>

        {/* Category Badge Settings */}
        <SettingsSection
          icon={<FiTag size={16} />}
          title="Category Badges"
          description="Manage project and category tags"
        >
          <div className="space-y-4" ref={categoryEditRef}>
            {/* Add/Edit Category */}
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <InputField
                  label={editingCategory ? 'Edit Category' : 'New Category'}
                  value={newCategory.label}
                  onChange={(value) => setNewCategory((c) => ({ ...c, label: value }))}
                  placeholder="Enter category name"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">Color</label>
                <div className="h-9 px-2 flex items-center gap-1.5 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-md">
                  {STATUS_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => {
                        const colorKey = Object.entries(BADGE_COLORS).find(
                          ([, v]) => v.hex === color.value
                        )?.[0] as keyof typeof BADGE_COLORS | undefined
                        if (colorKey) {
                          setNewCategory((c) => ({ ...c, color: colorKey }))
                        }
                      }}
                      className={`w-5 h-5 rounded-full transition-all shrink-0 ${
                        BADGE_COLORS[newCategory.color]?.hex === color.value
                          ? 'ring-2 ring-offset-1 ring-[var(--primary)] scale-110'
                          : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
              {editingCategory ? (
                <div className="flex gap-1.5">
                  <button
                    onClick={saveEditCategory}
                    disabled={!newCategory.label.trim()}
                    className="h-9 px-3 flex items-center gap-1.5 bg-[var(--primary)] text-white text-xs font-medium rounded-md hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiCheck size={14} />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      deleteCategoryBadge(editingCategory)
                      setEditingCategory(null)
                      setNewCategory({ label: '', color: 'indigo' })
                    }}
                    className="h-9 px-3 flex items-center gap-1.5 bg-[var(--error)]/10 text-[var(--error)] text-xs font-medium rounded-md hover:bg-[var(--error)]/20 transition-colors"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={addCategoryBadge}
                  disabled={!newCategory.label.trim()}
                  className="h-9 px-3 flex items-center gap-1.5 bg-[var(--primary)] text-white text-xs font-medium rounded-md hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiPlus size={14} />
                  Add
                </button>
              )}
            </div>

            {/* Category List */}
            <div className="border-t border-[var(--border-light)] pt-4">
              <p className="text-xs text-[var(--text-muted)] mb-3">Click badge to edit</p>
              <div className="flex flex-wrap gap-2">
                {categoryBadges.map((badge) => (
                  <span
                    key={badge.id}
                    className={`inline-flex items-center px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-semibold tracking-wide uppercase cursor-pointer transition-all ${
                      editingCategory === badge.id
                        ? 'ring-2 ring-[var(--primary)] ring-offset-1'
                        : 'hover:opacity-80'
                    }`}
                    style={{
                      backgroundColor: BADGE_COLORS[badge.color].bg,
                      color: BADGE_COLORS[badge.color].text
                    }}
                    onClick={() => startEditCategory(badge)}
                    title="Click to edit"
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Mail Analysis Settings */}
        <MailSettingsSection onShowToast={onShowToast} />

        {/* Save Button */}
        <div className="flex justify-end gap-3 pt-2 pb-6">
          <Button variant="secondary">Cancel</Button>
          <Button onClick={() => onShowToast?.('Settings saved', 'Your changes have been saved successfully.')}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
