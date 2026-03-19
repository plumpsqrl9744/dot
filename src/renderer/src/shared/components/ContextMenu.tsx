import { useEffect, useRef, useState } from 'react'
import { FiChevronRight } from 'react-icons/fi'

interface ContextMenuSubItem {
  label: string
  icon?: React.ReactNode
  onClick: () => void
}

interface ContextMenuItem {
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  danger?: boolean
  disabled?: boolean
  subItems?: ContextMenuSubItem[]
}

interface ContextMenuProps {
  items: ContextMenuItem[]
  position: { x: number; y: number }
  onClose: () => void
}

export function ContextMenu({ items, position, onClose }: ContextMenuProps): React.JSX.Element {
  const menuRef = useRef<HTMLDivElement>(null)
  const [hoveredSubMenu, setHoveredSubMenu] = useState<number | null>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  // 화면 밖으로 나가지 않도록 위치 조정
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let adjustedX = position.x
      let adjustedY = position.y

      if (position.x + rect.width > viewportWidth) {
        adjustedX = viewportWidth - rect.width - 8
      }
      if (position.y + rect.height > viewportHeight) {
        adjustedY = viewportHeight - rect.height - 8
      }

      menuRef.current.style.left = `${adjustedX}px`
      menuRef.current.style.top = `${adjustedY}px`
    }
  }, [position])

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[140px] py-1 bg-[var(--bg-default)] rounded-[var(--radius-md)] border border-[var(--border-default)] shadow-lg"
      style={{ left: position.x, top: position.y }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="relative"
          onMouseEnter={() => item.subItems && setHoveredSubMenu(index)}
          onMouseLeave={() => setHoveredSubMenu(null)}
        >
          <button
            onClick={() => {
              if (item.onClick) {
                item.onClick()
                onClose()
              }
            }}
            disabled={item.disabled}
            className={`w-full px-3 py-1.5 text-left text-xs font-medium flex items-center justify-between gap-2 transition-colors ${
              item.disabled
                ? 'text-[var(--text-placeholder)] cursor-not-allowed'
                : item.danger
                  ? 'text-[var(--error)] hover:bg-[var(--error)]/10'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span className="flex items-center gap-2">
              {item.icon && <span className="w-4 h-4 flex items-center justify-center">{item.icon}</span>}
              {item.label}
            </span>
            {item.subItems && <FiChevronRight size={12} />}
          </button>

          {/* Sub Menu */}
          {item.subItems && hoveredSubMenu === index && (
            <div className="absolute left-full top-0 ml-1 min-w-[120px] py-1 bg-[var(--bg-default)] rounded-[var(--radius-md)] border border-[var(--border-default)] shadow-lg">
              {item.subItems.map((subItem, subIndex) => (
                <button
                  key={subIndex}
                  onClick={() => {
                    subItem.onClick()
                    onClose()
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs font-medium flex items-center gap-2 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {subItem.icon && <span className="w-4 h-4 flex items-center justify-center">{subItem.icon}</span>}
                  {subItem.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export type { ContextMenuItem, ContextMenuProps, ContextMenuSubItem }
