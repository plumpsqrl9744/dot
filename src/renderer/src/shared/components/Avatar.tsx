import { FiUser } from 'react-icons/fi'

interface AvatarProps {
  /** 이름 (첫 글자 표시용) */
  name?: string
  /** 이미지 URL */
  src?: string
  /** 크기 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** 온라인 상태 표시 */
  status?: 'online' | 'offline' | 'busy' | 'away'
  /** 그라데이션 사용 여부 */
  gradient?: boolean
  /** 추가 클래스 */
  className?: string
}

const sizeMap = {
  xs: { container: 'w-5 h-5', text: 'text-[9px]', icon: 10, status: 'w-1.5 h-1.5' },
  sm: { container: 'w-6 h-6', text: 'text-[10px]', icon: 12, status: 'w-2 h-2' },
  md: { container: 'w-8 h-8', text: 'text-sm', icon: 14, status: 'w-2.5 h-2.5' },
  lg: { container: 'w-10 h-10', text: 'text-base', icon: 18, status: 'w-3 h-3' },
  xl: { container: 'w-16 h-16', text: 'text-2xl', icon: 28, status: 'w-4 h-4' }
}

const statusColors = {
  online: 'bg-success',
  offline: 'bg-[var(--text-muted)]',
  busy: 'bg-error',
  away: 'bg-warning'
}

export function Avatar({
  name,
  src,
  size = 'md',
  status,
  gradient = true,
  className = ''
}: AvatarProps): React.JSX.Element {
  const sizeConfig = sizeMap[size]

  return (
    <div className={`relative shrink-0 ${className}`}>
      <div
        className={`${sizeConfig.container} rounded-full flex items-center justify-center font-semibold ${
          gradient
            ? 'bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white'
            : 'bg-[var(--bg-tertiary)] text-[var(--text-placeholder)]'
        }`}
      >
        {src ? (
          <img src={src} alt={name || 'avatar'} className="w-full h-full rounded-full object-cover" />
        ) : name ? (
          <span className={sizeConfig.text}>{name[0].toUpperCase()}</span>
        ) : (
          <FiUser size={sizeConfig.icon} />
        )}
      </div>
      {status && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 ${sizeConfig.status} rounded-full border-2 border-[var(--bg-default)] ${statusColors[status]}`}
        />
      )}
    </div>
  )
}

export type { AvatarProps }
