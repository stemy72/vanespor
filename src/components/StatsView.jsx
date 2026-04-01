import { WEEKDAYS_NO, fmt } from '../lib/constants'

const TODAY = new Date()

export default function StatsView({ habits, logs }) {
  return (
    <>
      <h2 className="font-display text-[22px] font-bold tracking-tight mb-5">
        Statistikk
      </h2>

      {habits.map((habit, i) => {
        const streak = logs.getStreak(habit.id)
        const rate7 = logs.getCompletionRate(habit.id, 7)
        const rate30 = logs.getCompletionRate(habit.id, 30)

        return (
          <div
            key={habit.id}
            className="bg-white dark:bg-warm-800 rounded-2xl p-5 mb-3.5 shadow-sm border border-warm-200 dark:border-warm-700 animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Habit name */}
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                style={{ background: `${habit.color}18` }}
              >
                {habit.icon}
              </div>
              <span className="font-semibold text-[15px]">{habit.name}</span>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className={`text-center py-3 px-2 rounded-xl ${streak > 0 ? 'bg-terra-500/8' : 'bg-warm-100 dark:bg-warm-900'}`}>
                <div className={`flex items-center justify-center gap-1 text-[22px] font-bold ${streak > 0 ? 'text-terra-500' : 'text-warm-400'}`}>
                  {streak > 0 && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 23c-4.97 0-9-3.58-9-8 0-3.19 2.13-6.38 4-8 0 3 2 5 3 5 0-4 3-8 5-10 1 2 2 4 2 6 1-1 2-2.5 2-4 2.5 3 4 6 4 9 0 4.42-4.03 8-9 8h-2z"/>
                    </svg>
                  )}
                  {streak}
                </div>
                <div className="text-[11px] text-warm-500 mt-1 font-medium">Streak</div>
              </div>
              <div className="text-center py-3 px-2 rounded-xl bg-warm-100 dark:bg-warm-900">
                <div className={`text-[22px] font-bold ${rate7 >= 80 ? 'text-forest-500' : rate7 >= 50 ? 'text-terra-500' : 'text-warm-400'}`}>
                  {rate7}%
                </div>
                <div className="text-[11px] text-warm-500 mt-1 font-medium">Siste 7 dager</div>
              </div>
              <div className="text-center py-3 px-2 rounded-xl bg-warm-100 dark:bg-warm-900">
                <div className={`text-[22px] font-bold ${rate30 >= 80 ? 'text-forest-500' : rate30 >= 50 ? 'text-terra-500' : 'text-warm-400'}`}>
                  {rate30}%
                </div>
                <div className="text-[11px] text-warm-500 mt-1 font-medium">Siste 30 dager</div>
              </div>
            </div>

            {/* Mini bar chart - last 7 days */}
            <div className="flex items-end gap-1 mt-4 h-10">
              {Array.from({ length: 7 }).map((_, j) => {
                const d = new Date(TODAY)
                d.setDate(d.getDate() - (6 - j))
                const done = logs.isLogged(habit.id, d)
                return (
                  <div key={j} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded transition-all duration-300"
                      style={{
                        height: done ? 28 : 8,
                        background: done ? habit.color : `${habit.color}20`,
                      }}
                    />
                    <span className="text-[9px] text-warm-400">
                      {WEEKDAYS_NO[(d.getDay() + 6) % 7]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {habits.length === 0 && (
        <div className="text-center text-warm-400 py-12">
          <p className="text-lg mb-2">Ingen vaner ennå</p>
          <p className="text-sm">Opprett din første vane for å se statistikk her</p>
        </div>
      )}
    </>
  )
}
