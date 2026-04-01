export default function BottomNav({ view, setView }) {
  const tabs = [
    {
      id: 'today',
      label: 'I dag',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
    {
      id: 'calendar',
      label: 'Kalender',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    },
    {
      id: 'stats',
      label: 'Statistikk',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      ),
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-warm-800/90 backdrop-blur-xl border-t border-warm-200 dark:border-warm-700 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}>
      <div className="max-w-xl mx-auto flex justify-around py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`flex flex-col items-center gap-1 px-5 py-2 transition-colors ${
              view === tab.id
                ? 'text-terra-500'
                : 'text-warm-400 dark:text-warm-600'
            }`}
          >
            {tab.icon}
            <span className={`text-[11px] ${view === tab.id ? 'font-bold' : 'font-medium'}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  )
}
