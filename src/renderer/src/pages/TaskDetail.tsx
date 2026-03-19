import { JSX, useState } from 'react'
import { FiArrowLeft, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi'
import { Button, Badge, Avatar, Dot, Breadcrumb } from '@renderer/shared/components'

interface TaskDetailProps {
  taskId: string
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

// Mock data - 실제로는 taskId로 데이터를 가져옴
const mockTasks: Record<string, TaskData> = {
  '1': {
    id: '1',
    title: '마케팅 미팅 회의록 정리',
    description: '3월 마케팅 전략 회의 내용을 정리하고 팀원들에게 공유합니다.\n\n- 신규 캠페인 아이디어 정리\n- 예산 배분 논의 내용\n- 다음 미팅 일정 확정',
    completed: false,
    tag: 'MARKETING',
    dueDate: 'D-1',
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
    dueDate: 'D-0',
    dueStatus: 'safe',
    createdAt: '2026-03-18'
  }
}

export function TaskDetail({ taskId, onBack }: TaskDetailProps): JSX.Element {
  const initialTask = mockTasks[taskId] || {
    id: taskId,
    title: `Task ${taskId}`,
    description: '상세 내용이 없습니다.',
    completed: false,
    createdAt: new Date().toISOString().split('T')[0]
  }

  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    title: initialTask.title,
    description: initialTask.description || '',
    tag: initialTask.tag || '',
    dueDate: initialTask.dueDate || '',
    assignedBy: initialTask.assignedBy || ''
  })

  const task = initialTask

  const handleEdit = (): void => {
    setIsEditing(true)
  }

  const handleCancel = (): void => {
    setEditForm({
      title: task.title,
      description: task.description || '',
      tag: task.tag || '',
      dueDate: task.dueDate || '',
      assignedBy: task.assignedBy || ''
    })
    setIsEditing(false)
  }

  const handleSave = (): void => {
    // TODO: 실제 저장 로직 구현
    console.log('Saving:', editForm)
    setIsEditing(false)
  }

  const handleChange = (field: keyof typeof editForm, value: string): void => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="h-full overflow-auto bg-white">
      <div className="max-w-[1200px] mx-auto px-8 py-5 space-y-5">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'My Tasks', href: '#' }, { label: task.title }]} />

        {/* Top Bar: Back + Created Date */}
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

        {/* Main Card */}
        <div className="bg-[var(--bg-default)] rounded-[var(--radius-lg)] border border-[var(--border-default)]">
          {/* Header */}
          <div className="p-5">
            {/* Top: Badges + Actions */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {task.dueStatus === 'urgent' && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[var(--radius-sm)] bg-[var(--error)]/10 text-[var(--error)] text-[10px] font-semibold">
                    <Dot color="error" size="xs" />
                    긴급
                  </span>
                )}
                {task.tag && <Badge label={task.tag} />}
                {task.completed && (
                  <Badge label="완료" variant="gray" size="sm" uppercase={false} />
                )}
              </div>
              <div className="flex items-center gap-1">
                {isEditing ? (
                  <>
                    <Button variant="ghost" size="xs" icon={<FiCheck size={13} />} onClick={handleSave}>
                      Save
                    </Button>
                    <Button variant="ghost" size="xs" icon={<FiX size={13} />} onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="xs" icon={<FiEdit2 size={13} />} onClick={handleEdit}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="xs" icon={<FiTrash2 size={13} />} className="text-[var(--error)] hover:text-[var(--error)]">
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Title */}
            {isEditing ? (
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full text-lg font-semibold text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="제목을 입력하세요"
              />
            ) : (
              <h1 className={`text-lg font-semibold ${task.completed ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-primary)]'}`}>
                {task.title}
              </h1>
            )}
            <p className="text-[11px] text-[var(--text-placeholder)] mt-1">
              DOT-{task.id.toUpperCase()}
            </p>

            {/* Meta: Due Date + Assignee + Tag */}
            <div className="flex items-center gap-4 mt-4">
              {isEditing ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--text-muted)]">태그</span>
                    <input
                      type="text"
                      value={editForm.tag}
                      onChange={(e) => handleChange('tag', e.target.value)}
                      className="w-24 text-xs font-medium bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="태그"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--text-muted)]">마감</span>
                    <input
                      type="text"
                      value={editForm.dueDate}
                      onChange={(e) => handleChange('dueDate', e.target.value)}
                      className="w-20 text-xs font-medium bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="D-0"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--text-muted)]">담당자</span>
                    <input
                      type="text"
                      value={editForm.assignedBy}
                      onChange={(e) => handleChange('assignedBy', e.target.value)}
                      className="w-24 text-xs font-medium bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="담당자"
                    />
                  </div>
                </>
              ) : (
                <>
                  {task.dueDate && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--text-muted)]">마감</span>
                      <span className="text-xs font-medium text-[var(--text-primary)]">{task.dueDate}</span>
                    </div>
                  )}
                  {task.assignedBy && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--text-muted)]">담당자</span>
                      <div className="flex items-center gap-1">
                        <Avatar name={task.assignedBy} size="xs" />
                        <span className="text-xs font-medium text-[var(--text-primary)]">{task.assignedBy}</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[var(--border-light)]" />

          {/* Description */}
          <div className="p-5">
            <h3 className="text-xs font-medium text-[var(--text-muted)] mb-2">설명</h3>
            {isEditing ? (
              <textarea
                value={editForm.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={6}
                className="w-full text-sm text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                placeholder="설명을 입력하세요"
              />
            ) : (
              <div className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                {task.description || '설명이 없습니다.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
