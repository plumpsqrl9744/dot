import { JSX, useState, useRef, useEffect } from 'react'
import { FiArrowLeft, FiEdit2, FiTrash2, FiCheck, FiX, FiChevronDown, FiCalendar, FiUser, FiTag, FiClock, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Button, Badge, Avatar, Dot, Breadcrumb } from '@renderer/shared/components'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface TaskDetailProps {
  taskId: string | null
  isNew?: boolean
  onBack: () => void
}

interface TaskData {
  id: string
  title: string
  description?: string
  completed: boolean
  tag?: string
  dueDate?: string
  dueStatus?: 'urgent' | 'warning' | 'safe'
  assignedBy?: string
  createdAt?: string
}

const MOCK_TAGS = ['기획', '디자인', '개발', '마케팅', '프론트엔드', '백엔드', 'AMS', 'WAS']
const FOLLOW_LIST = ['본인', '김철수', '이영희', '박지성', '손흥민']

const AMPM = ['오전', '오후'] as const
const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

const parseTime = (timeStr: string) => {
  const [hStr, mStr] = timeStr.split(':')
  let h = parseInt(hStr, 10)
  const ampm = h >= 12 ? '오후' : '오전'
  if (h === 0) h = 12
  else if (h > 12) h -= 12
  return { ampm: ampm as '오전' | '오후', hour: String(h).padStart(2, '0'), minute: mStr || '00' }
}

const formatTime = (ampm: '오전' | '오후', hour: string, minute: string) => {
  let h = parseInt(hour, 10)
  if (ampm === '오후' && h < 12) h += 12
  if (ampm === '오전' && h === 12) h = 0
  return `${String(h).padStart(2, '0')}:${minute}`
}

// Mock data
const mockTasks: Record<string, TaskData> = {
  '1': {
    id: '1',
    title: '마케팅 미팅 회의록 정리',
    description: '3월 마케팅 전략 회의 내용을 정리하고 팀원들에게 공유합니다.\n\n- 신규 캠페인 아이디어 정리\n- 예산 배분 논의 내용\n- 다음 미팅 일정 확정',
    completed: false,
    tag: '마케팅',
    dueDate: '2026-03-24 18:00',
    dueStatus: 'urgent',
    assignedBy: '김철수',
    createdAt: '2026-03-15'
  },
  '2': {
    id: '2',
    title: '클라이언트 메일 발송',
    description: '프로젝트 진행 상황 업데이트 메일을 클라이언트에게 발송합니다.',
    completed: true,
    tag: 'AMS',
    dueDate: '2026-03-18 10:00',
    dueStatus: 'safe',
    createdAt: '2026-03-18'
  }
}

export function TaskDetail({ taskId, isNew = false, onBack }: TaskDetailProps): JSX.Element {
  const defaultDateStr = format(new Date(), 'yyyy-MM-dd')
  const initialTask = isNew ? {
    id: 'new',
    title: '',
    description: '',
    completed: false,
    createdAt: defaultDateStr
  } : mockTasks[taskId || '1'] || {
    id: taskId || 'unknown',
    title: `Task ${taskId}`,
    description: '상세 내용이 없습니다.',
    completed: false,
    createdAt: defaultDateStr
  }

  const [isEditing, setIsEditing] = useState(isNew)
  
  const [editForm, setEditForm] = useState({
    title: initialTask.title,
    description: initialTask.description || '',
    tag: initialTask.tag || '',
    dueDateObj: {
      isSameDay: true,
      startDate: new Date() as Date | null,
      endDate: new Date() as Date | null,
      time: '18:00'
    },
    assignedBy: initialTask.assignedBy || '본인'
  })

  // Popover states
  const [openDropdown, setOpenDropdown] = useState<'tag' | 'dueDate' | 'assignee' | null>(null)
  const [showTimeDropdown, setShowTimeDropdown] = useState(false)
  const tagRef = useRef<HTMLDivElement>(null)
  const dueDateRef = useRef<HTMLDivElement>(null)
  const assigneeRef = useRef<HTMLDivElement>(null)
  const timeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (openDropdown === 'tag' && tagRef.current && !tagRef.current.contains(e.target as Node)) setOpenDropdown(null)
      if (openDropdown === 'dueDate' && dueDateRef.current && !dueDateRef.current.contains(e.target as Node)) {
        if (!timeRef.current?.contains(e.target as Node)) {
          setOpenDropdown(null)
          setShowTimeDropdown(false)
        }
      }
      if (openDropdown === 'assignee' && assigneeRef.current && !assigneeRef.current.contains(e.target as Node)) setOpenDropdown(null)
      if (showTimeDropdown && timeRef.current && !timeRef.current.contains(e.target as Node)) setShowTimeDropdown(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openDropdown, showTimeDropdown])

  const task = initialTask

  const handleEdit = (): void => {
    setIsEditing(true)
  }

  const handleCancel = (): void => {
    setEditForm({
      title: task.title,
      description: task.description || '',
      tag: task.tag || '',
      dueDateObj: editForm.dueDateObj, // Retain what we had or reset.
      assignedBy: task.assignedBy || '본인'
    })
    setIsEditing(false)
  }

  const handleSave = (): void => {
    console.log('Saving:', editForm)
    setIsEditing(false)
  }

  const handleChange = (field: string, value: string): void => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  const formatDueDate = (): string => {
    const { isSameDay, startDate, endDate, time } = editForm.dueDateObj
    if (!startDate) return '날짜 선택'
    
    const startStr = format(startDate, 'yyyy-MM-dd')
    if (isSameDay) return `${startStr} ${time}`
    
    const endStr = endDate ? format(endDate, 'yyyy-MM-dd') : '?'
    return `${startStr} ~ ${endStr} ${time}`
  }

  const renderCustomHeader = ({ date, decreaseMonth, increaseMonth }: any): JSX.Element => (
    <div className="flex items-center justify-between px-2 pt-1 pb-2">
      <button
        type="button"
        onClick={decreaseMonth}
        className="p-1 hover:bg-[var(--bg-secondary)] rounded border border-transparent hover:border-[var(--border-light)] text-[var(--text-placeholder)] hover:text-[var(--text-primary)] transition-all"
      >
        <FiChevronLeft size={16} />
      </button>
      <span className="text-[14px] font-[800] text-[var(--text-primary)] tracking-wide select-none">
        {date.getFullYear()}년 {date.getMonth() + 1}월
      </span>
      <button
        type="button"
        onClick={increaseMonth}
        className="p-1 hover:bg-[var(--bg-secondary)] rounded border border-transparent hover:border-[var(--border-light)] text-[var(--text-placeholder)] hover:text-[var(--text-primary)] transition-all"
      >
        <FiChevronRight size={16} />
      </button>
    </div>
  )

  return (
    <div className="h-full overflow-auto bg-white">
      <div className="max-w-[1200px] mx-auto px-8 py-5 space-y-5">
        <Breadcrumb items={[{ label: 'My Tasks', href: '#' }, { label: task.title || 'New Task' }]} />

        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <FiArrowLeft size={16} />
            <span>뒤로가기</span>
          </button>
          <span className="text-xs text-[var(--text-placeholder)]">
            생성일 {task.createdAt}
          </span>
        </div>

        <div className="bg-[var(--bg-default)] rounded-[var(--radius-lg)] border border-[var(--border-default)] pb-8">
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {task.dueStatus === 'urgent' && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[var(--radius-sm)] bg-[var(--error)]/10 text-[var(--error)] text-[10px] font-semibold">
                    <Dot color="error" size="xs" />
                    긴급
                  </span>
                )}
                {(!isEditing && task.tag) && <Badge label={task.tag} />}
                {task.completed && (
                  <Badge label="완료" variant="gray" size="sm" uppercase={false} />
                )}
              </div>
              <div className="flex items-center gap-1">
                {isEditing ? (
                  <>
                    <Button variant="ghost" size="xs" icon={<FiCheck size={13} />} onClick={handleSave}>Save</Button>
                    <Button variant="ghost" size="xs" icon={<FiX size={13} />} onClick={handleCancel}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="xs" icon={<FiEdit2 size={13} />} onClick={handleEdit}>Edit</Button>
                    <Button variant="ghost" size="xs" icon={<FiTrash2 size={13} />} className="text-[var(--error)] hover:text-[var(--error)]">Delete</Button>
                  </>
                )}
              </div>
            </div>

            {isEditing ? (
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full text-lg font-semibold text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-md px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                placeholder="태스크 제목을 입력하세요"
              />
            ) : (
              <h1 className={`text-lg font-semibold ${task.completed ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-primary)]'}`}>
                {task.title || '제목 없음'}
              </h1>
            )}
            <p className="text-[11px] text-[var(--text-placeholder)] mt-1">
              DOT-{task.id.toUpperCase()}
            </p>

            <div className="flex items-center gap-4 mt-6">
              {isEditing ? (
                <>
                  {/* Tag Dropdown */}
                  <div className="relative" ref={tagRef}>
                    <button
                      onClick={() => setOpenDropdown(prev => prev === 'tag' ? null : 'tag')}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-md hover:bg-[var(--bg-hover)] transition-colors text-[var(--text-primary)]"
                    >
                      <FiTag size={12} className="text-[var(--text-muted)]" />
                      {editForm.tag || '태그 선택'}
                      <FiChevronDown size={12} className="ml-1 text-[var(--text-placeholder)]" />
                    </button>
                    {openDropdown === 'tag' && (
                      <div className="absolute top-10 left-0 w-40 bg-white border border-[var(--border-default)] shadow-lg rounded-md overflow-hidden z-20">
                        <div className="max-h-48 overflow-y-auto py-1">
                          {MOCK_TAGS.map(tag => (
                            <button
                              key={tag}
                              onClick={() => { handleChange('tag', tag); setOpenDropdown(null) }}
                              className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--bg-hover)] text-[var(--text-primary)] transition-colors"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Due Date Dropdown using React-Datepicker */}
                  <div className="relative" ref={dueDateRef}>
                    <button
                      onClick={() => setOpenDropdown(prev => prev === 'dueDate' ? null : 'dueDate')}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-md hover:bg-[var(--bg-hover)] transition-colors text-[var(--text-primary)]"
                    >
                      <FiCalendar size={12} className="text-[var(--text-muted)]" />
                      {formatDueDate()}
                      <FiChevronDown size={12} className="ml-1 text-[var(--text-placeholder)]" />
                    </button>
                    {openDropdown === 'dueDate' && (
                      <div className="absolute top-10 left-0 p-4 bg-white border border-[var(--border-light)] shadow-[0_4px_24px_rgba(0,0,0,0.08)] rounded-xl z-20 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center justify-between border-b border-[var(--border-light)] pb-4 gap-6 px-1">
                          <label className="flex items-center gap-2 text-xs font-bold cursor-pointer text-[var(--text-primary)] select-none">
                            <input
                              type="checkbox"
                              checked={editForm.dueDateObj.isSameDay}
                              onChange={(e) => {
                                const isSameDay = e.target.checked
                                setEditForm(prev => {
                                  const { startDate, endDate } = prev.dueDateObj
                                  const nextStartDate = (isSameDay && endDate) ? endDate : startDate
                                  
                                  return {
                                    ...prev,
                                    dueDateObj: { 
                                      ...prev.dueDateObj, 
                                      isSameDay,
                                      startDate: nextStartDate,
                                      endDate: isSameDay ? nextStartDate : endDate
                                    }
                                  }
                                })
                              }}
                              className="rounded border-[var(--border-default)] text-primary focus:ring-primary accent-primary w-3.5 h-3.5"
                            />
                            당일 마감
                          </label>
                          <div className="relative" ref={timeRef}>
                            <div 
                              onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                              className="flex items-center gap-1.5 py-1.5 px-3 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg hover:border-primary/50 transition-all cursor-pointer select-none"
                            >
                              <FiClock size={13} className="text-[var(--text-muted)] mt-0.5" />
                              <span className="text-[13px] font-bold tracking-wide text-[var(--text-primary)]">
                                {parseTime(editForm.dueDateObj.time).ampm} {parseTime(editForm.dueDateObj.time).hour}:{parseTime(editForm.dueDateObj.time).minute}
                              </span>
                            </div>

                            {showTimeDropdown && (
                              <div className="absolute top-10 right-0 w-44 h-48 bg-white border border-[var(--border-light)] shadow-[0_4px_24px_rgba(0,0,0,0.12)] rounded-xl z-30 flex overflow-hidden cursor-default animate-in fade-in slide-in-from-top-1" onClick={e => e.stopPropagation()}>
                                <div className="flex-[0.8] overflow-y-auto time-scrollbar border-r border-[var(--border-light)] bg-white">
                                  {AMPM.map((a) => (
                                    <button
                                      key={a}
                                      type="button"
                                      className={`w-full text-center py-2.5 text-[12px] font-bold ${parseTime(editForm.dueDateObj.time).ampm === a ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'}`}
                                      onClick={() => {
                                        const p = parseTime(editForm.dueDateObj.time)
                                        setEditForm(prev => ({...prev, dueDateObj: {...prev.dueDateObj, time: formatTime(a, p.hour, p.minute)}}))
                                      }}
                                    >
                                      {a}
                                    </button>
                                  ))}
                                </div>
                                <div className="flex-1 overflow-y-auto time-scrollbar border-r border-[var(--border-light)] bg-white">
                                  {HOURS_12.map((h) => (
                                    <button
                                      key={h}
                                      type="button"
                                      className={`w-full text-center py-2.5 text-[12px] font-bold ${parseTime(editForm.dueDateObj.time).hour === h ? 'bg-primary/10 text-primary' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'}`}
                                      onClick={() => {
                                        const p = parseTime(editForm.dueDateObj.time)
                                        setEditForm(prev => ({...prev, dueDateObj: {...prev.dueDateObj, time: formatTime(p.ampm, h, p.minute)}}))
                                      }}
                                    >
                                      {h}
                                    </button>
                                  ))}
                                </div>
                                <div className="flex-1 overflow-y-auto time-scrollbar bg-white">
                                  {MINUTES.map((m) => (
                                    <button
                                      key={m}
                                      type="button"
                                      className={`w-full text-center py-2.5 text-[12px] font-bold ${parseTime(editForm.dueDateObj.time).minute === m ? 'bg-primary/10 text-primary' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'}`}
                                      onClick={() => {
                                        const p = parseTime(editForm.dueDateObj.time)
                                        setEditForm(prev => ({...prev, dueDateObj: {...prev.dueDateObj, time: formatTime(p.ampm, p.hour, m)}}))
                                      }}
                                    >
                                      {m}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex justify-center">
                          {editForm.dueDateObj.isSameDay ? (
                            <DatePicker
                              selected={editForm.dueDateObj.startDate}
                              onChange={(date: Date | null) => {
                                setEditForm(prev => ({
                                  ...prev,
                                  dueDateObj: { ...prev.dueDateObj, startDate: date, endDate: date }
                                }))
                                setOpenDropdown(null)
                              }}
                              startDate={editForm.dueDateObj.startDate || undefined}
                              inline
                              locale={ko}
                              dateFormat="yyyy-MM-dd"
                              renderCustomHeader={renderCustomHeader}
                            />
                          ) : (
                            <DatePicker
                              selected={editForm.dueDateObj.startDate}
                              onChange={(dates: [Date | null, Date | null]) => {
                                const [start, end] = dates
                                setEditForm(prev => ({
                                  ...prev,
                                  dueDateObj: { ...prev.dueDateObj, startDate: start || prev.dueDateObj.startDate, endDate: end }
                                }))
                              }}
                              startDate={editForm.dueDateObj.startDate || undefined}
                              endDate={editForm.dueDateObj.endDate || undefined}
                              selectsRange
                              inline
                              locale={ko}
                              dateFormat="yyyy-MM-dd"
                              renderCustomHeader={renderCustomHeader}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Assignee Dropdown */}
                  <div className="relative" ref={assigneeRef}>
                    <button
                      onClick={() => setOpenDropdown(prev => prev === 'assignee' ? null : 'assignee')}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-md hover:bg-[var(--bg-hover)] transition-colors text-[var(--text-primary)]"
                    >
                      <Avatar name={editForm.assignedBy} size="xs" />
                      {editForm.assignedBy}
                      <FiChevronDown size={12} className="ml-1 text-[var(--text-placeholder)]" />
                    </button>
                    {openDropdown === 'assignee' && (
                      <div className="absolute top-10 left-0 w-40 bg-white border border-[var(--border-default)] shadow-lg rounded-md overflow-hidden z-20">
                        <div className="max-h-48 overflow-y-auto py-1">
                          {FOLLOW_LIST.map(name => (
                            <button
                              key={name}
                              onClick={() => { handleChange('assignedBy', name); setOpenDropdown(null) }}
                              className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-[var(--bg-hover)] text-[var(--text-primary)] transition-colors"
                            >
                              <Avatar name={name} size="xs" />
                              <span className="font-medium">{name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {task.dueDate && (
                    <div className="flex items-center gap-2 bg-[var(--bg-secondary)] px-3 py-1.5 rounded-md border border-[var(--border-light)]">
                      <FiCalendar size={12} className="text-[var(--text-muted)]" />
                      <span className="text-xs font-medium text-[var(--text-primary)]">{task.dueDate}</span>
                    </div>
                  )}
                  {task.assignedBy && (
                    <div className="flex items-center gap-2 bg-[var(--bg-secondary)] px-3 py-1.5 rounded-md border border-[var(--border-light)]">
                      <FiUser size={12} className="text-[var(--text-muted)]" />
                      <div className="flex items-center gap-1.5">
                        <Avatar name={task.assignedBy} size="xs" />
                        <span className="text-xs font-medium text-[var(--text-primary)]">{task.assignedBy}</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="border-t border-[var(--border-light)]" />

          <div className="p-5">
            <h3 className="text-xs font-medium text-[var(--text-muted)] mb-3">설명</h3>
            {isEditing ? (
              <textarea
                value={editForm.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={10}
                className="w-full text-sm text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-md px-3 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
                placeholder="태스크에 대한 상세한 설명을 작성하세요..."
              />
            ) : (
              <div className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                {task.description || '작성된 설명이 없습니다.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
