import { FiChevronRight, FiHome } from 'react-icons/fi'

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps): React.JSX.Element {
  return (
    <nav className="flex items-center gap-1.5 text-xs">
      <FiHome size={12} className="text-[var(--text-muted)]" />
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <FiChevronRight size={10} className="text-[var(--text-muted)]" />
          {item.icon && <span className="text-[var(--text-muted)]">{item.icon}</span>}
          <span
            className={
              index === items.length - 1
                ? 'font-medium text-[var(--text-primary)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] cursor-pointer'
            }
          >
            {item.label}
          </span>
        </div>
      ))}
    </nav>
  )
}

export type { BreadcrumbProps, BreadcrumbItem }
