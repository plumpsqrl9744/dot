interface CardProps {
  children: React.ReactNode
  /** 패딩 크기 */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** hover 시 그림자 효과 */
  hoverable?: boolean
  /** 추가 클래스 */
  className?: string
  /** 클릭 핸들러 */
  onClick?: () => void
}

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5'
}

export function Card({
  children,
  padding = 'md',
  hoverable = false,
  className = '',
  onClick
}: CardProps): React.JSX.Element {
  return (
    <div
      className={`bg-[var(--bg-default)] rounded-[var(--radius-lg)] border border-[var(--border-default)] ${paddingMap[padding]} ${hoverable ? 'hover:shadow-dot transition-shadow cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export type { CardProps }
