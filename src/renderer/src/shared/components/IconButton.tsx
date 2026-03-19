interface IconButtonProps {
  icon: React.ReactNode
  /** 버튼 크기 */
  size?: 'sm' | 'md' | 'lg'
  /** 버튼 변형 */
  variant?: 'ghost' | 'subtle' | 'solid'
  /** 색상 */
  color?: 'default' | 'primary' | 'error'
  /** 비활성화 */
  disabled?: boolean
  /** 클릭 핸들러 */
  onClick?: () => void
  /** 툴팁 텍스트 */
  title?: string
  /** 추가 클래스 */
  className?: string
}

const sizeMap = {
  sm: 'w-7 h-7',
  md: 'w-8 h-8',
  lg: 'w-9 h-9'
}

const variantStyles = {
  ghost: {
    default: 'bg-transparent text-[var(--text-placeholder)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]',
    primary: 'bg-transparent text-[var(--primary)] hover:bg-[var(--primary-bg)]',
    error: 'bg-transparent text-[var(--error)] hover:bg-error/10'
  },
  subtle: {
    default: 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]',
    primary: 'bg-[var(--primary-bg)] text-[var(--primary)] hover:bg-[var(--primary)]/20',
    error: 'bg-error/10 text-[var(--error)] hover:bg-error/20'
  },
  solid: {
    default: 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border-default)]',
    primary: 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]',
    error: 'bg-[var(--error)] text-white hover:bg-error/90'
  }
}

export function IconButton({
  icon,
  size = 'md',
  variant = 'ghost',
  color = 'default',
  disabled = false,
  onClick,
  title,
  className = ''
}: IconButtonProps): React.JSX.Element {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${sizeMap[size]} rounded-[var(--radius-md)] flex items-center justify-center transition-colors ${variantStyles[variant][color]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {icon}
    </button>
  )
}

export type { IconButtonProps }
