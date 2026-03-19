import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  /** 버튼 변형 */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  /** 버튼 크기 */
  size?: 'xs' | 'sm' | 'md'
  /** 아이콘 (왼쪽) */
  icon?: ReactNode
  /** 비활성화 */
  disabled?: boolean
  /** 전체 너비 */
  fullWidth?: boolean
  /** 클릭 핸들러 */
  onClick?: () => void
  /** 버튼 타입 */
  type?: 'button' | 'submit' | 'reset'
  /** 추가 클래스 */
  className?: string
}

const sizeStyles = {
  xs: 'h-6 px-2 text-[11px] gap-1',
  sm: 'h-7 px-2.5 text-xs gap-1.5',
  md: 'h-8 px-3 text-sm gap-2'
}

const variantStyles = {
  primary: `
    bg-[var(--primary)] text-white
    hover:bg-[var(--primary-hover)]
  `,
  secondary: `
    bg-[var(--bg-default)] text-[var(--text-secondary)] border border-[var(--border-default)]
    hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]
  `,
  ghost: `
    bg-transparent text-[var(--text-secondary)]
    hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]
  `,
  danger: `
    bg-[var(--error)] text-white
    hover:bg-[var(--error)]/90
  `
}

export function Button({
  children,
  variant = 'primary',
  size = 'sm',
  icon,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = ''
}: ButtonProps): React.JSX.Element {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-medium rounded-[var(--radius-md)]
        transition-colors duration-150
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  )
}

export type { ButtonProps }
