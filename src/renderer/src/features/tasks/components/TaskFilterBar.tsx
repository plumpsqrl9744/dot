import { useState, useRef, useEffect } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import type { TaskGroupBy, TaskSortBy } from '@renderer/types'

interface TaskFilterBarProps {
  groupBy: TaskGroupBy
  sortBy: TaskSortBy
  tagFilter: string | null
  availableTags: string[]
  onGroupByChange: (v: TaskGroupBy) => void
  onSortByChange: (v: TaskSortBy) => void
  onTagFilterChange: (v: string | null) => void
}

const GROUP_OPTIONS: { value: TaskGroupBy; label: string }[] = [
  { value: 'importance', label: '중요도별' },
  { value: 'category', label: '카테고리별' },
  { value: 'dueDate', label: '마감일별' },
  { value: 'none', label: '없음' }
]

const SORT_OPTIONS: { value: TaskSortBy; label: string }[] = [
  { value: 'importance', label: '중요도순' },
  { value: 'dueDate', label: '마감일순' },
  { value: 'createdAt', label: '생성일순' },
  { value: 'title', label: '이름순' }
]

function FilterDropdown<T extends string>({
  label,
  value,
  options,
  onChange
}: {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
}): React.JSX.Element {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent): void {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const current = options.find((o) => o.value === value)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
      >
        <span className="text-[var(--text-muted)]">{label}:</span>
        <span className="font-medium">{current?.label}</span>
        <FiChevronDown
          size={12}
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg border border-[var(--border-default)] shadow-lg py-1 z-10 min-w-[120px]">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
              className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                value === option.value
                  ? 'text-[var(--primary)] bg-[var(--primary)]/5 font-medium'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function TaskFilterBar({
  groupBy,
  sortBy,
  tagFilter,
  availableTags,
  onGroupByChange,
  onSortByChange,
  onTagFilterChange
}: TaskFilterBarProps): React.JSX.Element {
  const tagOptions: { value: string; label: string }[] = [
    { value: '', label: '전체' },
    ...availableTags.map((t) => ({ value: t, label: t }))
  ]

  return (
    <div className="flex items-center gap-1">
      <FilterDropdown label="그룹" value={groupBy} options={GROUP_OPTIONS} onChange={onGroupByChange} />
      <FilterDropdown
        label="태그"
        value={tagFilter || ''}
        options={tagOptions}
        onChange={(v) => onTagFilterChange(v || null)}
      />
      <FilterDropdown label="정렬" value={sortBy} options={SORT_OPTIONS} onChange={onSortByChange} />
    </div>
  )
}
