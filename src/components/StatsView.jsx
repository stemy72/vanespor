import { WEEKDAYS_NO, fmt, STREAK_MILESTONES } from '../lib/constants'

const TODAY = new Date()

export default function StatsView({ habits, logs }) {
  // Global 30-dagers statistikk
  const globalRate = habits.length > 0
    ? Math.round(
        habits.reduce((sum, h) => sum + logs.getCompletionRate(h.id, 30), 0) / habits.length
      )
    : 0

  const bestStreak = habits.reduce((max, h) => Math.max(max, logs.getStreak(h.id)), 0)

  let perfectDays = 0
  for (let i = 0; i < 30; i++) {
    const d = new Date(TODAY)
    d.setDate(d.getDate() - i)
    if (habits.length > 0 && habits.every(h => logs.isLogged(h.id, d))) perfectDays++
  }

  return (
    <>
      <h2 className="font-display text-[22px] font-bold tracking-tight mb-5">Statistikk</h2>

      {/* Global oversikt */}
      <div className="bg-white dark:bg-warm-800 rounded-2xl p-5 mb-4 shadow-sm border border-warm-200 dark:border-warm-700">
        <p className="text-xs font-medium text-warm-500 mb-3">Samlet siste 30 dager</p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { num: `${globalRate}%`, label: 'Fullf.rate' },
            { num: bestStreak, label: 'Beste streak' },
            { num: perfectDays, label: 'Perfekte dager' },
          ].map(s => (
            <div key={s.label} className="bg-warm-50 dark:bg-warm-900 rounded-xl py-3 px-2 text-center">
              <p className="font-display text-[22px] font-bold text-terra-500">{s.num}</p>
              <p className="text-[11px] text-warm-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* 14-dagers søyler */}
        <div className="flex items-end gap-1 h-12">
          {Array.from({ length: 14 }).map((_, i) => {
            const d = new Date(TODAY)
            d.setDate(d.getDate() - (13 - i))
            const cnt = habits.filter(h => logs.isLogged(h.id, d)).length
            const pct = habits.length > 0 ? cnt / habits.length : 0
            const h = Math.round(pct * 40) + 4
            const bg = pct >= 0.99 ? '#5B8C5A' : pct >= 0.5 ? '#D4764E' : '#E8E5DF'
            const lbl = WEEKDAYS_NO[(d.getDay() + 6) % 7]
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded transition-all duration-300" style={{ height: h, background: bg }} />
                {i % 2 === 0 && <span className="text-[9px] text-warm-400">{lbl}</span>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Per-vane statistikk */}
      {habits.map((habit, i) => {
        const streak = logs.getStreak(habit.id)
        const rate7 = logs.getCompletionRate(habit.id, 7)
        const rate30 = logs.getCompletionRate(habit.id, 30)
        const missed = logs.missedYesterday(habit.id)
        const atRisk = missed && streak > 0

        // Neste milepæl
        const nextMilestone = STREAK_MILESTONES.find(m => m > streak)
        const daysToNext = nextMilestone ? nextMilestone - streak : null

        return (
          <div
            key={habit.id}
            className="bg-white dark:bg-warm-800 rounded-2xl p-5 mb-3.5 shadow-sm border border-warm-200 dark:border-warm-700 animate-fade-up"
            style={{
              animationDelay: `${i * 60}ms`,
              borderColor: atRisk ? '#EF9F27' : undefined,
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-1">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: `${habit.color}18` }}
              >
                {habit.icon}
              </div>
              <span className="font-semibold text-[15px] flex-1">{habit.name}</span>
              {atRisk && (
                <span className="text-[11px] font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-lg">
                  ⚠️ Gikk glipp av i går
                </span>
              )}
            </div>

            {/* Milepæl-hint */}
            {daysToNext !== null && (
              <p className="text-[11px] text-warm-400 mb-3 ml-11">
                {daysToNext === 1
                  ? `🎯 Én dag til neste milepæl (${nextMilestone} dager)!`
                  : `🎯 ${daysToNext} dager til neste milepæl (${nextMilestone} dager)`}
              </p>
            )}

            {/* Tall-grid */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className={`text-center py-3 px-2 rounded-xl ${streak > 0 ? 'bg-terra-500/8' : 'bg-warm-100 dark:bg-warm-900'}`}>
                <div className={`flex items-center justify-center gap-1 text-[22px] font-bold ${streak > 0 ? 'text-terra-500' : 'text-warm-400'}`}>
                  {streak > 0 && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
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

            {/* Mini-søylediagram siste 7 dager */}
            <div className="flex items-end gap-1 h-10">
              {Array.from({ length: 7 }).map((_, j) => {
                const d = new Date(TODAY)
                d.setDate(d.getDate() - (6 - j))
                const done = logs.isLogged(habit.id, d)
                return (
                  <div key={j} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded transition-all duration-300"
                      style={{ height: done ? 28 : 8, background: done ? habit.color : `${habit.color}20` }}
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
