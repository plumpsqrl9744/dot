// 폼 옵션 상수

export const TAGS = [
  '기획',
  '디자인',
  '개발',
  '마케팅',
  '프론트엔드',
  '백엔드',
  'AMS',
  'WAS',
  'QA',
  'DEVOPS',
  'BIZ'
] as const

export const FOLLOW_LIST = ['본인', '김철수', '이영희', '박지민', '정민수', '최수진'] as const

export const AMPM = ['오전', '오후'] as const

export const HOURS_12 = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, '0')
)

export const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, '0')
)

export const NOTIFICATION_SOUNDS = [
  { label: 'Default', value: 'default' },
  { label: 'Chime', value: 'chime' },
  { label: 'Bell', value: 'bell' },
  { label: 'Alert', value: 'alert' },
  { label: 'None', value: 'none' }
] as const

export const REPEAT_OPTIONS = [
  { label: '1 time', value: 1 },
  { label: '2 times', value: 2 },
  { label: '3 times', value: 3 },
  { label: '5 times', value: 5 },
  { label: 'Until dismissed', value: 0 }
] as const

export const INTERVAL_OPTIONS = [
  { label: '1 min', value: 1 },
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 }
] as const
