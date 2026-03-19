interface DotProps {
  /** 점 색상 */
  color?: 'primary' | 'success' | 'warning' | 'error' | 'muted' | string
  /** 점 크기 */
  size?: 'xs' | 'sm' | 'md' | 'lg'
  /** 애니메이션 (pulse) */
  pulse?: boolean
  /** 추가 클래스 */
  className?: string
}

const colorMap: Record<string, string> = {
  primary: 'var(--primary)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--error)',
  muted: 'var(--text-muted)'
}

const sizeMap = {
  xs: 'w-1 h-1',
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5'
}

export function Dot({
  color = 'primary',
  size = 'sm',
  pulse = false,
  className = ''
}: DotProps): React.JSX.Element {
  const bgColor = colorMap[color] || color

  return (
    <span
      className={`inline-block rounded-full shrink-0 ${sizeMap[size]} ${pulse ? 'animate-pulse' : ''} ${className}`}
      style={{ backgroundColor: bgColor }}
    />
  )
}

export { colorMap as dotColors }
export type { DotProps }
