interface FilterTabsProps<T extends string> {
  options: { value: T; label: string; count?: number }[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function FilterTabs<T extends string>({
  options,
  value,
  onChange,
  className = ''
}: FilterTabsProps<T>): React.JSX.Element {
  return (
    <div className={`flex items-center border-b border-[var(--border-default)] ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
            value === option.value
              ? 'text-[var(--primary)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            {option.label}
            {option.count !== undefined && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  value === option.value
                    ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                }`}
              >
                {option.count}
              </span>
            )}
          </span>
          {value === option.value && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)] rounded-full" />
          )}
        </button>
      ))}
    </div>
  )
}

export type { FilterTabsProps }
