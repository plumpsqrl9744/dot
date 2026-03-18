import { FiSearch, FiSettings, FiBell, FiMenu } from 'react-icons/fi'

interface HeaderProps {
  title: string
  onToggleSidebar?: () => void
}

export function Header({ onToggleSidebar }: HeaderProps): React.JSX.Element {
  return (
    <header className="titlebar h-14 bg-white border-b border-border/50 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="w-8 h-8 rounded-lg hover:bg-black/[0.04] flex items-center justify-center text-text/50 hover:text-text/80 transition-colors lg:hidden"
          >
            <FiMenu className="w-5 h-5" strokeWidth={1.5} />
          </button>
        )}
        
        {/* Search Bar */}
        <div className="relative max-w-md w-full group">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-placeholder group-focus-within:text-primary transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="업무 검색..." 
            className="w-full h-9 pl-10 pr-4 bg-black/[0.03] border-transparent focus:bg-white focus:border-primary/30 rounded-lg text-sm transition-all focus:ring-2 focus:ring-primary/10 outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-lg hover:bg-black/[0.04] flex items-center justify-center text-text/50 hover:text-text/80 transition-colors">
          <FiBell className="w-5 h-5" strokeWidth={1.5} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-white" />
        </button>

        {/* Global Settings */}
        <button className="flex items-center gap-2 px-3 h-9 rounded-lg hover:bg-black/[0.04] text-text/50 hover:text-text/80 transition-colors">
          <span className="text-sm font-medium">설정</span>
          <FiSettings size={18} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  )
}
