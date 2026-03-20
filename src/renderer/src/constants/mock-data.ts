// Mock 데이터 통합

import type {
  Task,
  Template,
  TeamMember,
  PendingInvite,
  ReceivedInvite,
  Follower,
  PeerConnectionStatus,
  ReceivedTask,
  TaskTransfer,
  MailAnalysis
} from '../types'

// Tasks (1:N 구조 - 업무 주제 > SubTask > Checklist)
export const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    title: '코드 리팩토링',
    description: '프론트엔드 주요 페이지 리팩토링 작업',
    subTasks: [
      {
        id: 'st-1-1', title: 'Dashboard 페이지 리팩토링', completed: false, dueDate: 'D-3', dueStatus: 'warning' as const,
        checklist: [
          { id: 'cl-1-1-1', text: '하드코딩 데이터 제거', completed: true },
          { id: 'cl-1-1-2', text: 'store 연동', completed: false },
          { id: 'cl-1-1-3', text: '타입 정리', completed: false }
        ]
      },
      {
        id: 'st-1-2', title: 'Calendar 페이지 리팩토링', completed: false, dueDate: 'D-5', dueStatus: 'safe' as const,
        checklist: [
          { id: 'cl-1-2-1', text: '이벤트 데이터 통합', completed: false },
          { id: 'cl-1-2-2', text: '태스크 기반 이벤트 생성', completed: false }
        ]
      },
      {
        id: 'st-1-3', title: 'MyTasks 페이지 리팩토링', completed: true,
        checklist: [
          { id: 'cl-1-3-1', text: 'useTasks 훅 전환', completed: true },
          { id: 'cl-1-3-2', text: '필터 UI 개선', completed: true }
        ]
      }
    ],
    tag: 'FRONTEND',
    dueDate: 'D-5',
    dueStatus: 'warning',
    importance: 'high',
    assignedBy: '이영희',
    createdAt: '2026-03-15'
  },
  {
    id: 'task-2',
    title: '3월 릴리즈 준비',
    description: '3월 말 프로덕션 배포를 위한 준비 작업',
    subTasks: [
      {
        id: 'st-2-1', title: 'QA 테스트 수행', completed: true,
        checklist: [
          { id: 'cl-2-1-1', text: '기능 테스트 완료', completed: true },
          { id: 'cl-2-1-2', text: '회귀 테스트 완료', completed: true },
          { id: 'cl-2-1-3', text: '버그 리포트 정리', completed: true }
        ]
      },
      {
        id: 'st-2-2', title: '배포 문서 작성', completed: false, dueDate: 'D-2', dueStatus: 'warning' as const,
        checklist: [
          { id: 'cl-2-2-1', text: 'CHANGELOG 업데이트', completed: true },
          { id: 'cl-2-2-2', text: '배포 절차서 작성', completed: false }
        ]
      },
      {
        id: 'st-2-3', title: '스테이징 배포 및 검증', completed: false, dueDate: 'D-1', dueStatus: 'urgent' as const,
        checklist: [
          { id: 'cl-2-3-1', text: '스테이징 환경 배포', completed: false },
          { id: 'cl-2-3-2', text: '스모크 테스트', completed: false },
          { id: 'cl-2-3-3', text: '성능 모니터링 확인', completed: false }
        ]
      }
    ],
    tag: 'DEVOPS',
    dueDate: 'D-3',
    dueStatus: 'warning',
    importance: 'high',
    isMyDay: true,
    createdAt: '2026-03-12'
  },
  {
    id: 'task-3',
    title: '마케팅 전략 회의 후속',
    description: '3월 마케팅 전략 회의 내용 정리 및 실행',
    subTasks: [
      {
        id: 'st-3-1', title: '회의록 정리 및 공유', completed: true,
        checklist: [
          { id: 'cl-3-1-1', text: '회의 내용 정리', completed: true },
          { id: 'cl-3-1-2', text: '팀 채널에 공유', completed: true }
        ]
      },
      {
        id: 'st-3-2', title: '신규 캠페인 기획안 작성', completed: false, dueDate: 'D-1', dueStatus: 'urgent' as const,
        checklist: [
          { id: 'cl-3-2-1', text: '타겟 고객 분석', completed: true },
          { id: 'cl-3-2-2', text: '예산 산정', completed: false },
          { id: 'cl-3-2-3', text: '일정 수립', completed: false }
        ]
      },
      {
        id: 'st-3-3', title: '경쟁사 벤치마킹 보고서', completed: false,
        checklist: [
          { id: 'cl-3-3-1', text: '경쟁사 3사 분석', completed: false },
          { id: 'cl-3-3-2', text: '비교 테이블 작성', completed: false }
        ]
      }
    ],
    tag: 'MARKETING',
    dueDate: 'D-1',
    dueStatus: 'urgent',
    importance: 'high',
    isMyDay: true,
    assignedBy: '김철수',
    createdAt: '2026-03-18'
  },
  {
    id: 'task-4',
    title: 'API 문서화',
    description: '백엔드 API 엔드포인트 문서 정비',
    subTasks: [
      {
        id: 'st-4-1', title: '인증 API 문서화', completed: true,
        checklist: [
          { id: 'cl-4-1-1', text: 'Swagger 스펙 작성', completed: true },
          { id: 'cl-4-1-2', text: '예제 코드 추가', completed: true }
        ]
      },
      {
        id: 'st-4-2', title: '태스크 API 문서화', completed: false,
        checklist: [
          { id: 'cl-4-2-1', text: 'CRUD 엔드포인트 정리', completed: true },
          { id: 'cl-4-2-2', text: '에러 코드 정의', completed: false }
        ]
      }
    ],
    tag: 'BACKEND',
    dueDate: 'D-7',
    dueStatus: 'safe',
    importance: 'medium',
    createdAt: '2026-03-10'
  },
  {
    id: 'task-5',
    title: '팀 온보딩 자료 준비',
    description: '신규 팀원 온보딩을 위한 자료 정비',
    subTasks: [
      {
        id: 'st-5-1', title: '개발 환경 설정 가이드', completed: true,
        checklist: [
          { id: 'cl-5-1-1', text: 'IDE 설정 가이드', completed: true },
          { id: 'cl-5-1-2', text: 'Git 워크플로우 정리', completed: true },
          { id: 'cl-5-1-3', text: 'CI/CD 파이프라인 설명', completed: true }
        ]
      },
      {
        id: 'st-5-2', title: '프로젝트 아키텍처 문서', completed: true,
        checklist: [
          { id: 'cl-5-2-1', text: '시스템 구성도 작성', completed: true },
          { id: 'cl-5-2-2', text: '기술 스택 설명', completed: true }
        ]
      },
      {
        id: 'st-5-3', title: '코딩 컨벤션 문서', completed: true,
        checklist: [
          { id: 'cl-5-3-1', text: '네이밍 규칙 정리', completed: true },
          { id: 'cl-5-3-2', text: 'PR 리뷰 가이드', completed: true }
        ]
      }
    ],
    tag: 'QA',
    importance: 'low',
    createdAt: '2026-03-05',
    completedAt: '2026-03-19T14:00:00'
  },
  {
    id: 'task-6',
    title: 'AMS 서버 장애 대응',
    description: '프로덕션 서버 500 에러 원인 파악 및 조치',
    subTasks: [
      {
        id: 'st-6-1', title: '에러 로그 분석', completed: true,
        checklist: [
          { id: 'cl-6-1-1', text: '최근 24시간 로그 수집', completed: true },
          { id: 'cl-6-1-2', text: '에러 패턴 분석', completed: true }
        ]
      },
      {
        id: 'st-6-2', title: '핫픽스 적용', completed: false, dueDate: 'D-0', dueStatus: 'urgent' as const,
        checklist: [
          { id: 'cl-6-2-1', text: '수정 코드 작성', completed: true },
          { id: 'cl-6-2-2', text: '코드 리뷰', completed: false },
          { id: 'cl-6-2-3', text: '프로덕션 배포', completed: false }
        ]
      }
    ],
    tag: 'AMS',
    dueDate: 'D-0',
    dueStatus: 'urgent',
    importance: 'high',
    isMyDay: true,
    assignedBy: '박지민',
    createdAt: '2026-03-20'
  }
]

// Templates
export const MOCK_TEMPLATES: Template[] = [
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

// Team Members (with P2P status)
export const MOCK_MEMBERS: TeamMember[] = [
  {
    id: 'm0',
    name: 'User',
    email: 'user@example.com',
    role: 'owner',
    status: 'online',
    tasksCount: 7,
    memberKey: 'DOT-USER-7K3M'
  },
  {
    id: 'm1',
    name: '김철수',
    email: 'kim@dot.com',
    role: 'admin',
    status: 'online',
    tasksCount: 8,
    memberKey: 'DOT-KIM-7X2K'
  },
  {
    id: 'm2',
    name: '이영희',
    email: 'lee@dot.com',
    role: 'admin',
    status: 'online',
    tasksCount: 5,
    memberKey: 'DOT-LEE-9M3P'
  },
  {
    id: 'm3',
    name: '박지민',
    email: 'park@dot.com',
    role: 'member',
    status: 'away',
    tasksCount: 3,
    memberKey: 'DOT-PARK-4H8N'
  },
  {
    id: 'm4',
    name: '정민수',
    email: 'jung@dot.com',
    role: 'member',
    status: 'online',
    tasksCount: 12,
    memberKey: 'DOT-JUNG-2F5Q'
  },
  {
    id: 'm5',
    name: '최수진',
    email: 'choi@dot.com',
    role: 'member',
    status: 'offline',
    tasksCount: 4,
    memberKey: 'DOT-CHOI-6R1W'
  },
  {
    id: 'm6',
    name: '한소희',
    email: 'han@dot.com',
    role: 'member',
    status: 'online',
    tasksCount: 6,
    memberKey: 'DOT-HAN-8T4Y'
  }
]

// P2P Peer Statuses (memberKey -> status)
export const MOCK_PEER_STATUSES: Record<string, PeerConnectionStatus> = {
  'DOT-KIM-7X2K': 'connected',
  'DOT-LEE-9M3P': 'connected',
  'DOT-PARK-4H8N': 'disconnected',
  'DOT-JUNG-2F5Q': 'connected',
  'DOT-CHOI-6R1W': 'failed',
  'DOT-HAN-8T4Y': 'connecting'
}

// Received Tasks (from peers via P2P)
export const MOCK_RECEIVED_TASKS: ReceivedTask[] = [
  {
    id: 'rt1',
    taskTitle: 'API 문서 검토 요청',
    taskTag: 'BACKEND',
    fromName: '김철수',
    fromMemberKey: 'DOT-KIM-7X2K',
    receivedAt: '10분 전',
    status: 'pending'
  },
  {
    id: 'rt2',
    taskTitle: '디자인 시안 피드백',
    taskTag: 'FRONTEND',
    fromName: '이영희',
    fromMemberKey: 'DOT-LEE-9M3P',
    receivedAt: '1시간 전',
    status: 'pending'
  },
  {
    id: 'rt3',
    taskTitle: '주간 보고서 작성',
    taskTag: 'BIZ',
    fromName: '정민수',
    fromMemberKey: 'DOT-JUNG-2F5Q',
    receivedAt: '어제',
    status: 'accepted'
  }
]

// Sent Task Transfers
export const MOCK_SENT_TRANSFERS: TaskTransfer[] = [
  {
    id: 'st1',
    taskId: '1',
    taskTitle: '마케팅 미팅 회의록 정리',
    taskTag: 'MARKETING',
    fromMemberKey: 'DOT-USER-7K3M',
    toMemberKey: 'DOT-KIM-7X2K',
    sentAt: '30분 전',
    status: 'accepted'
  },
  {
    id: 'st2',
    taskId: '3',
    taskTitle: '서버 아키텍처 다이어그램 작성',
    taskTag: 'WAS',
    fromMemberKey: 'DOT-USER-7K3M',
    toMemberKey: 'DOT-PARK-4H8N',
    sentAt: '2시간 전',
    status: 'sent'
  }
]

export const MOCK_PENDING_INVITES: PendingInvite[] = [
  {
    id: 'p1',
    memberKey: 'DOT-SONG-3K7L',
    name: '송민호',
    email: 'song@dot.com',
    sentAt: '2시간 전',
    status: 'pending'
  },
  { id: 'p2', memberKey: 'DOT-KANG-5N9M', sentAt: '1일 전', status: 'pending' }
]

export const MOCK_RECEIVED_INVITES: ReceivedInvite[] = [
  {
    id: 'r1',
    fromName: '박서준',
    fromEmail: 'psj@company.com',
    teamName: 'Design Team',
    receivedAt: '30분 전'
  }
]

export const MOCK_FOLLOWERS: Follower[] = [
  { id: 'f1', name: '김철수', email: 'kim@dot.com' },
  { id: 'f2', name: '이영희', email: 'lee@dot.com' },
  { id: 'f3', name: '박지민', email: 'park@dot.com' },
  { id: 'f4', name: '정민수', email: 'jung@dot.com' },
  { id: 'f5', name: '최수진', email: 'choi@dot.com' }
]

// Dashboard Data
export const DASHBOARD_WEEKLY_DATA = [
  { name: 'Mon', completed: 4, created: 6 },
  { name: 'Tue', completed: 7, created: 5 },
  { name: 'Wed', completed: 5, created: 8 },
  { name: 'Thu', completed: 8, created: 4 },
  { name: 'Fri', completed: 6, created: 7 },
  { name: 'Sat', completed: 3, created: 2 },
  { name: 'Sun', completed: 2, created: 1 }
]

export const DASHBOARD_PROJECT_DATA = [
  { name: 'AMS', tasks: 12, color: '#2563EB' },
  { name: 'WAS', tasks: 8, color: '#5494F3' },
  { name: 'Frontend', tasks: 15, color: '#22C55E' },
  { name: 'BIZ', tasks: 6, color: '#F57C00' },
  { name: 'Personal', tasks: 4, color: '#9CA3AF' }
]

export const DASHBOARD_STATUS_DATA = [
  { name: 'Completed', value: 24, color: '#22C55E' },
  { name: 'In Progress', value: 12, color: '#2563EB' },
  { name: 'Urgent', value: 5, color: '#D32F2F' },
  { name: 'Due Soon', value: 8, color: '#F57C00' }
]

export const DASHBOARD_RECENT_ACTIVITY = [
  { id: 1, action: 'completed' as const, task: '마케팅 미팅 회의록', time: '2시간 전' },
  { id: 2, action: 'created' as const, task: '서버 부하 테스트', time: '3시간 전' },
  { id: 3, action: 'assigned' as const, task: 'UI 디자인 검토', by: '김철수', time: '5시간 전' },
  { id: 4, action: 'completed' as const, task: '주간 보고서 작성', time: '어제' },
  { id: 5, action: 'created' as const, task: 'API 문서화', time: '어제' }
]

// Calendar Events
export const CALENDAR_EVENTS = [
  { id: '1', title: 'AMS 정기 미팅', start: '2026-03-19', backgroundColor: 'rgb(99, 102, 241)' },
  { id: '2', title: 'WAS 배포', start: '2026-03-20', backgroundColor: 'rgb(236, 72, 153)' },
  { id: '3', title: 'Frontend 코드리뷰', start: '2026-03-21', backgroundColor: 'rgb(14, 165, 233)' },
  {
    id: '4',
    title: 'DB 마이그레이션',
    start: '2026-03-24',
    end: '2026-03-26',
    backgroundColor: 'rgb(245, 158, 11)'
  },
  { id: '5', title: 'QA 테스트', start: '2026-03-25', backgroundColor: 'rgb(20, 184, 166)' },
  { id: '6', title: '스프린트 회고', start: '2026-03-28', backgroundColor: 'rgb(168, 85, 247)' }
]

// Mail Analyses (LLM results)
export const MOCK_MAIL_ANALYSES: MailAnalysis[] = [
  {
    id: 'ma1',
    subject: '[긴급] AMS 서버 장애 대응 요청',
    sender: '박서준',
    senderEmail: 'psj@company.com',
    receivedAt: '10분 전',
    bodyPreview: 'AMS 프로덕션 서버에서 500 에러가 간헐적으로 발생하고 있습니다. 오늘 오후까지 원인 파악 및 조치 부탁드립니다.',
    needed: true,
    suggestedTitle: 'AMS 서버 500 에러 원인 파악 및 조치',
    importance: 'high',
    category: 'AMS',
    reviewStatus: 'pending',
    analyzedAt: '9분 전'
  },
  {
    id: 'ma2',
    subject: 'Re: 3월 스프린트 회고 일정',
    sender: '김철수',
    senderEmail: 'kim@dot.com',
    receivedAt: '30분 전',
    bodyPreview: '스프린트 회고 일정을 금요일 오후 3시로 확정합니다. 각자 개인 회고를 미리 작성해주세요.',
    needed: true,
    suggestedTitle: '스프린트 회고 개인 회고 작성',
    importance: 'medium',
    category: '기획',
    reviewStatus: 'pending',
    analyzedAt: '29분 전'
  },
  {
    id: 'ma3',
    subject: 'Frontend 코드리뷰 요청 - 대시보드 차트 컴포넌트',
    sender: '이영희',
    senderEmail: 'lee@dot.com',
    receivedAt: '1시간 전',
    bodyPreview: '대시보드 차트 컴포넌트 리팩토링 PR 올렸습니다. 리뷰 부탁드립니다. PR #142',
    needed: true,
    suggestedTitle: '대시보드 차트 컴포넌트 코드리뷰 (PR #142)',
    importance: 'medium',
    category: '프론트엔드',
    reviewStatus: 'pending',
    analyzedAt: '59분 전'
  },
  {
    id: 'ma4',
    subject: '점심 메뉴 투표',
    sender: '한소희',
    senderEmail: 'han@dot.com',
    receivedAt: '2시간 전',
    bodyPreview: '오늘 점심 메뉴 투표합니다. 1번 중식, 2번 일식, 3번 한식 중 골라주세요.',
    needed: false,
    suggestedTitle: '',
    importance: 'low',
    category: '',
    reviewStatus: 'dismissed',
    analyzedAt: '2시간 전'
  },
  {
    id: 'ma5',
    subject: 'QA 테스트 결과 보고서',
    sender: '정민수',
    senderEmail: 'jung@dot.com',
    receivedAt: '3시간 전',
    bodyPreview: '이번 릴리즈 QA 테스트 결과입니다. 총 3건의 버그가 발견되었으며 수정 요청드립니다.',
    needed: true,
    suggestedTitle: 'QA 테스트 발견 버그 3건 수정',
    importance: 'high',
    category: 'QA',
    reviewStatus: 'approved',
    analyzedAt: '3시간 전'
  }
]

// User Constants
export const USER_MEMBER_KEY = 'DOT-USER-7K3M'

export const DEFAULT_SIDEBAR_MENUS = [
  { id: 'dashboard', label: 'Home', enabled: true },
  { id: 'tasks', label: 'My Tasks', enabled: true },
  { id: 'calendar', label: 'Calendar', enabled: true },
  { id: 'templates', label: 'Templates', enabled: true },
  { id: 'team', label: 'Team', enabled: true },
  { id: 'mail', label: 'Mail Analysis', enabled: true },
  { id: 'settings', label: 'Settings', enabled: true }
]

export const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  tasks: 'My Tasks',
  calendar: 'Calendar',
  projects: 'Projects',
  team: 'Team',
  templates: 'Templates',
  mail: 'Mail Analysis',
  settings: 'Settings'
}
