import { JSX, useState } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiSend } from 'react-icons/fi'
import { Button, Card, Breadcrumb, Badge, Avatar, ContextMenu } from '@renderer/shared/components'

interface TemplateTask {
  id: string
  title: string
  tag?: string
}

interface Template {
  id: string
  name: string
  description?: string
  tasks: TemplateTask[]
  createdAt: string
}

interface Follower {
  id: string
  name: string
  email: string
}

interface TemplatesProps {
  onCreateTemplate?: () => void
  onEditTemplate?: (templateId: string) => void
}

const mockFollowers: Follower[] = [
  { id: 'f1', name: '김철수', email: 'kim@dot.com' },
  { id: 'f2', name: '이영희', email: 'lee@dot.com' },
  { id: 'f3', name: '박지민', email: 'park@dot.com' },
  { id: 'f4', name: '정민수', email: 'jung@dot.com' },
  { id: 'f5', name: '최수진', email: 'choi@dot.com' }
]

const mockTemplates: Template[] = [
  {
    id: 't1',
    name: '신규 프로젝트 온보딩',
    description: '새 프로젝트 시작 시 필요한 기본 태스크 목록',
    tasks: [
      { id: '1', title: '프로젝트 요구사항 분석', tag: 'BIZ' },
      { id: '2', title: '기술 스택 선정', tag: 'BACKEND' },
      { id: '3', title: '개발 환경 설정', tag: 'DEVOPS' },
      { id: '4', title: '초기 아키텍처 설계', tag: 'BACKEND' }
    ],
    createdAt: '2026-03-10'
  },
  {
    id: 't2',
    name: '스프린트 회고',
    description: '스프린트 종료 후 회고 프로세스',
    tasks: [
      { id: '1', title: '개인 회고 작성', tag: 'TEAM' },
      { id: '2', title: '팀 회고 미팅', tag: 'TEAM' },
      { id: '3', title: '액션 아이템 정리', tag: 'TEAM' }
    ],
    createdAt: '2026-03-12'
  },
  {
    id: 't3',
    name: '릴리즈 체크리스트',
    description: '배포 전 필수 확인 사항',
    tasks: [
      { id: '1', title: '코드 리뷰 완료', tag: 'FRONTEND' },
      { id: '2', title: 'QA 테스트 완료', tag: 'QA' },
      { id: '3', title: '문서 업데이트', tag: 'DOCS' },
      { id: '4', title: '스테이징 배포', tag: 'DEVOPS' },
      { id: '5', title: '프로덕션 배포', tag: 'DEVOPS' }
    ],
    createdAt: '2026-03-15'
  }
]

export function Templates({ onCreateTemplate, onEditTemplate }: TemplatesProps): JSX.Element {
  const [templates] = useState<Template[]>(mockTemplates)
  const [contextMenu, setContextMenu] = useState<{
    position: { x: number; y: number }
    templateId: string
  } | null>(null)

  const handleContextMenu = (e: React.MouseEvent, templateId: string): void => {
    e.preventDefault()
    setContextMenu({
      position: { x: e.clientX, y: e.clientY },
      templateId
    })
  }

  const closeContextMenu = (): void => {
    setContextMenu(null)
  }

  const handleEdit = (templateId: string): void => {
    onEditTemplate?.(templateId)
  }

  const handleDelete = (templateId: string): void => {
    console.log('Delete template:', templateId)
  }

  const handleSendToFollower = (templateId: string, followerId: string): void => {
    console.log('Send template:', templateId, 'to follower:', followerId)
  }

  const getContextMenuItems = (templateId: string) => [
    {
      label: '수정',
      icon: <FiEdit2 size={14} />,
      onClick: () => handleEdit(templateId)
    },
    {
      label: '삭제',
      icon: <FiTrash2 size={14} />,
      onClick: () => handleDelete(templateId),
      danger: true
    },
    {
      label: '전송',
      icon: <FiSend size={14} />,
      subItems: mockFollowers.map((follower) => ({
        label: follower.name,
        icon: <Avatar name={follower.name} size="xs" gradient />,
        onClick: () => handleSendToFollower(templateId, follower.id)
      }))
    }
  ]

  return (
    <div className="h-full overflow-auto bg-white">
      <div className="max-w-[1200px] mx-auto px-8 py-5 space-y-5">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'Templates' }]} />

        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Templates</h1>
            <p className="text-sm text-[var(--text-placeholder)] mt-1">
              {templates.length} templates
            </p>
          </div>
          <Button icon={<FiPlus size={12} strokeWidth={2.5} />} onClick={onCreateTemplate}>
            New Template
          </Button>
        </header>

        {/* Template Cards */}
        <div className="grid grid-cols-2 gap-4 items-stretch">
          {templates.map((template) => (
            <Card
              key={template.id}
              padding="none"
              hoverable
              className="cursor-pointer h-full"
              onClick={() => handleEdit(template.id)}
            >
              <div
                onContextMenu={(e) => handleContextMenu(e, template.id)}
                className="p-4 h-full flex flex-col"
              >
                {/* Template Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                      {template.name}
                    </h3>
                    {template.description && (
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        {template.description}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-[var(--text-placeholder)] shrink-0">
                    {template.createdAt}
                  </span>
                </div>

                {/* Task List */}
                <div className="space-y-2 flex-1">
                  {template.tasks.slice(0, 4).map((task, index) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span className="w-4 h-4 rounded bg-[var(--bg-secondary)] text-[var(--text-muted)] flex items-center justify-center text-[10px]">
                        {index + 1}
                      </span>
                      <span className="text-[var(--text-secondary)] flex-1 truncate">
                        {task.title}
                      </span>
                      {task.tag && <Badge label={task.tag} size="sm" />}
                    </div>
                  ))}
                  {template.tasks.length > 4 && (
                    <div className="text-xs text-[var(--text-muted)] pl-6">
                      +{template.tasks.length - 4} more tasks
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border-light)]">
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {template.tasks.length} tasks
                  </span>
                  <span className="text-[10px] text-[var(--text-placeholder)]">
                    우클릭하여 메뉴 열기
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State for Add Template */}
        <Card padding="md" className="border-dashed">
          <button
            onClick={onCreateTemplate}
            className="w-full flex flex-col items-center justify-center py-6 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mb-3">
              <FiPlus size={20} />
            </div>
            <span className="text-sm font-medium">Create New Template</span>
            <span className="text-xs mt-1">자주 사용하는 태스크 목록을 템플릿으로 저장하세요</span>
          </button>
        </Card>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          items={getContextMenuItems(contextMenu.templateId)}
          position={contextMenu.position}
          onClose={closeContextMenu}
        />
      )}
    </div>
  )
}
