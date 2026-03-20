import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import type { Task, TaskFormData } from '../../types'
import { format } from 'date-fns'
import { parseTime } from '../../shared/utils'

interface UseTaskFormOptions {
  initialTask?: Task | null
  isNew?: boolean
}

interface UseTaskFormReturn {
  // 폼 데이터
  form: TaskFormData
  isEditing: boolean

  // 드롭다운 상태
  openDropdown: 'tag' | 'dueDate' | 'assignee' | null
  showTimeDropdown: boolean

  // Refs
  tagRef: React.RefObject<HTMLDivElement>
  dueDateRef: React.RefObject<HTMLDivElement>
  assigneeRef: React.RefObject<HTMLDivElement>
  timeRef: React.RefObject<HTMLDivElement>

  // 액션
  setIsEditing: (value: boolean) => void
  updateField: (field: keyof TaskFormData, value: any) => void
  updateDueDate: (updates: Partial<TaskFormData['dueDateObj']>) => void
  setOpenDropdown: (dropdown: 'tag' | 'dueDate' | 'assignee' | null) => void
  setShowTimeDropdown: (show: boolean) => void
  resetForm: () => void
  formatDueDate: () => string

  // 파생 상태
  parsedTime: { ampm: '오전' | '오후'; hour: string; minute: string }
}

export function useTaskForm({ initialTask, isNew = false }: UseTaskFormOptions): UseTaskFormReturn {
  // 초기 폼 데이터 생성
  const createInitialForm = useCallback(
    (): TaskFormData => ({
      title: initialTask?.title || '',
      description: initialTask?.description || '',
      tag: initialTask?.tag || '',
      dueDateObj: {
        isSameDay: true,
        startDate: new Date(),
        endDate: new Date(),
        time: '18:00'
      },
      assignedBy: initialTask?.assignedBy || '본인'
    }),
    [initialTask]
  )

  const [form, setForm] = useState<TaskFormData>(createInitialForm)
  const [isEditing, setIsEditing] = useState(isNew || !initialTask)
  const [openDropdown, setOpenDropdown] = useState<'tag' | 'dueDate' | 'assignee' | null>(null)
  const [showTimeDropdown, setShowTimeDropdown] = useState(false)

  // Refs
  const tagRef = useRef<HTMLDivElement>(null)
  const dueDateRef = useRef<HTMLDivElement>(null)
  const assigneeRef = useRef<HTMLDivElement>(null)
  const timeRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openDropdown === 'tag' && tagRef.current && !tagRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
      if (
        openDropdown === 'dueDate' &&
        dueDateRef.current &&
        !dueDateRef.current.contains(e.target as Node)
      ) {
        if (!timeRef.current?.contains(e.target as Node)) {
          setOpenDropdown(null)
          setShowTimeDropdown(false)
        }
      }
      if (
        openDropdown === 'assignee' &&
        assigneeRef.current &&
        !assigneeRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null)
      }
      if (showTimeDropdown && timeRef.current && !timeRef.current.contains(e.target as Node)) {
        setShowTimeDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openDropdown, showTimeDropdown])

  // 필드 업데이트
  const updateField = useCallback((field: keyof TaskFormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  // 날짜 업데이트
  const updateDueDate = useCallback((updates: Partial<TaskFormData['dueDateObj']>) => {
    setForm((prev) => ({
      ...prev,
      dueDateObj: { ...prev.dueDateObj, ...updates }
    }))
  }, [])

  // 폼 리셋
  const resetForm = useCallback(() => {
    setForm(createInitialForm())
    setIsEditing(false)
  }, [createInitialForm])

  // 마감일 포맷
  const formatDueDate = useCallback(() => {
    const { isSameDay, startDate, endDate, time } = form.dueDateObj
    if (!startDate) return '날짜 선택'

    const startStr = format(startDate, 'yyyy-MM-dd')
    if (isSameDay) return `${startStr} ${time}`

    const endStr = endDate ? format(endDate, 'yyyy-MM-dd') : '?'
    return `${startStr} ~ ${endStr} ${time}`
  }, [form.dueDateObj])

  // 파싱된 시간
  const parsedTime = useMemo(() => parseTime(form.dueDateObj.time), [form.dueDateObj.time])

  return {
    form,
    isEditing,
    openDropdown,
    showTimeDropdown,
    tagRef,
    dueDateRef,
    assigneeRef,
    timeRef,
    setIsEditing,
    updateField,
    updateDueDate,
    setOpenDropdown,
    setShowTimeDropdown,
    resetForm,
    formatDueDate,
    parsedTime
  }
}
