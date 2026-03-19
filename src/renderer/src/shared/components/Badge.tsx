interface BadgeProps {
  /** 뱃지에 표시할 텍스트 */
  label: string
  /** 뱃지 색상 변형 */
  variant?: keyof typeof badgeColors | 'auto'
  /** 뱃지 크기 */
  size?: 'sm' | 'md'
  /** 대문자 변환 여부 */
  uppercase?: boolean
  className?: string
}

const badgeColors = {
  indigo: { bg: 'rgba(99, 102, 241, 0.12)', text: 'rgb(99, 102, 241)' },
  pink: { bg: 'rgba(236, 72, 153, 0.12)', text: 'rgb(236, 72, 153)' },
  sky: { bg: 'rgba(14, 165, 233, 0.12)', text: 'rgb(14, 165, 233)' },
  green: { bg: 'rgba(34, 197, 94, 0.12)', text: 'rgb(34, 197, 94)' },
  orange: { bg: 'rgba(249, 115, 22, 0.12)', text: 'rgb(249, 115, 22)' },
  purple: { bg: 'rgba(168, 85, 247, 0.12)', text: 'rgb(168, 85, 247)' },
  teal: { bg: 'rgba(20, 184, 166, 0.12)', text: 'rgb(20, 184, 166)' },
  amber: { bg: 'rgba(245, 158, 11, 0.12)', text: 'rgb(245, 158, 11)' },
  red: { bg: 'rgba(239, 68, 68, 0.12)', text: 'rgb(239, 68, 68)' },
  gray: { bg: 'rgba(107, 114, 128, 0.12)', text: 'rgb(107, 114, 128)' }
}

/** 태그 이름과 색상 매핑 (자주 사용하는 태그) */
const tagColorMap: Record<string, keyof typeof badgeColors> = {
  AMS: 'indigo',
  WAS: 'pink',
  Frontend: 'sky',
  Backend: 'green',
  Design: 'orange',
  DevOps: 'purple',
  QA: 'teal',
  DB: 'amber'
}

const getColorByLabel = (label: string): { bg: string; text: string } => {
  const mappedColor = tagColorMap[label]
  if (mappedColor) return badgeColors[mappedColor]

  // 등록되지 않은 태그는 해시 기반 색상 생성
  const colors = Object.values(badgeColors)
  const hash = label.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

const sizeStyles = {
  sm: 'px-1.5 py-0.5 text-[9px]',
  md: 'px-2 py-0.5 text-[10px]'
}

export function Badge({
  label,
  variant = 'auto',
  size = 'md',
  uppercase = true,
  className = ''
}: BadgeProps): React.JSX.Element {
  const colorStyle =
    variant === 'auto' ? getColorByLabel(label) : badgeColors[variant]

  return (
    <span
      className={`inline-flex w-fit rounded-[var(--radius-sm)] font-semibold tracking-wide ${sizeStyles[size]} ${uppercase ? 'uppercase' : ''} ${className}`}
      style={{
        backgroundColor: colorStyle.bg,
        color: colorStyle.text
      }}
    >
      {label}
    </span>
  )
}

export { badgeColors, tagColorMap }
export type { BadgeProps }
