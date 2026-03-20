import { JSX, useState, useMemo } from 'react'
import { FiArrowLeft, FiEdit2, FiTrash2, FiCheck, FiX, FiPlus } from 'react-icons/fi'
import { Button, Badge, Breadcrumb, Card } from '@renderer/shared/components'
import { MOCK_TEMPLATES } from '../constants'
import type { TemplateTask } from '../types'

interface TemplateDetailProps {
  templateId: string | null
  isNew?: boolean
  onBack: () => void
}

export function TemplateDetail({
  templateId,
  isNew = false,
  onBack
}: TemplateDetailProps): JSX.Element {
  const templatesRecord = useMemo(
    () =>
      MOCK_TEMPLATES.reduce<
        Record<string, { id: string; name: string; description?: string; tasks: TemplateTask[]; createdAt: string }>
      >((acc, t) => {
        acc[t.id] = t
        return acc
      }, {}),
    []
  )

  const existingTemplate = templateId ? templatesRecord[templateId] : null

  const [isEditing, setIsEditing] = useState(isNew || !existingTemplate)
  const [editForm, setEditForm] = useState({
    name: existingTemplate?.name || '',
    description: existingTemplate?.description || '',
    tasks: existingTemplate?.tasks || ([] as TemplateTask[])
  })

  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskTag, setNewTaskTag] = useState('')

  const handleEdit = (): void => {
    setIsEditing(true)
  }

  const handleCancel = (): void => {
    if (isNew) {
      onBack()
    } else {
      setEditForm({
        name: existingTemplate?.name || '',
        description: existingTemplate?.description || '',
        tasks: existingTemplate?.tasks || []
      })
      setIsEditing(false)
    }
  }

  const handleSave = (): void => {
    console.log('Saving template:', editForm)
    setIsEditing(false)
  }

  const handleAddTask = (): void => {
    if (newTaskTitle.trim()) {
      const newTask: TemplateTask = {
        id: `new-${Date.now()}`,
        title: newTaskTitle.trim(),
        tag: newTaskTag.trim() || undefined
      }
      setEditForm((prev) => ({
        ...prev,
        tasks: [...prev.tasks, newTask]
      }))
      setNewTaskTitle('')
      setNewTaskTag('')
    }
  }

  const handleRemoveTask = (taskId: string): void => {
    setEditForm((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId)
    }))
  }

  const handleTaskChange = (taskId: string, field: 'title' | 'tag', value: string): void => {
    setEditForm((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, [field]: value } : t))
    }))
  }

  return (
    <div className="h-full overflow-auto bg-white">
      <div className="max-w-[1200px] mx-auto px-8 py-5 space-y-5">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Templates', href: '#' },
            { label: isNew ? 'New Template' : editForm.name || 'Template' }
          ]}
        />

        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <FiArrowLeft size={16} />
            <span>뒤로가기</span>
          </button>
          {existingTemplate && (
            <span className="text-xs text-[var(--text-placeholder)]">
              생성일 {existingTemplate.createdAt}
            </span>
          )}
        </div>

        {/* Main Card */}
        <Card padding="none">
          {/* Header */}
          <div className="p-5 border-b border-[var(--border-light)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-[var(--text-muted)]">템플릿 정보</span>
              <div className="flex items-center gap-1">
                {isEditing ? (
                  <>
                    <Button
                      variant="ghost"
                      size="xs"
                      icon={<FiCheck size={13} />}
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      icon={<FiX size={13} />}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="xs"
                      icon={<FiEdit2 size={13} />}
                      onClick={handleEdit}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      icon={<FiTrash2 size={13} />}
                      className="text-[var(--error)] hover:text-[var(--error)]"
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Name */}
            {isEditing ? (
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full text-lg font-semibold text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="템플릿 이름"
              />
            ) : (
              <h1 className="text-lg font-semibold text-[var(--text-primary)]">
                {editForm.name || '제목 없음'}
              </h1>
            )}

            {/* Description */}
            <div className="mt-3">
              {isEditing ? (
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={2}
                  className="w-full text-sm text-[var(--text-secondary)] bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  placeholder="템플릿 설명"
                />
              ) : (
                <p className="text-sm text-[var(--text-muted)]">
                  {editForm.description || '설명 없음'}
                </p>
              )}
            </div>
          </div>

          {/* Task List */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-medium text-[var(--text-muted)]">
                태스크 목록 ({editForm.tasks.length})
              </h3>
            </div>

            <div className="space-y-2">
              {editForm.tasks.map((task, index) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 p-2 rounded-md bg-[var(--bg-secondary)] group"
                >
                  <span className="w-5 h-5 rounded bg-[var(--bg-default)] text-[var(--text-muted)] flex items-center justify-center text-[10px] font-medium shrink-0">
                    {index + 1}
                  </span>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={task.title}
                        onChange={(e) => handleTaskChange(task.id, 'title', e.target.value)}
                        className="flex-1 text-sm bg-transparent border-none focus:outline-none text-[var(--text-primary)]"
                        placeholder="태스크 제목"
                      />
                      <input
                        type="text"
                        value={task.tag || ''}
                        onChange={(e) => handleTaskChange(task.id, 'tag', e.target.value)}
                        className="w-20 text-xs bg-[var(--bg-default)] border border-[var(--border-default)] rounded px-2 py-1 focus:outline-none text-[var(--text-secondary)]"
                        placeholder="태그"
                      />
                      <button
                        onClick={() => handleRemoveTask(task.id)}
                        className="w-6 h-6 flex items-center justify-center rounded text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors"
                      >
                        <FiX size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm text-[var(--text-primary)]">
                        {task.title}
                      </span>
                      {task.tag && <Badge label={task.tag} size="sm" />}
                    </>
                  )}
                </div>
              ))}

              {/* Add Task Input */}
              {isEditing && (
                <div className="flex items-center gap-2 p-2 rounded-md border border-dashed border-[var(--border-default)]">
                  <span className="w-5 h-5 rounded bg-[var(--bg-secondary)] text-[var(--text-muted)] flex items-center justify-center text-[10px]">
                    <FiPlus size={12} />
                  </span>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                    className="flex-1 text-sm bg-transparent border-none focus:outline-none text-[var(--text-primary)]"
                    placeholder="새 태스크 추가..."
                  />
                  <input
                    type="text"
                    value={newTaskTag}
                    onChange={(e) => setNewTaskTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                    className="w-20 text-xs bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded px-2 py-1 focus:outline-none text-[var(--text-secondary)]"
                    placeholder="태그"
                  />
                  <Button size="xs" onClick={handleAddTask}>
                    추가
                  </Button>
                </div>
              )}

              {editForm.tasks.length === 0 && !isEditing && (
                <div className="text-center py-8 text-sm text-[var(--text-muted)]">
                  등록된 태스크가 없습니다.
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
